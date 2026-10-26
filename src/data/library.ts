import type { Locale } from "@/i18n";
import { BOOKS, type Book, type BookCategory } from "@/data/books";
import reading from "@/data/reading.json";

/**
 * The full Reading shelf: hand-written books from books.ts plus every public WeRead book
 * with at least three hours of reading, synced daily by scripts/update-reading.mjs.
 */

/** One synced WeRead book; times are Unix seconds */
export interface WereadBook {
  id: string;
  title: string;
  author: string;
  /** WeRead category path, such as "文学-外国文学" */
  category: string;
  seconds: number;
  /** Reading progress, 0–100 */
  progress: number;
  finishedAt: number | null;
  lastReadAt: number;
  highlights: number;
  thoughts: number;
  link: string | null;
  /** English title written by the sync script (official title or a translation) */
  titleEn?: string;
}

export interface ReadingStats {
  totalSeconds: number;
  readDays: number;
  booksRead: number;
  booksFinished: number;
  notes: number;
  years: { year: number; seconds: number }[];
  /** Reading seconds per hour of the day in local Munich time, index 0 = 00:00 */
  hours: number[];
  /** IANA time zone of `hours` */
  hoursTimeZone: string;
}

export interface ShelfBook extends Omit<Book, "titleEn" | "about" | "recent"> {
  titleEn?: string;
  about?: Record<Locale, string>;
  /** WeRead title when the shelf shows a shorter one */
  fullTitle?: string;
  reading?: WereadBook;
  recent: boolean;
}

/**
 * Hand fixes for synced books: a shorter title, an English title, another category, or hide.
 * A `titleEn` here wins over the one the sync script writes into reading.json.
 */
interface WereadOverride {
  title?: string;
  titleEn?: string;
  category?: BookCategory;
  hidden?: boolean;
}

export const WEREAD_OVERRIDES: Record<string, WereadOverride> = {
  "3300060404": { titleEn: "Hesse: Letters" },
  "3300027311": { titleEn: "Hesse: Selected Works" },
  "26767625": { titleEn: "Maugham: Selected Novels" },
  "3300041002": { titleEn: "The Painted Veil" },
  "857863": { titleEn: "Flowers for Algernon" },
  "31808219": { titleEn: "The Brothers Karamazov" },
  "3300117751": { titleEn: "The City and Its Uncertain Walls" },
  "33638851": { titleEn: "The Paris Review Interviews" },
  "35459982": { title: "潮骚", titleEn: "The Sound of Waves" },
  "833793": { titleEn: "Pride and Prejudice" },
  "35008168": { titleEn: "Blossoms" },
  "3300003116": { titleEn: "First Person Singular" },
  "934835": { titleEn: "Someone to Talk To" },
  "27689995": { titleEn: "Thus Spoke Zarathustra" },
  "855799": { titleEn: "When Nietzsche Wept" },
  "855327": { titleEn: "Siddhartha" },
  "23976240": { titleEn: "My Name Is Red" },
  "35551088": { titleEn: "Counselling for Toads" },
  "29348532": { titleEn: "Fragile Lives" },
  "40527660": { titleEn: "The Old Man and the Sea" },
  "907334": { titleEn: "The Bad Kids" },
  "3300042491": { titleEn: "Ruined City" },
  "3300025105": { titleEn: "Ten Years in Germany" },
  "27258789": { titleEn: "Jiangnan Trilogy" },
  "3300108679": { titleEn: "Intimate Relationships" },
  "41452812": { titleEn: "Social Psychology" },
  "932426": { titleEn: "Ode to Gallantry" },
  "22946457": { titleEn: "Fortress Besieged" },
  "932433": { titleEn: "Sword Stained with Royal Blood" },
  "932425": { titleEn: "The Deer and the Cauldron" },
  "3300071815": { titleEn: "Time Migration" },
  "3300019669": { titleEn: "Liang Yong'an on Love" },
  "3300091348": { titleEn: "Twisted Loves" },
  "32282840": { titleEn: "Alienation and Acceleration" },
  "3300018590": { titleEn: "What Do You Say After You Say Hello?" },
  "25631121": { titleEn: "Interstellar Wars" },
};

/** A book counts as recently read when opened within this many days */
const RECENT_DAYS = 30;

/** WeRead category → bookcase; the first match wins, anything else is literature */
const CATEGORY_RULES: [RegExp, BookCategory][] = [
  [/武侠/, "wuxia"],
  [/科幻|科学技术/, "scifi"],
  [/^(政治军事|经济理财|历史|人物传记)/, "polecon"],
  [/^(心理|哲学宗教|社会文化|个人成长|生活百科|教育学习)/, "ideas"],
];

export const READING_STATS = reading.stats as ReadingStats;

const SYNCED = reading.books as WereadBook[];
const NOW_SECONDS = Date.now() / 1000;

function categoryOf(wereadCategory: string): BookCategory {
  return CATEGORY_RULES.find(([pattern]) => pattern.test(wereadCategory))?.[1] ?? "literature";
}

/** "鹿鼎记（套装共5册）纯文字版" → "鹿鼎记", "置身事内：中国政府与经济发展" → "置身事内" */
function shortTitle(title: string): string {
  const short = title
    .replace(/[《》]/g, "")
    .replace(/[（(].*$/, "")
    .replace(/[-—]?(纯文字版|大字版)$/, "")
    .split("：")[0]
    .trim();
  return short || title;
}

function isRecent(book?: WereadBook): boolean {
  return Boolean(book) && NOW_SECONDS - book!.lastReadAt < RECENT_DAYS * 24 * 60 * 60;
}

const syncedById = new Map(SYNCED.map((b) => [b.id, b]));
const linkedIds = new Set(BOOKS.map((b) => b.wereadId).filter(Boolean));

const curated: ShelfBook[] = BOOKS.map((book) => {
  const synced = book.wereadId ? syncedById.get(book.wereadId) : undefined;
  return { ...book, reading: synced, recent: synced ? isRecent(synced) : Boolean(book.recent) };
});

const fromWeread: ShelfBook[] = SYNCED.filter(
  (b) => !linkedIds.has(b.id) && !WEREAD_OVERRIDES[b.id]?.hidden
).map((b) => {
  const override = WEREAD_OVERRIDES[b.id] ?? {};
  const title = override.title ?? shortTitle(b.title);
  return {
    id: `weread-${b.id}`,
    title,
    titleEn: override.titleEn ?? b.titleEn,
    fullTitle: title !== b.title ? b.title : undefined,
    author: b.author,
    category: override.category ?? categoryOf(b.category),
    reading: b,
    recent: isRecent(b),
  };
});

/** Title to show in a locale: the original on Chinese pages, the English one elsewhere */
export function titleFor(book: ShelfBook, locale: Locale): string {
  return locale === "zh" ? book.title : book.titleEn ?? book.title;
}

/** The other title, shown smaller beside the main one, or undefined when there is none */
export function altTitleFor(book: ShelfBook, locale: Locale): string | undefined {
  const main = titleFor(book, locale);
  const other = main === book.title ? book.titleEn : book.title;
  return other && other !== main ? other : undefined;
}

/** Seconds → hours, with one decimal under ten hours: 14 040 → 3.9, 117 194 → 33 */
export function toHours(seconds: number): number {
  const hours = seconds / 3600;
  return hours < 10 ? Math.round(hours * 10) / 10 : Math.round(hours);
}

/** Most recently read first; hand-written books without WeRead data follow their ribbon */
function recency(book: ShelfBook): number {
  return book.reading?.lastReadAt ?? (book.recent ? NOW_SECONDS : 0);
}

export const LIBRARY: ShelfBook[] = [...curated, ...fromWeread].sort(
  (a, b) => recency(b) - recency(a)
);
