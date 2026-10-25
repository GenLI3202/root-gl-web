import type { Locale } from "@/i18n";

/** Book characters shown in the Hobbies → Reading carousel; avatars follow docs/illustration-style.md */
export interface Character {
  id: string;
  name: string;
  nameEn: string;
  work: string;
  author: string;
  quote: string;
  translation: string;
  avatar: string;
  slideFrom: "left" | "right";
  /** Gen's own reading of the character, shown as a handwritten margin note */
  note?: Record<Locale, string>;
}

export const CHARACTERS: Character[] = [
  {
    id: "guo-jing",
    name: "郭靖",
    nameEn: "Guo Jing",
    work: "射雕英雄传",
    author: "金庸 Jin Yong",
    quote: "侠之大者，为国为民。",
    translation: "The greatest of knights serves his country and its people.",
    avatar: "/images/hobbies/guo-jing.svg",
    slideFrom: "left",
  },
  {
    id: "linghu-chong",
    name: "令狐冲",
    nameEn: "Linghu Chong",
    work: "笑傲江湖",
    author: "金庸 Jin Yong",
    quote: "无招胜有招，剑法不在招式，在乎一心。",
    translation: "No move surpasses all moves. The sword lives in the mind, not the form.",
    avatar: "/images/hobbies/linghu-chong.svg",
    slideFrom: "right",
  },
  {
    id: "sinclair",
    name: "Sinclair",
    nameEn: "Sinclair",
    work: "Demian",
    author: "Hermann Hesse",
    quote: "Der Vogel kämpft sich aus dem Ei. Wer geboren werden will, muss eine Welt zerstören.",
    translation: "The bird fights its way out of the egg. He who would be born must first destroy a world.",
    avatar: "/images/hobbies/sinclair.svg",
    slideFrom: "left",
  },
  {
    id: "ye-wenjie",
    name: "叶文洁",
    nameEn: "Ye Wenjie",
    work: "三体",
    author: "刘慈欣 Liu Cixin",
    quote: "到这里来吧，我将帮助你们获得这个世界。我的文明已无力解决自己的问题，需要你们的力量来介入。",
    translation:
      "Come here. I will help you gain this world. My civilization can no longer solve its own problems; it needs your strength to step in.",
    avatar: "/images/hobbies/ye-wenjie.svg",
    slideFrom: "right",
  },
  {
    id: "luo-ji",
    name: "罗辑",
    nameEn: "Luo Ji",
    work: "三体 II · 黑暗森林",
    author: "刘慈欣 Liu Cixin",
    quote: "第一，生存是文明的第一需要。第二，文明不断增长和扩张，但宇宙中的物质总量保持不变。",
    translation:
      "First, survival is the primary need of civilization. Second, civilization keeps growing and expanding, but the total matter in the universe stays constant.",
    avatar: "/images/hobbies/luo-ji.svg",
    slideFrom: "left",
    note: {
      en: "He never asked for the job. Fate picked him, and he became the Swordholder anyway: a saviour by assignment, not ambition.",
      zh: "他从没想当救世主，是命运选中了他。被推到面壁者、执剑人的位置上，他接下了这份躲不开的使命。",
      de: "Er wollte die Rolle nie. Das Schicksal hat ihn ausgewählt, und er wurde trotzdem zum Schwerthalter: ein Retter aus Auftrag, nicht aus Ehrgeiz.",
    },
  },
  {
    id: "zhang-beihai",
    name: "章北海",
    nameEn: "Zhang Beihai",
    work: "三体 II · 黑暗森林",
    author: "刘慈欣 Liu Cixin",
    quote: "没关系的，都一样。",
    translation: "It doesn't matter. It's all the same.",
    avatar: "/images/hobbies/zhang-beihai.svg",
    slideFrom: "right",
    note: {
      en: "Cold, complete rationality in service of humanity as a whole. Which ship survives doesn't matter, as long as someone does.",
      zh: "为了人类整体利益的最大化，可以理性到极致。哪艘船活下来不重要，只要人类还在。",
      de: "Kalte, vollständige Rationalität im Dienst der ganzen Menschheit. Welches Schiff überlebt, ist egal, solange überhaupt jemand überlebt.",
    },
  },
  {
    id: "cheng-xin",
    name: "程心",
    nameEn: "Cheng Xin",
    work: "三体 III · 死神永生",
    author: "刘慈欣 Liu Cixin",
    quote: "我选择人性。",
    translation: "I choose humanity.",
    avatar: "/images/hobbies/cheng-xin.svg",
    slideFrom: "left",
    note: {
      en: "Deep care for every single life. She stands for refusing to sacrifice one person for the greater total, even when the arithmetic says otherwise.",
      zh: "对每一个个体命运的极度关怀。她代表的价值观是：哪怕为了整体利益，也不愿去伤害个人。",
      de: "Tiefe Fürsorge für jedes einzelne Leben. Sie steht dafür, keinen Menschen für das große Ganze zu opfern, auch wenn die Rechnung dafür spricht.",
    },
  },
];
