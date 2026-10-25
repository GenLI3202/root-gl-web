import type { Locale } from "@/i18n";

/**
 * "Lately" section on the homepage — what Gen is up to right now.
 * Edit the items and NOW_UPDATED together whenever life changes.
 */

export const NOW_UPDATED = "2026-10";

export interface NowItem {
  icon: string;
  label: string;
  text: string;
  href?: string;
}

export const NOW_ITEMS: Record<Locale, NowItem[]> = {
  en: [
    {
      icon: "🔋",
      label: "Researching",
      text: "Battery storage and site-level energy management. Still unpacking my Intersolar 2026 notes.",
      href: "/posts/intersolar-2026-ems-lems-insights/",
    },
    {
      icon: "🚴",
      label: "Riding",
      text: "Leading group rides with Accross Cycling Club Munich, and building the club's ClubHub site.",
      href: "https://acc-clubhub.vercel.app/",
    },
    {
      icon: "📖",
      label: "Reading",
      text: "Wuxia and science fiction on WeChat Reading. Guo Jing and Ye Wenjie are still good company.",
      href: "/hobbies/",
    },
    {
      icon: "🎸",
      label: "Playing",
      text: "Twenty minutes of fingerpicking after long days. Still learning.",
      href: "/hobbies/",
    },
  ],
  zh: [
    {
      icon: "🔋",
      label: "在研究",
      text: "储能与场站级能量管理。Intersolar 2026 的笔记还在慢慢消化。",
      href: "/zh/posts/intersolar-2026-ems-lems-insights/",
    },
    {
      icon: "🚴",
      label: "在骑车",
      text: "带 Accross 骑行俱乐部的团骑，顺便给俱乐部写 ClubHub 网站。",
      href: "https://acc-clubhub.vercel.app/",
    },
    {
      icon: "📖",
      label: "在读",
      text: "微信读书上的武侠和科幻。郭靖和叶文洁依旧是好伙伴。",
      href: "/zh/hobbies/",
    },
    {
      icon: "🎸",
      label: "在弹",
      text: "累了一天之后，弹二十分钟指弹。还在学。",
      href: "/zh/hobbies/",
    },
  ],
  de: [
    {
      icon: "🔋",
      label: "Forschung",
      text: "Batteriespeicher und Energiemanagement auf Standortebene. Meine Intersolar-2026-Notizen sortiere ich noch.",
      href: "/posts/intersolar-2026-ems-lems-insights/",
    },
    {
      icon: "🚴",
      label: "Radfahren",
      text: "Ich leite Gruppenausfahrten beim Accross Cycling Club München und baue die ClubHub-Seite.",
      href: "https://acc-clubhub.vercel.app/",
    },
    {
      icon: "📖",
      label: "Lesen",
      text: "Wuxia und Science-Fiction in WeChat Reading. Guo Jing und Ye Wenjie sind immer noch gute Gesellschaft.",
      href: "/de/hobbies/",
    },
    {
      icon: "🎸",
      label: "Gitarre",
      text: "Zwanzig Minuten Fingerpicking nach langen Tagen. Ich lerne noch.",
      href: "/de/hobbies/",
    },
  ],
};
