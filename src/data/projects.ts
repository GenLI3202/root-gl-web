import type { Locale } from "@/i18n";

/**
 * Projects page content. Research projects sit on a stage of the energy storage value
 * chain; everything else goes in the "other" group.
 */

export type StageId = "source" | "plan" | "operate" | "trade" | "hedge";
export type SketchName = "site" | "map" | "pareto" | "market" | "ride" | "browser";

export interface Stage {
  id: StageId;
  tint: string;
  name: Record<Locale, string>;
  question: Record<Locale, string>;
}

export interface Project {
  id: string;
  stage?: StageId;
  sketch: SketchName;
  tint: string;
  title: Record<Locale, string>;
  status: Record<Locale, string>;
  description: Record<Locale, string>;
  tags: string[];
  href: Record<Locale, string>;
  /** Secondary link shown inside the card, above the cover link */
  related?: { label: Record<Locale, string>; href: string };
}

export const STAGES: Stage[] = [
  {
    id: "source",
    tint: "var(--tint-sky)",
    name: { en: "Source", zh: "原料", de: "Rohstoffe" },
    question: {
      en: "How do we mine battery raw materials while weighing cost, environment and the people affected?",
      zh: "电池原材料怎样开采，才能兼顾成本、环境和受影响的人？",
      de: "Wie baut man Batterierohstoffe ab und wägt dabei Kosten, Umwelt und Betroffene ab?",
    },
  },
  {
    id: "plan",
    tint: "var(--tint-sage)",
    name: { en: "Plan", zh: "规划", de: "Planen" },
    question: {
      en: "Where should storage and chargers go, and how big?",
      zh: "储能和充电桩该建在哪、建多大？",
      de: "Wo sollen Speicher und Ladepunkte hin, und wie groß?",
    },
  },
  {
    id: "operate",
    tint: "var(--tint-amber)",
    name: { en: "Operate", zh: "运行", de: "Betreiben" },
    question: {
      en: "What should every asset on a site do in the next few minutes?",
      zh: "场站里的每台设备，接下来几分钟该做什么？",
      de: "Was soll jede Anlage am Standort in den nächsten Minuten tun?",
    },
  },
  {
    id: "trade",
    tint: "var(--tint-lilac)",
    name: { en: "Trade", zh: "交易", de: "Handeln" },
    question: {
      en: "Which markets should storage serve, and when?",
      zh: "储能该参与哪些市场、在什么时候？",
      de: "Welche Märkte soll ein Speicher bedienen, und wann?",
    },
  },
  {
    id: "hedge",
    tint: "var(--tint-rose)",
    name: { en: "Hedge", zh: "避险", de: "Absichern" },
    question: {
      en: "How do you decide well when prices, loads and weather are uncertain?",
      zh: "电价、负荷和天气都不确定时，怎样做出好决策？",
      de: "Wie entscheidet man gut, wenn Preise, Lasten und Wetter unsicher sind?",
    },
  },
];

const SAME = (url: string): Record<Locale, string> => ({ en: url, zh: url, de: url });

export const PROJECTS: Project[] = [
  {
    id: "lems",
    stage: "operate",
    sketch: "site",
    tint: "var(--tint-amber)",
    title: {
      en: "Local Energy Management System (LEMS)",
      zh: "本地能量管理系统（LEMS）",
      de: "Lokales Energiemanagementsystem (LEMS)",
    },
    status: { en: "Ongoing · Huawei", zh: "进行中 · 华为", de: "Laufend · Huawei" },
    description: {
      en: "My PhD internship project at Huawei: coordinating a site's battery storage, PV, EV charging, loads and grid connection as one system, with fast local decisions inside the site's physical limits.",
      zh: "我在华为的博士实习项目：把场站里的储能、光伏、充电桩、负荷和并网点作为一个整体协调，在场站物理约束内快速做出本地决策。",
      de: "Mein PhD-Praktikumsprojekt bei Huawei: Batteriespeicher, PV, Ladeinfrastruktur, Lasten und Netzanschluss eines Standorts als ein System koordinieren, mit schnellen lokalen Entscheidungen innerhalb seiner physikalischen Grenzen.",
    },
    tags: ["BESS", "PV", "EV Charging", "Optimisation"],
    href: {
      en: "/posts/intersolar-2026-ems-lems-insights/",
      zh: "/zh/posts/intersolar-2026-ems-lems-insights/",
      de: "/posts/intersolar-2026-ems-lems-insights/",
    },
  },
  {
    id: "ev-optimizer",
    stage: "plan",
    sketch: "map",
    tint: "var(--tint-sage)",
    title: SAME("EV Charging Optimizer"),
    status: {
      en: "Siemens · PCT WO2025026594",
      zh: "西门子 · PCT WO2025026594",
      de: "Siemens · PCT WO2025026594",
    },
    description: {
      en: "Stochastic MILP for placing EV charging stations under grid uncertainty, built at Siemens and published as a PCT patent application.",
      zh: "在西门子做的随机混合整数规划模型：在电网不确定性下为电动汽车充电站选址，已作为 PCT 专利申请公开。",
      de: "Stochastisches MILP zur Platzierung von Ladestationen unter Netzunsicherheit, entwickelt bei Siemens und als PCT-Patentanmeldung veröffentlicht.",
    },
    tags: ["Python", "Pyomo", "CPLEX"],
    href: SAME("https://patentscope.wipo.int/search/en/detail.jsf?docId=WO2025026594"),
  },
  {
    id: "gridkey",
    stage: "trade",
    sketch: "market",
    tint: "var(--tint-lilac)",
    title: SAME("GridKey"),
    status: {
      en: "Open source · Huawei TechArena 2025",
      zh: "开源 · 华为 TechArena 2025",
      de: "Open Source · Huawei TechArena 2025",
    },
    description: {
      en: "Grew out of the Huawei TechArena 2025 challenge: Pyomo models that schedule a battery across day-ahead energy, FCR and aFRR markets, with cyclic and calendar aging costs and rolling-horizon experiments. Now a public testbed for BESS market optimization.",
      zh: "源自华为 TechArena 2025 竞赛：用 Pyomo 建模，让一块电池在日前电能、FCR 和 aFRR 市场之间协同优化，计入循环与日历老化成本，并做滚动时域实验。现在是一个公开的储能市场优化试验平台。",
      de: "Entstanden aus der Huawei TechArena 2025: Pyomo-Modelle, die einen Batteriespeicher über Day-Ahead-, FCR- und aFRR-Märkte einsetzen, mit zyklischen und kalendarischen Alterungskosten und Rolling-Horizon-Experimenten. Heute eine offene Testumgebung für BESS-Marktoptimierung.",
    },
    tags: ["Python", "Pyomo", "MILP", "HiGHS"],
    href: SAME("https://github.com/GenLI3202/GridKey"),
  },
  {
    id: "mamoda",
    stage: "source",
    sketch: "pareto",
    tint: "var(--tint-sky)",
    title: SAME("MAMODA Web Dashboard"),
    status: { en: "PhD · Live", zh: "博士项目 · 已上线", de: "Promotion · Live" },
    description: {
      en: "Part of my PhD, at the upstream end of the chain: an interactive knowledge hub for sustainable mining decisions on battery raw materials, with multi-objective optimization, stakeholder-guided decision-making and live Plotly visualizations.",
      zh: "我博士项目的一部分，位于价值链最上游：面向电池原材料可持续开采决策的交互式知识平台，包含多目标优化、利益相关方引导的决策和实时 Plotly 可视化。",
      de: "Teil meiner Promotion, ganz am Anfang der Kette: eine interaktive Wissensplattform für nachhaltige Abbauentscheidungen bei Batterierohstoffen, mit Multi-Ziel-Optimierung, stakeholdergeleiteten Entscheidungen und Live-Plotly-Visualisierungen.",
    },
    tags: ["Python", "FastAPI", "Plotly", "React"],
    href: SAME("https://mamoda-web-dashboard.vercel.app/"),
  },
  {
    id: "across",
    sketch: "ride",
    tint: "var(--tint-rose)",
    title: SAME("ACC ClubHub"),
    status: { en: "Live", zh: "已上线", de: "Live" },
    description: {
      en: "Digital hub for Across Cycling Club Munich: media, events, gear guides, training science and curated routes, with a Git-based CMS for easy updates.",
      zh: "慕尼黑 Across 骑行俱乐部的线上基地：媒体、活动、装备、训练与路线，基于 Git 的 CMS，更新方便。",
      de: "Digitaler Treffpunkt des Across Cycling Club München: Medien, Events, Ausrüstung, Training und Routen, mit Git-basiertem CMS.",
    },
    tags: ["Astro", "Sveltia CMS", "TypeScript", "Python"],
    href: SAME("https://www.across-cc.de/"),
    related: {
      label: {
        en: "Content posting skills for the club ↗",
        zh: "俱乐部内部用的发帖技能 ↗",
        de: "Posting-Skills für den Club ↗",
      },
      href: "https://github.com/GenLI3202/acc-content-posting-system",
    },
  },
  {
    id: "genli-dev",
    sketch: "browser",
    tint: "var(--tint-amber)",
    title: { en: "This Website", zh: "这个网站", de: "Diese Website" },
    status: { en: "Open source", zh: "开源", de: "Open Source" },
    description: {
      en: "Astro, trilingual (EN/ZH/DE), hand-drawn details, and a clock that knows Munich's weather.",
      zh: "Astro 构建，中英德三语，手绘细节，还有一个知道慕尼黑天气的时钟。",
      de: "Astro, dreisprachig (EN/ZH/DE), handgezeichnete Details und eine Uhr, die das Münchner Wetter kennt.",
    },
    tags: ["Astro", "TypeScript", "CSS"],
    href: SAME("https://github.com/GenLI3202/root-gl-web"),
  },
];
