import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { DEFAULT_LOCALE } from "@/i18n";
import { getPostUrl, getPostsForLocale } from "@/utils/posts";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  const sorted = getPostsForLocale(posts, DEFAULT_LOCALE);

  return rss({
    title: "Gen Li",
    description:
      "PhD Researcher at TU Munich. Writing on energy systems, cycling, and books.",
    site: context.site!,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: getPostUrl(post),
    })),
  });
}
