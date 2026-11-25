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
  cobra: { zh: "俯卧眼镜蛇", en: "Prone cobra" },
  tRaise: { zh: "俯卧 T 字举", en: "Prone T raise" },
  scaption: { zh: "肩胛面上举", en: "Scaption" },
  pushupPlus: { zh: "俯卧撑加强", en: "Push-up plus" },
  curlUp: { zh: "改良卷腹", en: "Curl-up" },
  clamshell: { zh: "蚌式开合", en: "Clamshell" },
  sideRaise: { zh: "侧卧抬腿", en: "Side-lying leg raise" },
  oneLegBridge: { zh: "单腿臀桥", en: "Single-leg bridge" },
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

/**
 * Focused sessions: four hand-picked sessions outside the weekly plan, for one body area each. They mirror the FOCUS_*
 * templates in the scientific-training planner (strength/strength.toml), whose exercise choice and doses come from Doyle
 * ch. 7–11 and the EMG notes in its knowledge/app/ folder.
 */
export const FOCUS_SESSIONS: TrainingSession[] = [
  {
    id: "FOCUS_SHOULDER",
    name: { zh: "肩袖护航", en: "Cuff guard" },
    plan: { zh: "专项 · 肩部", en: "Focus · shoulders" },
    minutes: 20,
    level: 1,
    focus: [
      { zh: "肩袖", en: "Rotator cuff" },
      { zh: "肩胛稳定", en: "Shoulder blades" },
    ],
    gear: DUMBBELL,
    exercises: [EX.tRaise, EX.extRot, EX.scaption, EX.pushupPlus, EX.row, EX.cobra],
    href: "/training/focus-shoulder/",
  },
  {
    id: "FOCUS_CORE",
    name: { zh: "三面核心", en: "Three-plane core" },
    plan: { zh: "专项 · 核心", en: "Focus · core" },
    minutes: 20,
    level: 2,
    focus: [
      { zh: "前后 · 左右 · 旋转", en: "All three planes" },
      { zh: "核心耐力", en: "Core endurance" },
    ],
    gear: DUMBBELL,
    exercises: [EX.curlUp, EX.sidePlank, EX.birdDog, EX.plankRow, EX.chop, EX.reverseCrunch, EX.cobra],
    href: "/training/focus-core/",
  },
  {
    id: "FOCUS_BACK",
    name: { zh: "挺背回正", en: "Back to upright" },
    plan: { zh: "专项 · 背部", en: "Focus · back" },
    minutes: 18,
    level: 2,
    focus: [
      { zh: "对冲骑姿", en: "Counter the riding hunch" },
      { zh: "后链", en: "Posterior chain" },
    ],
    gear: DUMBBELL,
    exercises: [EX.rdl, EX.row, EX.cobra, EX.tRaise, EX.bridge, EX.birdDog],
    href: "/training/focus-back/",
  },
  {
    id: "FOCUS_HIPS",
    name: { zh: "稳髋护膝", en: "Steady hips" },
    plan: { zh: "专项 · 髋臀", en: "Focus · hips" },
    minutes: 21,
    level: 2,
    focus: [
      { zh: "臀中肌", en: "Glute med" },
      { zh: "膝盖走直线", en: "Knee tracking" },
    ],
    gear: BODYWEIGHT,
    exercises: [EX.clamshell, EX.oneLegBridge, EX.sideRaise, EX.touchdown, EX.sidePlank],
    href: "/training/focus-hips/",
  },
];
