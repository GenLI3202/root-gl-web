/**
 * Strength session themes for the training room. Mirrors the nine templates in the
 * scientific-training planner (strength/strength.toml); minutes and exercise lists come from there,
 * the English names follow the follow-along app's dictionary (docs/app/follow/src/en.json), a little
 * shorter on the cards. `href` points at the session's follow-along page (src/pages/training/[session].astro).
 */
export type TrainingLang = "zh" | "en";

/** One piece of text in both languages of the training room */
export interface Bilingual {
  zh: string;
  en: string;
}

export interface TrainingSession {
  id: string;
  /** Theme name shown on the card */
  name: Bilingual;
  /** Planner label: phase and day type */
  plan: Bilingual;
  minutes: number;
  /** 1 easy … 4 hard */
  level: 1 | 2 | 3 | 4;
  focus: Bilingual[];
  gear: Bilingual;
  exercises: Bilingual[];
  href?: string;
}

export const TODAY_SESSION = "AA_light";

const BODYWEIGHT: Bilingual = { zh: "徒手", en: "Bodyweight" };
const DUMBBELL: Bilingual = { zh: "哑铃", en: "Dumbbells" };

/** Exercise names, shared by the sessions below */
const EX = {
  birdDog: { zh: "鸟狗式", en: "Bird dog" },
  plank: { zh: "平板支撑", en: "Plank" },
  sidePlank: { zh: "侧平板", en: "Side plank" },
  bridge: { zh: "臀桥", en: "Glute bridge" },
  pushup: { zh: "俯卧撑", en: "Push-up" },
  touchdown: { zh: "单腿蹲触地", en: "Single-leg touchdown" },
  bicycle: { zh: "单车卷腹", en: "Bicycle crunch" },
  reverseCrunch: { zh: "反向卷腹", en: "Reverse crunch" },
  hop: { zh: "多方向跳", en: "Multiplanar hop" },
  chop: { zh: "斜向劈砍", en: "Wood chop" },
  row: { zh: "单臂划船", en: "One-arm row" },
  extRot: { zh: "肩外旋", en: "External rotation" },
  hamCurl: { zh: "腘绳肌屈腿", en: "Hamstring curl" },
  floorPress: { zh: "地板卧推", en: "Floor press" },
  stepUp: { zh: "登阶", en: "Step-up" },
  goblet: { zh: "高脚杯深蹲", en: "Goblet squat" },
  calfRaise: { zh: "提踵", en: "Calf raise" },
  rdl: { zh: "罗马尼亚硬拉", en: "Romanian deadlift" },
  squatJump: { zh: "深蹲跳", en: "Squat jump" },
  splitJump: { zh: "分腿跳", en: "Split jump" },
  splitSquat: { zh: "后脚抬高分腿蹲", en: "Rear-foot-elevated split squat" },
  climber: { zh: "登山者", en: "Mountain climber" },
  plankRow: { zh: "平板哑铃划船", en: "Plank row" },
} satisfies Record<string, Bilingual>;

export const TRAINING_SESSIONS: TrainingSession[] = [
  {
    id: "AA_light",
    name: { zh: "地板唤醒", en: "Floor wake-up" },
    plan: { zh: "解剖适应 · 轻量", en: "Anatomical adaptation · light" },
    minutes: 20,
    level: 1,
    focus: [
      { zh: "核心稳定", en: "Core stability" },
      { zh: "臀腿激活", en: "Glute activation" },
    ],
    gear: BODYWEIGHT,
    exercises: [EX.birdDog, EX.plank, EX.sidePlank, EX.bridge, EX.pushup, EX.touchdown],
    href: "/training/aa-light/",
  },
  {
    id: "CORE",
    name: { zh: "核心快闪", en: "Core flash" },
    plan: { zh: "核心循环", en: "Core circuit" },
    minutes: 12,
    level: 1,
    focus: [{ zh: "核心耐力", en: "Core endurance" }],
    gear: BODYWEIGHT,
    exercises: [EX.bridge, EX.sidePlank, EX.plank, EX.bicycle, EX.reverseCrunch, EX.birdDog],
    href: "/training/core/",
  },
  {
    id: "AA_heavy",
    name: { zh: "全身打地基", en: "Full-body foundation" },
    plan: { zh: "解剖适应 · 全身", en: "Anatomical adaptation · full body" },
    minutes: 28,
    level: 2,
    focus: [
      { zh: "全身", en: "Full body" },
      { zh: "肩袖", en: "Rotator cuff" },
      { zh: "单腿平衡", en: "Single-leg balance" },
    ],
    gear: DUMBBELL,
    exercises: [EX.hop, EX.chop, EX.pushup, EX.row, EX.extRot, EX.touchdown, EX.hamCurl],
    href: "/training/aa-heavy/",
  },
  {
    id: "MT_light",
    name: { zh: "单边过渡", en: "One-side bridge" },
    plan: { zh: "过渡 · 轻量", en: "Transition · light" },
    minutes: 22,
    level: 2,
    focus: [
      { zh: "核心", en: "Core" },
      { zh: "推拉平衡", en: "Push-pull balance" },
      { zh: "单腿", en: "Single leg" },
    ],
    gear: DUMBBELL,
    exercises: [EX.birdDog, EX.sidePlank, EX.bridge, EX.floorPress, EX.row, EX.stepUp],
    href: "/training/mt-light/",
  },
  {
    id: "MS_light",
    name: { zh: "质量课前夜", en: "Night before intervals" },
    plan: { zh: "力量 · 轻量", en: "Strength · light" },
    minutes: 22,
    level: 2,
    focus: [
      { zh: "保持状态", en: "Stay sharp" },
      { zh: "不累腿", en: "Fresh legs" },
    ],
    gear: DUMBBELL,
    exercises: [EX.sidePlank, EX.bridge, EX.floorPress, EX.row, EX.stepUp],
    href: "/training/ms-light/",
  },
  {
    id: "SM_heavy",
    name: { zh: "赛季保养", en: "In-season tune-up" },
    plan: { zh: "维持 · 全身", en: "Maintenance · full body" },
    minutes: 22,
    level: 2,
    focus: [
      { zh: "维持力量", en: "Keep strength" },
      { zh: "全身", en: "Full body" },
    ],
    gear: DUMBBELL,
    exercises: [EX.goblet, EX.pushup, EX.stepUp, EX.row, EX.calfRaise, EX.plank],
    href: "/training/sm-heavy/",
  },
  {
    id: "MT_heavy",
    name: { zh: "腿部加载", en: "Leg loading" },
    plan: { zh: "过渡 · 腿部", en: "Transition · legs" },
    minutes: 30,
    level: 3,
    focus: [
      { zh: "股四头肌", en: "Quads" },
      { zh: "臀腿后链", en: "Posterior chain" },
    ],
    gear: DUMBBELL,
    exercises: [EX.goblet, EX.rdl, EX.stepUp, EX.row, EX.hamCurl, EX.plank],
    href: "/training/mt-heavy/",
  },
  {
    id: "PW_heavy",
    name: { zh: "弹簧腿", en: "Spring legs" },
    plan: { zh: "爆发力 · 跳跃 + 力量", en: "Power · jumps + strength" },
    minutes: 30,
    level: 4,
    focus: [
      { zh: "爆发力", en: "Power" },
      { zh: "冲刺", en: "Sprint" },
    ],
    gear: DUMBBELL,
    exercises: [EX.squatJump, EX.splitJump, EX.splitSquat, EX.rdl, EX.row, EX.climber],
    href: "/training/pw-heavy/",
  },
  {
    id: "MS_heavy",
    name: { zh: "重腿日", en: "Heavy leg day" },
    plan: { zh: "力量 · 重腿日", en: "Strength · heavy leg day" },
    minutes: 35,
    level: 4,
    focus: [
      { zh: "最大力量", en: "Max strength" },
      { zh: "单腿", en: "Single leg" },
      { zh: "后链", en: "Posterior chain" },
    ],
    gear: DUMBBELL,
    exercises: [EX.splitSquat, EX.rdl, EX.stepUp, EX.touchdown, EX.row, EX.plankRow],
    href: "/training/ms-heavy/",
  },
];
