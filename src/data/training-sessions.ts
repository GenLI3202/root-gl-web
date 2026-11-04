/**
 * Strength session themes for the training room. Mirrors the nine templates in the
 * scientific-training planner (strength/strength.toml); minutes and exercise lists come from there.
 * `href` points at the session's follow-along page (src/pages/training/[session].astro).
 */
export interface TrainingSession {
  id: string;
  /** Theme name shown on the card */
  name: string;
  /** Planner label: phase and day type */
  plan: string;
  minutes: number;
  /** 1 easy … 4 hard */
  level: 1 | 2 | 3 | 4;
  focus: string[];
  gear: string;
  exercises: string[];
  href?: string;
}

export const TODAY_SESSION = "AA_light";

export const TRAINING_SESSIONS: TrainingSession[] = [
  {
    id: "AA_light",
    name: "地板唤醒",
    plan: "解剖适应 · 轻量",
    minutes: 20,
    level: 1,
    focus: ["核心稳定", "臀腿激活"],
    gear: "徒手",
    exercises: ["鸟狗式", "平板支撑", "侧平板", "臀桥", "俯卧撑", "单腿蹲触地"],
    href: "/training/aa-light/",
  },
  {
    id: "CORE",
    name: "核心快闪",
    plan: "核心循环",
    minutes: 12,
    level: 1,
    focus: ["核心耐力"],
    gear: "徒手",
    exercises: ["臀桥", "侧平板", "平板支撑", "单车卷腹", "反向卷腹", "鸟狗式"],
    href: "/training/core/",
  },
  {
    id: "AA_heavy",
    name: "全身打地基",
    plan: "解剖适应 · 全身",
    minutes: 28,
    level: 2,
    focus: ["全身", "肩袖", "单腿平衡"],
    gear: "哑铃",
    exercises: ["多方向跳", "斜向劈砍", "俯卧撑", "单臂划船", "肩外旋", "单腿蹲触地", "腘绳肌屈腿"],
    href: "/training/aa-heavy/",
  },
  {
    id: "MT_light",
    name: "单边过渡",
    plan: "过渡 · 轻量",
    minutes: 22,
    level: 2,
    focus: ["核心", "推拉平衡", "单腿"],
    gear: "哑铃",
    exercises: ["鸟狗式", "侧平板", "臀桥", "地板卧推", "单臂划船", "登阶"],
    href: "/training/mt-light/",
  },
  {
    id: "MS_light",
    name: "质量课前夜",
    plan: "力量 · 轻量",
    minutes: 22,
    level: 2,
    focus: ["保持状态", "不累腿"],
    gear: "哑铃",
    exercises: ["侧平板", "臀桥", "地板卧推", "单臂划船", "登阶"],
    href: "/training/ms-light/",
  },
  {
    id: "SM_heavy",
    name: "赛季保养",
    plan: "维持 · 全身",
    minutes: 22,
    level: 2,
    focus: ["维持力量", "全身"],
    gear: "哑铃",
    exercises: ["高脚杯深蹲", "俯卧撑", "登阶", "单臂划船", "提踵", "平板支撑"],
    href: "/training/sm-heavy/",
  },
  {
    id: "MT_heavy",
    name: "腿部加载",
    plan: "过渡 · 腿部",
    minutes: 30,
    level: 3,
    focus: ["股四头肌", "臀腿后链"],
    gear: "哑铃",
    exercises: ["高脚杯深蹲", "罗马尼亚硬拉", "登阶", "单臂划船", "腘绳肌屈腿", "平板支撑"],
    href: "/training/mt-heavy/",
  },
  {
    id: "PW_heavy",
    name: "弹簧腿",
    plan: "爆发力 · 跳跃 + 力量",
    minutes: 30,
    level: 4,
    focus: ["爆发力", "冲刺"],
    gear: "哑铃",
    exercises: ["深蹲跳", "分腿跳", "后脚抬高分腿蹲", "罗马尼亚硬拉", "单臂划船", "登山者"],
    href: "/training/pw-heavy/",
  },
  {
    id: "MS_heavy",
    name: "重腿日",
    plan: "力量 · 重腿日",
    minutes: 35,
    level: 4,
    focus: ["最大力量", "单腿", "后链"],
    gear: "哑铃",
    exercises: ["后脚抬高分腿蹲", "罗马尼亚硬拉", "登阶", "单腿蹲触地", "单臂划船", "平板哑铃划船"],
    href: "/training/ms-heavy/",
  },
];
