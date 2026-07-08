import type { CollectionEntry } from "astro:content";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/i18n";

export type PostEntry = CollectionEntry<"posts">;
export type TranslationLinks = Partial<Record<Locale, string>>;

interface PostLabels {
  allPosts: string;
  empty: string;
  inThisReport: string;
  indexDescription: string;
  indexTitle: string;
  noSections: string;
  published: string;
  readTime: string;
  report: string;
  sectionsPending: string;
  topics: string;
  updated: string;
}

const POST_LABELS: Record<Locale, PostLabels> = {
  en: {
    allPosts: "All posts",
    empty: "Posts coming soon.",
    inThisReport: "In This Report",
    indexDescription: "All posts by Gen Li — research, cycling, books, and more.",
    indexTitle: "Writing",
    noSections: "No sections.",
    published: "Published",
    readTime: "Read time",
    report: "Report",
    sectionsPending: "Sections will appear here.",
    topics: "Topics",
    updated: "Updated",
  },
  zh: {
    allPosts: "所有文章",
    empty: "文章还在整理中。",
    inThisReport: "本文目录",
    indexDescription: "Gen Li 的文章：能源系统、研究、骑行、阅读与生活。",
    indexTitle: "文章",
    noSections: "暂无章节。",
    published: "发布",
    readTime: "阅读时间",
    report: "报告",
    sectionsPending: "章节会显示在这里。",
    topics: "主题",
    updated: "更新",
  },
  de: {
    allPosts: "Alle Beiträge",
    empty: "Beiträge folgen.",
    inThisReport: "In Diesem Beitrag",
    indexDescription: "Alle Beiträge von Gen Li — Forschung, Radsport, Bücher und mehr.",
    indexTitle: "Beiträge",
    noSections: "Keine Abschnitte.",
    published: "Veröffentlicht",
    readTime: "Lesezeit",
    report: "Report",
    sectionsPending: "Abschnitte erscheinen hier.",
    topics: "Themen",
    updated: "Aktualisiert",
  },
};

const DATE_LOCALES: Record<Locale, string> = {
  en: "en-GB",
  zh: "zh-CN",
  de: "de-DE",
};

function stripMarkdownExtension(id: string): string {
  return id.replace(/\.mdx?$/, "");
}

export function getPostLocale(post: PostEntry): Locale {
  const locale = post.data.locale;
  return SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
}

export function getPostSlug(post: PostEntry): string {
  if (post.data.canonicalSlug) return post.data.canonicalSlug;

  return stripMarkdownExtension(post.id)
    .replace(/^(en|zh|de)\//, "")
    .replace(/\.(en|zh|de)$/, "");
}

export function getPostTranslationKey(post: PostEntry): string {
  return post.data.translationKey ?? getPostSlug(post);
}

export function getPostUrl(post: PostEntry): string {
  const locale = getPostLocale(post);
  const slug = getPostSlug(post);
  return locale === DEFAULT_LOCALE ? `/posts/${slug}/` : `/${locale}/posts/${slug}/`;
}

export function getPostsIndexUrl(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "/posts/" : `/${locale}/posts/`;
}

export function getPostLabels(locale: Locale): PostLabels {
  return POST_LABELS[locale];
}

export function getPostsForLocale(posts: PostEntry[], locale: Locale): PostEntry[] {
  return posts
    .filter((post) => getPostLocale(post) === locale)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getPostByLocaleAndSlug(
  posts: PostEntry[],
  locale: Locale,
  slug: string
): PostEntry | undefined {
  return posts.find((post) => getPostLocale(post) === locale && getPostSlug(post) === slug);
}

export function getPostTranslationLinks(posts: PostEntry[], post: PostEntry): TranslationLinks {
  const translationKey = getPostTranslationKey(post);
  const links: TranslationLinks = {};

  for (const candidate of posts) {
    if (getPostTranslationKey(candidate) !== translationKey) continue;
    links[getPostLocale(candidate)] = getPostUrl(candidate);
  }

  return links;
}

export function formatPostDate(
  date: Date,
  locale: Locale,
  style: "short" | "long" = "short"
): string {
  return date.toLocaleDateString(DATE_LOCALES[locale], {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  });
}

export function estimateReadingTime(body: string | undefined, locale: Locale): string {
  const source = body ?? "";
  const words = source.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g)?.length ?? 0;
  const cjkChars = source.match(/[\u3400-\u9FFF]/g)?.length ?? 0;
  const minutes =
    locale === "zh"
      ? Math.max(1, Math.round(cjkChars / 500 + words / 220))
      : Math.max(1, Math.round(words / 200));

  if (locale === "zh") return `${minutes} 分钟阅读`;
  if (locale === "de") return `${minutes} Min. Lesezeit`;
  return `${minutes} min read`;
}
