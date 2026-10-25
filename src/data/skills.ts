import type { Locale } from "@/i18n";

/**
 * Agent skills shown on the Projects page. Each entry is a public repo containing one or
 * more SKILL.md workflows for Claude Code and similar agents.
 */

export type SkillStatus = "ready" | "planned";

export interface SubSkill {
  name: string;
  status: SkillStatus;
  role: Record<Locale, string>;
}

export interface AgentSkill {
  id: string;
  repo: string;
  summary: Record<Locale, string>;
  triggers: string[];
  install?: string;
  installGuide?: string;
  parts?: SubSkill[];
}

export const AGENT_SKILLS: AgentSkill[] = [
  {
    id: "html-presentation-deck",
    repo: "https://github.com/GenLI3202/html-presentation-deck",
    summary: {
      en: "Turns research material you already have into an interactive HTML talk: a 1920×1080 stage, presenter view, notes and sources panel, live embedded pages, all in one offline file. It stops at fixed gates so you decide each step.",
      zh: "把已有的研究材料做成交互式 HTML 演讲：1920×1080 舞台、演讲者视图、备注与来源面板，可直接嵌入交互页面，最后打包成一个离线文件。每到关键一步都停下来，由你决定。",
      de: "Macht aus vorhandenem Forschungsmaterial einen interaktiven HTML-Vortrag: 1920×1080-Bühne, Referentenansicht, Notizen- und Quellenleiste, live eingebettete Seiten, alles in einer Offline-Datei. An festen Punkten hält es an, damit du entscheidest.",
    },
    triggers: ["Make a 20-minute talk from the reports in ./research", "把这几份报告做成组会分享的 PPT"],
    install:
      "git clone https://github.com/GenLI3202/html-presentation-deck ~/.claude/skills/html-presentation-deck",
  },
  {
    id: "paper-study",
    repo: "https://github.com/GenLI3202/paper-study",
    summary: {
      en: "Deep-reads one to three related papers with you, section by section, while keeping a study note with exact pages, equations and figures, so you can pick it up again months later.",
      zh: "陪你精读一到三篇相关论文，一节一节地讲，同时维护一份标注页码、公式和图表出处的学习笔记，几个月后也能接着读。",
      de: "Liest ein bis drei verwandte Paper Abschnitt für Abschnitt mit dir und führt dabei eine Lernnotiz mit genauen Seiten, Gleichungen und Abbildungen, damit du Monate später weitermachen kannst.",
    },
    triggers: ["带我读这篇论文", "Help me study this paper and take notes"],
    installGuide: "https://github.com/GenLI3202/paper-study#install-with-your-ai-agent",
  },
  {
    id: "acc-content-posting-system",
    repo: "https://github.com/GenLI3202/acc-content-posting-system",
    summary: {
      en: "A small family of skills that turns Telegram requests into reviewed posts on the Across Cycling Club website: a router picks the collection, a specialised poster builds the draft and preview, and a human approves before anything is published.",
      zh: "一组小技能，把 Telegram 里的发帖请求变成 Across 骑行俱乐部网站上审核过的内容：路由技能判断类别，专门的发帖技能生成草稿和预览，人工确认后才发布。",
      de: "Eine kleine Skill-Familie, die Telegram-Anfragen in geprüfte Beiträge auf der Website des Across Cycling Club verwandelt: Ein Router wählt die Rubrik, ein spezialisierter Poster baut Entwurf und Vorschau, und ein Mensch gibt vor der Veröffentlichung frei.",
    },
    triggers: ["发周六骑行活动报名帖", "整理这次活动的回顾"],
    parts: [
      {
        name: "poster-router",
        status: "ready",
        role: { en: "routes the request", zh: "判断类别", de: "leitet weiter" },
      },
      {
        name: "events-poster",
        status: "ready",
        role: { en: "event & signup posts", zh: "活动与报名帖", de: "Events & Anmeldung" },
      },
      {
        name: "media-poster",
        status: "ready",
        role: { en: "recaps & videos", zh: "回顾与影像", de: "Rückblicke & Videos" },
      },
      {
        name: "routes-poster",
        status: "planned",
        role: { en: "route pages", zh: "路线页面", de: "Routenseiten" },
      },
      {
        name: "knowledge-poster",
        status: "planned",
        role: { en: "training articles", zh: "训练科普", de: "Trainingsartikel" },
      },
    ],
  },
];
