import type { Locale } from "@/i18n";
import type { HandIconName } from "@/components/hand-icons";

/**
 * "Lately" section on the homepage — what Gen is up to right now.
 * Edit the items and NOW_UPDATED together whenever life changes.
 */

export const NOW_UPDATED = "2026-10";

export interface NowItem {
  icon: HandIconName;
  label: string;
  text: string;
  href?: string;
}

export const NOW_ITEMS: Record<Locale, NowItem[]> = {
  en: [
    {
      icon: "battery",
      label: "Researching",
      text: "Local EMS in my PhD internship at Huawei. On the side: energy management for AI data-center campuses.",
      href: "/posts/intersolar-2026-ems-lems-insights/",
    },
    {
      icon: "bike",
      label: "Riding",
      text: "Leading group rides with Across Cycling Club Munich, and building the club's ClubHub site.",
      href: "https://www.across-cc.de/",
    },
    {
      icon: "book",
      label: "Reading",
      text: "Wuxia and science fiction on WeChat Reading. Zhang Beihai, Luo Ji and Cheng Xin from the Three-Body trilogy stay on my mind.",
      href: "/hobbies/",
    },
    {
      icon: "guitar",
      label: "Playing",
      text: "Twenty minutes of fingerpicking after long days. Still learning.",
      href: "/hobbies/",
    },
  ],
  zh: [
    {
      icon: "battery",
      label: "在研究",
      text: "在华为博士实习，做本地 EMS。另一个兴趣点：AI 数据中心园区的能量管理。",
      href: "/zh/posts/intersolar-2026-ems-lems-insights/",
    },
    {
      icon: "bike",
      label: "在骑车",
      text: "带 Across 骑行俱乐部的团骑，顺便给俱乐部写 ClubHub 网站。",
      href: "https://www.across-cc.de/",
    },
    {
      icon: "book",
      label: "在读",
      text: "微信读书上的武侠和科幻。《三体》里的章北海、罗辑、程心，时常还会想起。",
      href: "/zh/hobbies/",
    },
    {
      icon: "guitar",
      label: "在弹",
      text: "累了一天之后，弹二十分钟指弹。还在学。",
      href: "/zh/hobbies/",
    },
  ],
  de: [
    {
      icon: "battery",
      label: "Forschung",
      text: "Lokales EMS in meinem PhD-Praktikum bei Huawei. Daneben: Energiemanagement für KI-Rechenzentrumsparks.",
      href: "/posts/intersolar-2026-ems-lems-insights/",
    },
    {
      icon: "bike",
      label: "Radfahren",
      text: "Ich leite Gruppenausfahrten beim Across Cycling Club München und baue die ClubHub-Seite.",
      href: "https://www.across-cc.de/",
    },
    {
      icon: "book",
      label: "Lesen",
      text: "Wuxia und Science-Fiction in WeChat Reading. Zhang Beihai, Luo Ji und Cheng Xin aus der Trisolaris-Trilogie gehen mir nicht aus dem Kopf.",
      href: "/de/hobbies/",
    },
    {
      icon: "guitar",
      label: "Gitarre",
      text: "Zwanzig Minuten Fingerpicking nach langen Tagen. Ich lerne noch.",
      href: "/de/hobbies/",
    },
  ],
};
