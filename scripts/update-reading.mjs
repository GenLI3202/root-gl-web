// Daily WeChat Reading (微信读书) sync for the Hobbies → Reading page.
//
// Pulls public reading statistics and the books on the WeRead shelf, then writes
// src/data/reading.json. A book is listed once its cumulative reading time reaches
// MIN_SECONDS; private books (secret = 1) are never written. The page reads the
// JSON at build time, so a commit of a changed file is enough to redeploy.
// Invoked by .github/workflows/reading-update.yml, or locally with
// `npm run update:reading` (add `-- --full` to re-check every book).
//
// Required env:
//   WEREAD_API_KEY — WeRead agent API key (wrk-…), repository secret in CI

import fs from "node:fs";
import path from "node:path";

const GATEWAY = "https://i.weread.qq.com/api/agent/gateway";
const SKILL_VERSION = "1.0.5";
const MIN_SECONDS = 3 * 60 * 60;
const CONCURRENCY = 4;
const OUT_PATH = path.join(process.cwd(), "src/data/reading.json");
// WeRead buckets reading time by Beijing calendar days
const BEIJING_OFFSET_SECONDS = 8 * 60 * 60;
// preferTime starts at 06:00 and runs to 05:00 the next day
const PREFER_TIME_START_HOUR = 6;

const API_KEY = process.env.WEREAD_API_KEY;
if (!API_KEY) {
  console.error("WEREAD_API_KEY is not set. Add it as a repository secret (format wrk-…).");
  process.exit(1);
}

const fullScan = process.argv.includes("--full");

async function call(apiName, params = {}) {
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ api_name: apiName, ...params, skill_version: SKILL_VERSION }),
  });
  if (!res.ok) throw new Error(`${apiName}: HTTP ${res.status}`);
  const data = await res.json();
  if (data.upgrade_info) {
    throw new Error(`${apiName}: API asks for a skill upgrade: ${JSON.stringify(data.upgrade_info)}`);
  }
  if (data.errcode) throw new Error(`${apiName}: errcode ${data.errcode} ${data.errmsg ?? ""}`);
  return data;
}

/** Runs `task` over `items` with at most CONCURRENCY requests in flight */
async function mapPool(items, task) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await task(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, worker));
  return results;
}

function beijingYear(unixSeconds) {
  return new Date((Number(unixSeconds) + BEIJING_OFFSET_SECONDS) * 1000).getUTCFullYear();
}

/** "162本" → 162 */
function countOf(readStat, name) {
  const entry = (readStat ?? []).find((s) => s.stat === name);
  const match = entry?.counts?.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

async function fetchNotebooks() {
  const books = [];
  let lastSort;
  for (;;) {
    const page = await call("/user/notebooks", { count: 100, ...(lastSort ? { lastSort } : {}) });
    books.push(...(page.books ?? []));
    if (page.hasMore !== 1 || !page.books?.length) break;
    lastSort = page.books[page.books.length - 1].sort;
  }
  return new Map(books.map((b) => [String(b.bookId), b]));
}

const previous = fs.existsSync(OUT_PATH) ? JSON.parse(fs.readFileSync(OUT_PATH, "utf8")) : null;

const [shelf, overall, notebooks] = await Promise.all([
  call("/shelf/sync"),
  call("/readdata/detail", { mode: "overall", baseTime: 0 }),
  fetchNotebooks(),
]);

// ── Statistics ──
const yearSeconds = new Map();
for (const [bucket, seconds] of Object.entries(overall.readTimes ?? {})) {
  const year = beijingYear(bucket);
  yearSeconds.set(year, (yearSeconds.get(year) ?? 0) + seconds);
}
const years = [...yearSeconds.entries()]
  .sort(([a], [b]) => a - b)
  .map(([year, seconds]) => ({ year, seconds }));
// Drop empty years before the first year with any reading
while (years.length && years[0].seconds === 0) years.shift();

const preferTime = overall.preferTime ?? [];
const hours =
  preferTime.length === 24
    ? Array.from({ length: 24 }, (_, h) => preferTime[(h - PREFER_TIME_START_HOUR + 24) % 24])
    : [];

const stats = {
  totalSeconds: overall.totalReadTime ?? 0,
  readDays: overall.readDays ?? 0,
  booksRead: countOf(overall.readStat, "读过"),
  booksFinished: countOf(overall.readStat, "读完"),
  notes: countOf(overall.readStat, "笔记"),
  years,
  hours,
};

// ── Books ──
const publicBooks = (shelf.books ?? []).filter((b) => b.secret !== 1);
const syncedThrough = Math.max(0, ...publicBooks.map((b) => b.readUpdateTime ?? 0));
const sinceLastRun = fullScan || !previous ? 0 : previous.syncedThrough ?? 0;
const previousById = new Map((previous?.books ?? []).map((b) => [b.id, b]));

// Reading time only changes when a book is opened, so only books read since the
// last run need a progress lookup; the rest keep their previous record.
const toCheck = publicBooks.filter((b) => (b.readUpdateTime ?? 0) > sinceLastRun);
const progress = new Map(
  (await mapPool(toCheck, (b) => call("/book/getprogress", { bookId: b.bookId }))).map((p) => [
    String(p.bookId),
    p.book ?? {},
  ])
);

const books = [];
for (const b of publicBooks) {
  const id = String(b.bookId);
  const fresh = progress.get(id);
  const prior = previousById.get(id);
  if (!fresh && !prior) continue;

  // The cumulative time lives in readingTime; recordReadingTime is usually 0
  const seconds = fresh
    ? Math.max(fresh.readingTime ?? 0, fresh.recordReadingTime ?? 0)
    : prior.seconds;
  if (seconds < MIN_SECONDS) continue;

  const note = notebooks.get(id);
  const finishedAt = fresh ? fresh.finishTime ?? null : prior.finishedAt;
  books.push({
    id,
    title: b.title,
    author: b.author ?? "",
    category: b.category ?? "",
    seconds,
    progress: fresh ? fresh.progress ?? 0 : prior.progress,
    finishedAt: finishedAt ?? null,
    lastReadAt: b.readUpdateTime ?? 0,
    highlights: note?.noteCount ?? 0,
    thoughts: note?.reviewCount ?? 0,
    link: b.deepLink ?? null,
  });
}
books.sort((a, b) => b.lastReadAt - a.lastReadAt || a.id.localeCompare(b.id));

const output = { syncedThrough, stats, books };
const json = `${JSON.stringify(output, null, 2)}\n`;

if (previous && fs.readFileSync(OUT_PATH, "utf8") === json) {
  console.log("Reading data unchanged.");
} else {
  fs.writeFileSync(OUT_PATH, json);
  console.log(
    `Wrote ${path.relative(process.cwd(), OUT_PATH)}: ${books.length} books, ` +
      `${toCheck.length} progress lookups, ${Math.round(stats.totalSeconds / 3600)} h total.`
  );
}
