# Gen Li 个人网站 — 设计方案 (Final)

## Context

Gen Li（TUM PhD, OR/能源方向，ENFP）以 liruifengv.com 为参考，用 Astro v5 构建有自己特色的个人网站。身份复合：学术研究者 + 骑行社长 + 书虫 + 吉他手。

**已确认的设计方向：**
- **风格**：黑白简约，大留白，学术/杂志感
- **语言**：中英德三语，默认英文入口，commit 触发自动翻译
- **参考**：taniarascia.com（内容结构 + progressive disclosure）+ joshwcomeau.com（温馨细节）
- **原则**：Progressive Disclosure —— 降低认知负担，让浏览成为享受

---

## 一、设计系统（Design Tokens）

### 1.1 配色

**Light Mode（默认）**

| Token | 值 | 用途 |
|---|---|---|
| `--bg` | `#FAFAFA` | 页面底色 |
| `--fg` | `#1A1A1A` | 主文本 |
| `--fg-muted` | `#6B6B6B` | 次要文本（日期、描述） |
| `--accent` | `#E63946` | 强调色（骑行红）—— 链接、hover、CTA |
| `--accent-soft` | `rgba(230,57,70,0.08)` | 强调色浅底（tag 背景、hover 底色） |
| `--border` | `#E5E5E5` | 分割线、卡片边框 |
| `--surface` | `#F5F5F5` | 卡片/区块背景 |

**Dark Mode**

| Token | 值 |
|---|---|
| `--bg` | `#111111` |
| `--fg` | `#ECECEC` |
| `--fg-muted` | `#999999` |
| `--accent` | `#FF6B6B` | （红色在深色下提亮）|
| `--accent-soft` | `rgba(255,107,107,0.12)` |
| `--border` | `#2A2A2A` |
| `--surface` | `#1A1A1A` |

### 1.2 字体

```css
--font-heading: 'Playfair Display', Georgia, serif;  /* 大号衬线标题 */
--font-body: 'Inter', system-ui, -apple-system, sans-serif;  /* 正文无衬线 */
--font-cjk: 'Noto Sans SC', 'PingFang SC', sans-serif;  /* 中文 fallback */
--font-mono: 'JetBrains Mono', monospace;
```

标题用 Playfair Display（比 Fraunces 更锐利，匹配黑白简约感）。
正文用 Inter（优秀的屏幕可读性，国际化字符支持好）。

### 1.3 排版比例

```css
--text-sm: 0.875rem;    /* 14px - meta信息 */
--text-base: 1rem;      /* 16px - 正文 */
--text-lg: 1.125rem;    /* 18px - 文章正文 */
--text-xl: 1.5rem;      /* 24px - 小标题 */
--text-2xl: 2rem;       /* 32px - 页面标题 */
--text-3xl: 2.5rem;     /* 40px - Hero 名字 */
--text-hero: clamp(2.5rem, 5vw, 4rem);  /* 响应式 Hero */
```

### 1.4 间距 & 圆角

```css
/* 圆角：克制，不用超大圆角 */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-pill: 999px;   /* Tag 胶囊 */

/* 容器 */
max-width: 720px;       /* 内容区（接近 taniarascia 的窄栏） */
max-width: 960px;       /* 导航栏 */
padding-inline: 24px;   /* 移动端安全边距 */

/* Section 间距 */
gap: 4rem ~ 6rem;       /* 大板块之间 */
```

### 1.5 阴影（极简，几乎不用）

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-hover: 0 4px 12px rgba(0,0,0,0.08);
```

---

## 二、页面结构

```
/[locale]/              首页（默认 /en/）
/[locale]/posts/        文章列表
/[locale]/posts/[slug]  文章详情
/[locale]/projects/     项目
/[locale]/hobbies/      兴趣爱好
/[locale]/about/        关于我
/rss.xml                RSS
```

`[locale]` = `en` | `zh` | `de`，默认 `en`

---

## 三、全局布局

```
┌─────────────────────────────────────────┐
│  <nav> 固定顶部                         │
│  Gen Li    Posts  Projects  Hobbies  About │  [EN/中/DE] [☀/🌙]
│  ───────── 细线分割 ─────────────────── │
├─────────────────────────────────────────┤
│  <main>                                 │
│    max-width: 720px, mx-auto            │
│    <slot />                             │
├─────────────────────────────────────────┤
│  <footer> 极简                          │
│  © 2026 Gen Li · GitHub · LinkedIn      │
└─────────────────────────────────────────┘
```

**导航栏**：
- 无胶囊、无毛玻璃 —— 纯白/纯黑底 + 底部 1px border
- 左侧：名字（Playfair 衬线体，作为 logo）
- 中间：文字链接，当前页加 `--accent` 下划线
- 右侧：语言切换（EN/中/DE dropdown）+ 主题切换
- 移动端：汉堡菜单

**Footer**：
- 一行式：`© 2026 Gen Li · GitHub · LinkedIn · Email`
- 没有 ContactCTA 大块（保持极简）

---

## 四、各页面设计

### 4.1 首页 `/`

**设计理念**：像一张名片，progressive disclosure。第一屏只有名字和一句话。往下滑才看到更多。

```
┌─────────────────────────────────────────┐
│                                         │
│        Gen Li                           │  ← Playfair Display, --text-hero
│                                         │
│  PhD Researcher · TU Munich             │  ← Inter, --fg-muted, --text-lg
│  Energy systems, optimization,          │
│  and the occasional guitar riff.        │
│                                         │
│  [⚡ Energy]  [🚴 Cycling]  [📖 Books] │  ← 小胶囊 tags, --accent-soft 底色
│                                         │
└─────────────────────────────────────────┘

     ↓ 滚动后

┌─────────────────────────────────────────┐
│  Recent Writing                [All →]  │
│  ─────────────────────────────────────  │
│  Article title here              Mar 21 │
│  Another article                 Mar 15 │
│  Yet another one                 Mar 02 │
│  ─────────────────────────────────────  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Selected Projects             [All →]  │
│  ─────────────────────────────────────  │
│  ┌──────────────┐ ┌──────────────────┐  │
│  │ MAMODA       │ │ ACC Club Website │  │
│  │ Web Dashboard│ │                  │  │
│  └──────────────┘ └──────────────────┘  │
└─────────────────────────────────────────┘
```

**要点**：
- 无头像（或可选：小圆形头像在名字旁，32px，不占视觉重心）
- tagline 用英文，轻松幽默（"the occasional guitar riff" 体现个性）
- 文章列表是简单的标题 + 日期行，hover 整行变 `--accent-soft` 底色
- 项目卡片：2 列网格，简洁白底 + border + hover 微微上移

### 4.2 文章列表 `/posts/`

参考 taniarascia.com 的极简列表：

```
Writing
────────────────────────────────────────

Title of the post                 Mar 2026
Another post title                Feb 2026
Yet another post                  Jan 2026

────────────────────────────────────────
[← Prev]         1 / 6          [Next →]
```

- 无卡片、无缩略图 —— 纯文字行
- hover 时文字变 `--accent` 红
- 分页用 outline 胶囊按钮

### 4.3 文章详情 `/posts/[slug]`

```
────────────────────────────────────────

Title of the Article
March 21, 2026 · 5 min read
[tag1] [tag2]

────────────────────────────────────────

正文 markdown 渲染
max-width: 720px
font-size: 18px (--text-lg)
line-height: 1.8

链接用 --accent 红色 + underline
代码块深色背景
图片全宽（突破 720px 到 ~900px）

────────────────────────────────────────
```

### 4.4 项目页 `/projects/`

```
Projects
────────────────────────────────────────

┌──────────────────────────────────────┐
│ MAMODA Web Dashboard           [→]   │
│ Interactive knowledge hub for        │
│ sustainable mining decisions         │
│ Python · FastAPI · Plotly            │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Accross Cycling Club Website   [→]   │
│ Event registration and results       │
│ platform for Munich cycling club     │
│ Astro                                │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ EV Charging Station Optimizer  [→]   │
│ Stochastic MILP for optimal          │
│ placement under grid uncertainty     │
│ Python · Pyomo · CPLEX              │
└──────────────────────────────────────┘
```

- 单列列表式（不是网格），每个项目一张卡片
- 卡片底部有技术标签
- hover 时左边出现 `--accent` 色竖线

### 4.5 ★ 兴趣爱好页 `/hobbies/`

**最大差异化页面**。布局轻松，三个板块垂直排列：

```
Life Beyond Research
────────────────────────────────────────

🚴 Cycling
───────────
Munich is best explored on two wheels.
I manage the Accross Cycling Club and
lead weekly group rides year-round.

[Photo 1]  [Photo 2]  [Photo 3]
（3张骑行照片横向排列）

Annual Stats: 3,200 km · 120 rides
（MVP 阶段手动填写，后期 Strava API 自动拉取）

[→ Strava Profile]  [→ Accross Club]


📖 Reading
───────────
I grew up devouring Cixin Liu's cosmic
visions and Jin Yong's martial arts epics.
Now I'm equally drawn to Hermann Hesse's
inner journeys.

Currently Reading: [书名]
[→ WeRead Profile (微信读书)]


🎸 Guitar
───────────
No concerts, no compositions —
just the quiet joy of fingers on strings.
```

**MVP 策略**：
- 骑行：Strava 链接 + 2-3 张照片 + 手动填写的年度数据
- 阅读：微信读书链接 + 喜欢的作者/书 + "在读"
- 吉他：一段文字即可，可选配图

**后续迭代**：
- Strava API 自动拉取骑行数据（年度里程/次数/最近骑行）
- 微信读书 API 拉取书架（如有可用 API）

### 4.6 关于页 `/about/`

```
About
────────────────────────────────────────

A PhD researcher at TU Munich who builds
optimization models for the energy transition
— and rides bikes through Bavaria on weekends.

## Research
Center for Energy Markets, TUM.
Multi-objective optimization, EV charging
infrastructure, interactive decision tools.

## Toolbox
Python · Pyomo · CPLEX · Gurobi · FastAPI
Plotly · JavaScript · R · MATLAB · SQL

## Beyond Work
→ Cycling club manager (Accross CC Munich)
→ Reads sci-fi, wuxia, and Hesse
→ Plays acoustic guitar

## Find Me
GitHub · LinkedIn · Email
```

---

## 五、三语系统设计

### 路由结构

```
/en/          ← 默认（域名根 "/" redirect 到 /en/）
/zh/
/de/
/en/posts/
/zh/posts/    ← 同一篇文章的中文翻译
/de/posts/    ← 同一篇文章的德文翻译
```

### 内容结构

```
src/content/posts/
  my-article/
    en.md        ← 原文（手写）
    zh.md        ← 自动翻译生成
    de.md        ← 自动翻译生成
```

### 自动翻译 Workflow

**方案**：GitHub Action，在 commit 推送时触发：
1. 检测 `src/content/posts/*/en.md` 中新增或修改的文件
2. 调用翻译 API（Claude API / DeepL）将 en → zh, en → de
3. 生成对应的 `zh.md` 和 `de.md`
4. 自动 commit 翻译结果
5. UI 静态部分（导航、按钮文案）用 i18n JSON 文件管理

### UI i18n

```
src/i18n/
  en.json    { "nav.posts": "Posts", "nav.projects": "Projects", ... }
  zh.json    { "nav.posts": "文章", "nav.projects": "项目", ... }
  de.json    { "nav.posts": "Beiträge", "nav.projects": "Projekte", ... }
```

---

## 六、技术栈

| 层 | 选择 |
|---|---|
| 框架 | Astro v5（SSG） |
| 样式 | Scoped `<style>` + CSS Custom Properties（主）+ Tailwind（工具类辅助） |
| 内容 | Astro Content Collections |
| Markdown | remark-reading-time, @tailwindcss/typography |
| RSS | @astrojs/rss |
| Sitemap | @astrojs/sitemap |
| 部署 | Vercel |
| 字体 | Google Fonts（Playfair Display, Inter）+ Noto Sans SC 自托管 |
| 翻译 | GitHub Action + Claude API / DeepL |
| View Transitions | Astro 内置 ViewTransitions |

---

## 七、目录结构

```
gen-web/
├── public/
│   ├── fonts/              # Noto Sans SC 自托管
│   ├── images/hobbies/     # 骑行照片等
│   └── favicon.svg
├── src/
│   ├── content/
│   │   ├── config.ts
│   │   └── posts/
│   │       └── my-article/
│   │           ├── en.md
│   │           ├── zh.md
│   │           └── de.md
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── ThemeToggle.astro
│   │   ├── LanguageSwitcher.astro
│   │   ├── PostList.astro
│   │   ├── ProjectCard.astro
│   │   ├── HobbySection.astro
│   │   └── Tag.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/
│   │   ├── index.astro         # redirect → /en/
│   │   └── [locale]/
│   │       ├── index.astro
│   │       ├── posts/
│   │       │   ├── index.astro
│   │       │   └── [...slug].astro
│   │       ├── projects.astro
│   │       ├── hobbies.astro
│   │       └── about.astro
│   ├── i18n/
│   │   ├── en.json
│   │   ├── zh.json
│   │   └── de.json
│   ├── styles/
│   │   └── global.css
│   └── utils/
│       ├── i18n.ts
│       └── date.ts
├── .github/
│   └── workflows/
│       └── translate.yml       # 自动翻译 Action
├── astro.config.mjs
└── package.json
```

---

## 八、实现优先级（MVP → 迭代）

### Phase 1: MVP（先可用）
1. 搭建 Astro 项目 + 全局布局（Nav, Footer, BaseLayout）
2. 首页（Hero + 文章列表 + 项目卡片）
3. 文章系统（列表 + 详情 + markdown 渲染）
4. About 页
5. Hobbies 页（Strava 链接 + 照片 + 文字）
6. 深色模式
7. 部署到 Vercel

### Phase 2: 国际化
8. i18n 路由结构
9. 语言切换器
10. GitHub Action 自动翻译

### Phase 3: 增强
11. Projects 页面完善
12. RSS Feed
13. SEO（OG images, sitemap）
14. View Transitions 页面切换动画
15. Strava API 自动拉取骑行数据

---

## 九、验证方式

- `npm run dev` 本地预览所有页面
- 响应式测试：移动端 / 平板 / 桌面
- Lighthouse 审计（Performance, Accessibility, SEO）
- 深色/浅色模式切换无闪烁
- 三语路由正确跳转

---

## 十、Backlog / 未来迭代

### 已确认待实现（非紧急）

| 功能 | 说明 | 所在页面 |
|---|---|---|
| Posts 标签过滤 | 点击 tag 过滤文章列表，客户端 JS，无需路由变化 | `/posts/` |
| Posts 排序 | 按发布日期（默认）或按标题字母序切换排序 | `/posts/` |
| Projects 图片 | 有项目截图后替换 `public/images/projects/` 中占位渐变色 | `/projects/` |
| Strava API | 自动拉取骑行年度数据（里程、次数）替换手动填写 | `/hobbies/` |
| View Transitions | 页面切换动画（Astro 内置 `<ViewTransitions />`） | 全局 |
| OG Images | 动态生成 Open Graph 图片（Satori / @vercel/og） | SEO |

### 实现备注

**Posts 过滤/排序（客户端实现）**
```
src/pages/posts/index.astro 中：
- 渲染所有文章到 DOM，用 data-tags / data-date / data-title 属性标记
- 添加 <FilterBar> 组件（tag 胶囊 + sort toggle）
- 客户端 JS 监听点击事件，show/hide 对应 <li>，无需 Astro SSR
- Tag 列表从所有文章的 tags 字段动态收集、去重
```
