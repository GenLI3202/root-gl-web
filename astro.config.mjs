import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://genli.dev",
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    // The training room is reached only through the cycling page, so it stays out of the sitemap
    sitemap({ filter: (page) => !page.includes("/training/") }),
  ],
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh", "de"],
    routing: { prefixDefaultLocale: false },
  },
});
