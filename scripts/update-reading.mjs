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
//
// English titles come from Wikidata (free, no key): a book gets one when Wikidata has a
// written work with that Chinese title, a matching author and an English label. Books it
// can't find keep their Chinese title; WEREAD_OVERRIDES in src/data/library.ts can add one.

import fs from "node:fs";
import path from "node:path";

const GATEWAY = "https://i.weread.qq.com/api/agent/gateway";
const SKILL_VERSION = "1.0.5";
const MIN_SECONDS = 3 * 60 * 60;
const CONCURRENCY = 4;
const OUT_PATH = path.join(process.cwd(), "src/data/reading.json");
// WeRead buckets reading time by Beijing calendar days
const BEIJING_OFFSET_SECONDS = 8 * 60 * 60;
// preferTime starts at 06:00 Beijing time and runs to 05:00 the next day
const PREFER_TIME_START_HOUR = 6;
const HOURS_TIME_ZONE = "Europe/Berlin";
// Year used to measure how much of the year Europe/Berlin spends on summer time
const DST_REFERENCE_YEAR = 2025;
const WIKIDATA_API = "https://www.wikidata.org/w/api.php";
const WIKIDATA_HEADERS = {
  "User-Agent": "gen-web-reading-sync/1.0 (https://github.com/GenLI3202/root-gl-web)",
};
// A candidate counts as the book only when its description names a written work…
const WRITTEN_WORK = /\b(novel|novella|book|short story|stories|story collection|poem|poetry|essay|memoir|biography|non-?fiction|play|trilogy|literary work|written work)\b/i;
// …and not an adaptation or another medium
const OTHER_MEDIUM = /\b(film|television|tv series|series project|video game|game|song|album|opera|manga|anime|episode|scholarly article)\b/i;

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

/** Share of days in DST_REFERENCE_YEAR on which Europe/Berlin is UTC+2 (summer time) */
function summerTimeShare() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: HOURS_TIME_ZONE,
    timeZoneName: "shortOffset",
  });
  let summerDays = 0;
  let days = 0;
  const day = new Date(Date.UTC(DST_REFERENCE_YEAR, 0, 1, 12));
  while (day.getUTCFullYear() === DST_REFERENCE_YEAR) {
    const offset = formatter.formatToParts(day).find((p) => p.type === "timeZoneName")?.value;
    if (offset === "GMT+2") summerDays++;
    days++;
    day.setUTCDate(day.getUTCDate() + 1);
  }
  return summerDays / days;
}

/** Wikidata API call with the descriptive User-Agent its usage policy asks for */
async function wikidata(params) {
  const url = `${WIKIDATA_API}?${new URLSearchParams({ format: "json", ...params })}`;
  const res = await fetch(url, { headers: WIKIDATA_HEADERS });
  if (!res.ok) throw new Error(`Wikidata HTTP ${res.status}`);
  return res.json();
}

/** "鹿鼎记（套装共5册）纯文字版" → "鹿鼎记", "置身事内：中国政府与经济发展" → "置身事内" */
function searchTitle(title) {
  const short = title
    .replace(/[《》]/g, "")
    .replace(/[（(].*$/, "")
    .replace(/[-—]?(纯文字版|大字版)$/, "")
    .split("：")[0]
    .trim();
  return short || title;
}

/** CJK characters of a name, without nationality tags like [英] or name dots */
function nameChars(name) {
  return new Set(name.replace(/[[［【(（].*?[\]］】)）]/g, "").match(/[\u3400-\u9fff]/g) ?? []);
}

/** True when two author names share at least two CJK characters, e.g. 毛姆 in both */
function sameAuthor(ours, theirs) {
  const a = nameChars(ours);
  let shared = 0;
  for (const ch of nameChars(theirs)) if (a.has(ch)) shared += 1;
  return shared >= 2;
}

/** The English title Wikidata has for this book, or null when it has no confident match */
async function wikidataTitle(book) {
  const search = await wikidata({
    action: "wbsearchentities",
    search: searchTitle(book.title),
    language: "zh",
    uselang: "en",
    type: "item",
    limit: "7",
  });
  const candidates = (search.search ?? []).filter(
    (c) => WRITTEN_WORK.test(c.description ?? "") && !OTHER_MEDIUM.test(c.description ?? "")
  );
  if (candidates.length === 0) return null;

  const items = await wikidata({
    action: "wbgetentities",
    ids: candidates.map((c) => c.id).join("|"),
    props: "labels|claims",
    languages: "en",
  });
  for (const candidate of candidates) {
    const item = items.entities?.[candidate.id];
    const english = item?.labels?.en?.value;
    if (!english) continue;
    const authorIds = (item.claims?.P50 ?? [])
      .map((claim) => claim.mainsnak?.datavalue?.value?.id)
      .filter(Boolean);
    if (authorIds.length === 0) return english;
    const authors = await wikidata({
      action: "wbgetentities",
      ids: authorIds.join("|"),
      props: "labels|aliases",
      languages: "zh|zh-hans|zh-cn",
    });
    const names = Object.values(authors.entities ?? {}).flatMap((entity) => [
      ...Object.values(entity.labels ?? {}).map((l) => l.value),
      ...Object.values(entity.aliases ?? {}).flatMap((list) => list.map((a) => a.value)),
    ]);
    if (names.some((name) => sameAuthor(book.author, name))) return english;
  }
  return null;
}

/**
 * Looks up an English title for each book not looked up before. A found title is stored as
 * `titleEn`; null records that Wikidata had none, so the book is only asked about again on a
 * --full run. A failed lookup leaves the field unset and is retried on the next run.
 */
async function addEnglishTitles(list) {
  const pending = list.filter((b) => b.titleEn === undefined || (fullScan && b.titleEn === null));
  let found = 0;
  for (const book of pending) {
    try {
      book.titleEn = await wikidataTitle(book);
      if (book.titleEn) found += 1;
    } catch (error) {
      console.warn(`English title lookup failed for ${book.title}: ${error?.message ?? error}`);
    }
  }
  if (pending.length > 0) console.log(`English titles from Wikidata: ${found}/${pending.length}.`);
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

// preferTime is an all-time aggregate in Beijing time and cannot be split by date. It is
// moved to Munich time with the usual shift, 6 h in summer (CEST) and 7 h in winter (CET),
// weighted by the share of the year on summer time. Time spent in other zones or on other
// clock changes cannot be separated out. Years above stay on Beijing calendar days.
const preferTime = overall.preferTime ?? [];
const summerShare = summerTimeShare();
const beijingHours =
  preferTime.length === 24
    ? Array.from({ length: 24 }, (_, h) => preferTime[(h - PREFER_TIME_START_HOUR + 24) % 24])
    : [];
const hours = beijingHours.length
  ? beijingHours.map((_, h) => {
      const summer = beijingHours[(h + 6) % 24];
      const winter = beijingHours[(h + 7) % 24];
      return Math.round(summerShare * summer + (1 - summerShare) * winter);
    })
  : [];

const stats = {
  totalSeconds: overall.totalReadTime ?? 0,
  readDays: overall.readDays ?? 0,
  booksRead: countOf(overall.readStat, "读过"),
  booksFinished: countOf(overall.readStat, "读完"),
  notes: countOf(overall.readStat, "笔记"),
  years,
  hours,
  hoursTimeZone: HOURS_TIME_ZONE,
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
    // Kept while the WeRead title is unchanged; undefined means not looked up yet
    titleEn: prior?.title === b.title ? prior.titleEn : undefined,
  });
}
books.sort((a, b) => b.lastReadAt - a.lastReadAt || a.id.localeCompare(b.id));
await addEnglishTitles(books);

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
