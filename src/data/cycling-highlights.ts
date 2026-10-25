import type { Locale } from "@/i18n";

/**
 * Rides worth remembering, in the order they appear on the cycling page. Each entry covers a
 * span of dates; the rides on those days (at least `minKm` each, which leaves out short rides
 * from the front door) are drawn as a route sketch and picked out on the map. Edit the words
 * freely: they are Gen's one-liners.
 */
export interface Highlight {
  id: string;
  /** First and last day, YYYY-MM-DD, both included */
  from: string;
  to: string;
  /** Skip rides shorter than this when picking the tracks */
  minKm?: number;
  title: Record<Locale, string>;
  note: Record<Locale, string>;
}

export const HIGHLIGHTS: Highlight[] = [
  {
    id: "venice-2024",
    from: "2024-07-18",
    to: "2024-07-21",
    minKm: 20,
    title: {
      en: "Munich to Venice",
      zh: "慕尼黑到威尼斯",
      de: "München nach Venedig",
    },
    note: {
      en: "Four days over the Brenner and through Trento. A broken cleat, a broken phone, and a night ride to reach Venice before sunrise.",
      zh: "四天，翻过布伦纳山口，穿过特伦托。锁踏坏了，手机也坏了，最后夜骑赶在日出前到威尼斯。",
      de: "Vier Tage über den Brenner und durch Trient. Ein kaputter Cleat, ein kaputtes Handy und eine Nachtfahrt, um Venedig vor Sonnenaufgang zu erreichen.",
    },
  },
  {
    id: "may-trip-2025",
    from: "2025-05-01",
    to: "2025-05-04",
    minKm: 20,
    title: {
      en: "May trip: Salzburg to Graz",
      zh: "五月之旅：萨尔茨堡到格拉茨",
      de: "Maitour: Salzburg nach Graz",
    },
    note: {
      en: "Ramingstein, Bled, Wies, Graz. Four days, two countries, and a lake in the middle.",
      zh: "拉明施泰因、布莱德、维斯、格拉茨。四天，两个国家，中间还有一个湖。",
      de: "Ramingstein, Bled, Wies, Graz. Vier Tage, zwei Länder und ein See in der Mitte.",
    },
  },
  {
    id: "climb-meditation-2025",
    from: "2025-09-04",
    to: "2025-09-04",
    minKm: 20,
    title: {
      en: "Climb meditation",
      zh: "爬坡冥想",
      de: "Kletter-Meditation",
    },
    note: {
      en: "Mittenwald and a great deal of mountain. Lesson learned: never cheese spaghetti during a ride.",
      zh: "米滕瓦尔德，一整天的山。教训：骑行途中千万别吃芝士意面。",
      de: "Mittenwald und ziemlich viel Berg. Gelernt: nie Käsespaghetti während der Fahrt.",
    },
  },
  {
    id: "gran-canaria-2025",
    from: "2025-12-26",
    to: "2025-12-27",
    minKm: 20,
    title: {
      en: "Gran Canaria",
      zh: "大加那利岛",
      de: "Gran Canaria",
    },
    note: {
      en: "The first rides over Christmas. Cycling paradise, as advertised.",
      zh: "圣诞期间的头两次骑行。骑行天堂，名不虚传。",
      de: "Die ersten Ausfahrten über Weihnachten. Radfahrer-Paradies, wie versprochen.",
    },
  },
  {
    id: "easter-2026",
    from: "2026-04-01",
    to: "2026-04-07",
    minKm: 20,
    title: {
      en: "Easter ride: Bolzano, Lake Garda, Milan",
      zh: "复活节骑行：博尔扎诺、加尔达湖、米兰",
      de: "Osterausfahrt: Bozen, Gardasee, Mailand",
    },
    note: {
      en: "Day two ended early because the road was simply too bad. The rest was lakes and valleys.",
      zh: "第二天路况太差，提前收工。剩下的都是湖和山谷。",
      de: "Tag zwei endete früher, weil die Straße einfach zu schlecht war. Der Rest war Seen und Täler.",
    },
  },
  {
    id: "dach-2026",
    from: "2026-09-13",
    to: "2026-09-19",
    minKm: 20,
    title: {
      en: "Across D-A-CH",
      zh: "穿越 D-A-CH",
      de: "Quer durch D-A-CH",
    },
    note: {
      en: "Seven days from Austria through Switzerland and on to Vienna. A snapped gear cable, fixed in 15 minutes by a bike shop in Ötztal.",
      zh: "七天，从奥地利穿过瑞士，一路到维也纳。变速线断了，Ötztal 的车店 15 分钟就修好了。",
      de: "Sieben Tage von Österreich durch die Schweiz bis nach Wien. Ein gerissenes Schaltseil, in 15 Minuten von einem Radladen im Ötztal repariert.",
    },
  },
];
