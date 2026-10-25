import type { Locale } from "@/i18n";

/**
 * Agent skills shown on the Projects page. Each entry is a public repo with a SKILL.md
 * workflow for Claude Code and similar agents.
 */

export interface AgentSkill {
  id: string;
  repo: string;
  /** One line shown while the card is folded */
  tagline: Record<Locale, string>;
  summary: Record<Locale, string>;
  triggers: string[];
  install?: string;
  installGuide?: string;
}

export const AGENT_SKILLS: AgentSkill[] = [
  {
    id: "html-presentation-deck",
    repo: "https://github.com/GenLI3202/html-presentation-deck",
    tagline: {
      en: "Research material in, interactive HTML talk out",
      zh: "研究材料进去，交互式 HTML 演讲出来",
      de: "Forschungsmaterial rein, interaktiver HTML-Vortrag raus",
    },
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
    tagline: {
      en: "Read a paper section by section, with notes you can trust later",
      zh: "一节一节精读论文，留下日后可信的笔记",
      de: "Paper Abschnitt für Abschnitt lesen, mit verlässlichen Notizen",
    },
    summary: {
      en: "Deep-reads one to three related papers with you, section by section, while keeping a study note with exact pages, equations and figures, so you can pick it up again months later.",
      zh: "陪你精读一到三篇相关论文，一节一节地讲，同时维护一份标注页码、公式和图表出处的学习笔记，几个月后也能接着读。",
      de: "Liest ein bis drei verwandte Paper Abschnitt für Abschnitt mit dir und führt dabei eine Lernnotiz mit genauen Seiten, Gleichungen und Abbildungen, damit du Monate später weitermachen kannst.",
    },
    triggers: ["带我读这篇论文", "Help me study this paper and take notes"],
    installGuide: "https://github.com/GenLI3202/paper-study#install-with-your-ai-agent",
  },
];
