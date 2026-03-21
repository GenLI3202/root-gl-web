# 个人主页 Blueprint Design Document

> 参考来源：liruifengv.com （https://github.com/liruifengv/liruifengv.com?tab=readme-ov-file）(cloned repo in local dir: /private/tmp/liruifengv.com/src) | 技术栈：Astro v5

---

## 一、技术栈总览

 **核心框架：Astro v5** （`"astro": "^5.0.0"`）

* 使用 Astro  **Content Collections** （`src/content/`）管理博客文章
* 路由基于文件系统：`src/pages/` 下每个 `.astro` 文件或目录对应一个路由
* **静态生成（SSG）**为主，无需服务端渲染
* 使用 `@astrojs/rss` 提供 RSS Feed（路由：`/rss.xml`）
* 使用 Astro 内置的 **View Transitions** API 实现页面切换动画（`<ViewTransitions />`）
* 使用 Tailwind CSS（`@astrojs/tailwind`）——但仅用作少量工具类（如 `prose`, `max-w-3xl`, `mx-auto`），**主样式以 Astro 组件作用域 `<style>` + CSS Custom Properties 为主**
* **不使用** React/Vue 等前端框架岛屿组件（页面为纯静态 HTML），唯一的交互（主题切换、移动端菜单）用原生 JS `<script>` 实现

**字体方案：**

* **正文 / UI：** `OPPO Sans 4.0`（自托管，放在 `public/fonts/`），fallback：`system-ui, -apple-system, Segoe UI, Roboto`
* **标题（h1/h2/h3）：** `Fraunces`（Google Fonts，衬线体），fallback：`Georgia, serif`

---

## 二、目录结构建议

```
my-portfolio/
├── public/
│   ├── fonts/
│   │   └── OPPO_Sans/          # 自托管字体文件 + result.css
│   ├── favicon.svg
│   └── avatar.png              # 头像图片
├── src/
│   ├── content/
│   │   ├── config.ts           # Content Collections schema 定义
│   │   ├── posts/              # 博客文章 .md/.mdx 文件
│   │   └── projects.json       # 项目数据（或 projects/ 目录）
│   ├── components/
│   │   ├── Nav.astro           # 浮动导航栏
│   │   ├── Footer.astro        # 页脚
│   │   ├── ThemeToggle.astro   # 明/暗主题切换按钮
│   │   ├── PostCard.astro      # 文章列表行（标题 + 日期）
│   │   ├── ProjectCard.astro   # 项目卡片
│   │   ├── FriendCard.astro    # 友链卡片
│   │   ├── SkillCard.astro     # 首页技能卡片
│   │   ├── Pill.astro          # 标签胶囊（hero 区身份标签）
│   │   ├── Tag.astro           # 文章 tag 小标签
│   │   ├── ContactCTA.astro    # 页面底部 CTA 区块
│   │   └── Pagination.astro    # 分页组件
│   ├── layouts/
│   │   ├── BaseLayout.astro    # 全局 HTML 骨架（<head> + Nav + Footer）
│   │   └── PostLayout.astro    # 文章详情布局（继承 BaseLayout）
│   ├── pages/
│   │   ├── index.astro         # 首页
│   │   ├── posts/
│   │   │   ├── index.astro     # 文章列表（含分页）
│   │   │   └── [...slug].astro # 文章详情（动态路由）
│   │   ├── projects/
│   │   │   └── index.astro     # 项目页
│   │   ├── links/
│   │   │   └── index.astro     # 友链页
│   │   ├── about/
│   │   │   └── index.astro     # 关于页（MDX 内容）
│   │   └── rss.xml.ts          # RSS Feed
│   └── styles/
│       └── global.css          # CSS Reset + CSS Custom Properties 主题变量
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

---

## 三、设计系统（Design Tokens）

### 3.1 颜色体系（Light / Dark 双主题）

通过 CSS Custom Properties 实现，切换方式为在 `<html>` 上挂 `class="theme-dark"`。

**Light Mode（`:root`）**

| Token                    | 值                                                                                                                                       | 用途                                          |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `--background`         | `<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#FDFCF8` | 页面底色（暖白，微微奶油色）                  |
| `--foreground`         | `<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#2C2C24` | 主文本色（深墨绿灰）                          |
| `--primary`            | `<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#5D7052` | 主品牌色（橄榄绿），用于 CTA 按钮、链接、强调 |
| `--primary-foreground` | `<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#F3F4F1` | 主色按钮上的文字色                            |
| `--secondary`          | `<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#C18C5D` | 次品牌色（暖棕），用于 Writer 标签等          |
| `--accent`             | `<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#E6DCCD` | 轻柔米色，hover 背景、卡片底色                |
| `--muted`              | `<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#F0EBE5` | 更浅的背景区块（section 背景）                |
| `--muted-foreground`   | `<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#78786C` | 次级文字（日期、描述文字）                    |
| `--border`             | `<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#DED8CF` | 分割线、卡片边框                              |
| `--accent-overlay`     | `rgba(93,112,82,.15)`                                                                                                                  | 主色透明叠加层                                |

**Dark Mode（`:root.theme-dark`）**

| Token                  | 值                                                                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `--background`       | `<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#2A2620` |
| `--foreground`       | `<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#FDFCF8` |
| `--primary`          | `<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#9BB58B` |
| `--secondary`        | `<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#E0B484` |
| `--accent`           | `<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#4A443A` |
| `--muted`            | `<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#3D3830` |
| `--muted-foreground` | `<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#D8D4CC` |
| `--border`           | `<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#5C5850` |

 **灰阶系统（从深到浅，light mode）** ：`--gray-0`(`<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#2C2C24`) → `--gray-50` → `--gray-100` → ... → `--gray-900`(`<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#F8F6F2`) → `--gray-999`(背景色)

### 3.2 圆角体系

* 大型卡片（Skills/Section）：`border-radius: 40px`（超大圆角，柔和感强）
* 导航栏胶囊形：`border-radius: 40px`
* 小卡片（项目/友链）：`border-radius: 20px ~ 24px`
* 小标签（Tag/Pill）：`border-radius: 999px`（全圆）
* CTA 按钮（outline style）：`border-radius: 999px`

### 3.3 阴影

* 卡片阴影：`0 2px 8px -2px rgba(93,112,82,.08), 0 1px 3px -1px rgba(93,112,82,.06)`
* 使用主品牌色（橄榄绿）作为阴影颜色，保持整体色调统一

### 3.4 字体排版

css

```css
/* 全局正文 */
font-family:"OPPO Sans 4.0", system-ui, -apple-system,"Segoe UI", Roboto, sans-serif;
font-size:16px;
line-height:1.6;

/* 标题（h1/h2/h3）*/
font-family: Fraunces, Georgia, serif;
font-weight:700;

/* h1 首屏大标题 */
font-size:clamp(1.875rem,4vw,2.5rem);

/* 文章 prose 内容 */
font-size:18px;
line-height:1.8;
max-width:768px;
```

### 3.5 间距体系

- 容器最大宽度：`max-width: ~960px`（导航），内容区约 `1100px`
- 容器内边距：`padding:024px`（移动端适配）
- 大 Section 间距：`margin-bottom:80px ~ 120px`
- 卡片内边距：`padding:48px`（大卡片），`padding:24px`（小卡片）

---

## 四、全局布局（BaseLayout.astro）

```
┌─────────────────────────────────────────┐
│  <header>                               │
│    ┌──────────────────────────────────┐ │
│    │  🖼️ logo  首页 文章 项目 友链 关于│ ⚙️ 🌙│ │
│    └──────────────────────────────────┘ │
│    （浮动胶囊形导航，backdrop-blur 毛玻璃效果）│
├─────────────────────────────────────────┤
│  <main>                                 │
│    <slot />                             │
├─────────────────────────────────────────┤
│  <ContactCTA />                         │
│  （"很高兴见到你！"+ 联系我按钮，全宽背景块）│
├─────────────────────────────────────────┤
│  <Footer>                               │
│   logo + tagline | 文章 项目 关于 RSS   │
│   GitHub Twitter Email                  │
│   © 年份 | Built with ♂ Astro          │
└─────────────────────────────────────────┘
```

**导航栏实现要点：**

- 外层 `<header>` 固定在顶部（sticky）
- 内层 `<div class="nav-inner">` 为胶囊形，`background:rgba(--background,0.8)`, `backdrop-filter:blur(12px)`, `border-radius:40px`
- 导航链接当前激活项加 `class="active"`，通过 `Astro.url.pathname` 判断
- 右侧有 GitHub 链接图标 + 主题切换按钮（太阳/月亮图标）
- 移动端：展示汉堡菜单按钮，点击展开全屏菜单

**Head 内容：**

- `<meta name="generator" content="Astro v5" />`
- Open Graph / Twitter Card 社交预览元标签
- 自引用字体 CSS
- `<ViewTransitions />` 组件（Astro 内置，放在 `<head>` 中）

---

## 五、各页面详细规格

### 5.1 首页（`/`）

**页面结构（从上到下）：**

```
Hero Section
├── 左侧：大名（h1，衬线体） + 一句话介绍（tagline）
│   ├── 身份胶囊标签：[</> Developer] [✏ Writer]
│   │   （Developer 用 --primary 绿色，Writer 用 --secondary 棕色）
└── 右侧：头像图片（圆角裁剪，blob 形状或大圆角方形）

技能/方向区块（3列网格）
├── 卡片1：图标 +"Web 开发"+ 描述
├── 卡片2：图标 +"Astro"+ 描述
└── 卡片3：图标 +"AI"+ 描述
（卡片背景：--muted，大圆角 40px，简洁无边框）

精选文章区块（带卡片外框）
├── 标题："精选文章"+ 副标题
├── 右侧：[查看全部 →] 按钮（outline，圆形）
└── 文章列表：一行一条，标题 + 日期，hover 时背景变为 --muted

最近项目区块
├── 标题："最近项目"+ [查看全部 →]
└── 项目卡片（2列网格）：项目名 + 简介
```

**Hero Section 布局：** CSS Grid，`grid-template-columns:1fr auto`，左文右图

**精选文章 + 最近项目** 作为独立 Section，有明显的大圆角卡片容器包裹

---

### 5.2 文章列表页（`/posts/`）

**页面结构：**

```
标题："我的文章"（居中，h1）

文章列表（垂直线性，非卡片）
├── 文章行1：[文章标题文字]           [2026年3月9日]
├── 文章行2：[文章标题文字]           [2026年2月4日]
├── ...（每行有底部分割线，hover 时整行背景变 --muted）
└── 每页约 10 条

分页组件（居中）
├── [← 上一页]   1/6   [下一页 →]
└── 按钮为胶囊形 outline 样式
```

**Astro 实现：** 使用 `getStaticPaths` + `paginate()`，路由为 `/posts/` 和 `/posts/2/` 等

**Content Collection Schema（文章 frontmatter）：**

ts

```ts
// src/content/config.ts
const postsCollection =defineCollection({
  type:'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.date(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    minutesRead: z.string().optional(),// 阅读时长（可通过插件自动计算）
})
});
```

---

### 5.3 文章详情页（`/posts/[slug]/`）

**页面结构：**

```
文章 Header（居中，max-width: 768px）
├── 大标题（h1，衬线体 Fraunces）
├── 元信息行：发布于：YYYY年M月D日 · XXX字 · X分钟
└── 标签区：[tag1][tag2]（小胶囊，圆角，border 样式）

分割线（hr）

文章正文（Markdown 渲染，Tailwind Typography prose）
├── max-width: 768px，mx-auto
├── font-size: 18px，line-height:1.8
├── 代码块：圆角，深色背景
├── 链接：--primary 绿色，underline
└── 图片：圆角，居中

作者 CTA 区块（文章结尾，大圆角卡片）
├── 微信公众号 / 二维码推广等可选
└── 或 "加我交流" 类似信息

评论区（可选，使用 giscus 或 waline 等评论系统）
└── 基于 GitHubDiscussions 的评论
```

**Markdown 渲染：** 推荐使用 `@tailwindcss/typography` 插件，在 `prose` class 上添加 `dark:prose-invert`

**阅读时长计算：** 使用 `remark-reading-time` 插件，通过 `remarkPlugins` 注入到 Astro 配置

---

### 5.4 项目页（`/projects/`）

**页面结构：**

```
标题："项目"（居中）
副标题："我开发或维护的项目"

项目网格（3列，移动端降为 1列）
├── 项目卡片1
│   ├── 项目名（h2/h3）
│   └── 项目简介（1~2行）
├── 项目卡片2
└── ...
```

**项目卡片样式：**

- 背景：`--background` 白色（比首页 Skills 卡片更白，border 明显）
- `border: 1px solid var(--border)`
- `border-radius:20~24px`
- 无图片，纯文字卡片
- 整张卡片可点击，链接到 GitHub 或项目地址
- hover 效果：轻微 transform 上移 + 阴影加深

**数据来源：** 推荐用 `src/content/projects/` 目录下的 JSON/MD 文件，或直接在 `projects/index.astro` 中写死数据对象数组

---

### 5.5 友链页（`/links/`）

**页面结构：**

```
标题："友链"（居中）
副标题："海内存知己，天涯若比邻"（古诗句，增加文化氛围）

友链网格（3列，移动端 1~2列）
├── 友链卡片1
│   ├── 头像（圆形，48px）+ 名字（同行）
│   └── 简介描述
├── 友链卡片2
└── ...（数量不限，自动换行）
```

**友链卡片样式：**

* 背景：`--muted`（浅米色）
* `border-radius: 16~20px`
* 无明显边框（与背景融合）
* 头像：`border-radius: 50%`，有时有 icon/emoji 替代图片
* 整卡可点击，打开新 Tab

**数据来源：** `src/data/links.ts` 或 `src/content/links.json`，数据结构：

ts

```ts
interfaceFriend{
  name:string;
  url:string;
  avatar?:string;// 可选头像 URL
  bio:string;// 一句话简介
}
```

---

### 5.6 关于页（`/about/`）

**页面结构：**

```
标题："关于我/关于本站"（居中，h1）

章节1："我是 [你的名字]"（h2）
├── 自我介绍段落文字
└── 列表：参与的开源项目、当前在做的事

章节2："我的技术栈"（h2）
└── 列表：语言、前端、后端、工具

章节3："关于本站"（h2）
├── 本站用途说明
└── 技术构建列表（Astro、TailwindCSS 等超链接）

章节4："我的其他主页"（h2）
└── GitHub、Twitter/X、微信公众号等链接
```

**实现方式：** 可以是纯 `about/index.astro`（Astro 直接写 HTML），或 `about.md`（MDX）配合 prose 样式渲染

---

## 六、关键组件规格

### 6.1 Nav.astro

```
状态：sticky top-0，z-index:50
外层 header：全宽，padding: 12px 16px
内层 nav-inner：
  max-width: 960px，margin: auto
  background:rgba(var(--background-rgb),0.8)
  backdrop-filter:blur(12px)
  border-radius: 40px
  padding: 10px 16px 10px 20px
  display: flex，align-items: center，justify-content: space-between

左侧：logo（头像 32px + 站名文字）
中间：导航链接列表
右侧：GitHub icon + 主题切换按钮
```

### 6.2 ThemeToggle.astro

```
按钮样式：圆形图标按钮，38px
Light mode 显示月亮图标，Dark mode 显示太阳图标
点击后在 <html> 上切换 class"theme-dark"
通过 localStorage 持久化用户主题偏好
```

### 6.3 ContactCTA.astro

```
布局：flex row，align-items: center，justify-content: space-between
背景：--muted，border-radius: 20px
左侧：圆形图标（纸飞机/发送）+ 标题 + 副标题
右侧：[联系我 →] 按钮（--primary 背景，白色文字，圆形）
```

### 6.4 Pagination.astro

```
居中 flex 布局：[← 上一页]  当前页/总页数  [下一页 →]
按钮：outline 胶囊形，border: 1px solid var(--border)
当前页禁用前一页按钮（opacity 降低）
```

---

## 七、响应式设计

| 断点         | 宽度      | 变化                          |
| ------------ | --------- | ----------------------------- |
| 默认（移动） | < 640px   | 单列布局，导航折叠为汉堡菜单  |
| sm           | ≥ 640px  | 部分 2 列                     |
| md           | ≥ 768px  | Hero 左右布局启用，2~3 列网格 |
| lg           | ≥ 1024px | 完整布局，3 列项目/友链网格   |

---

## 八、深色模式实现

js

```js
// ThemeToggle.astro 中的 <script>
const theme =localStorage.getItem('theme')?? 
(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');

document.documentElement.classList.toggle('theme-dark', theme ==='dark');

button.addEventListener('click',()=>{
const isDark =document.documentElement.classList.toggle('theme-dark');
localStorage.setItem('theme', isDark ?'dark':'light');
});
```

为避免 FOUC（闪烁），在 `<head>` 内嵌入内联 `<script>` 提前执行主题判断。

---

## 九、SEO & 社交预览

每个页面通过 `BaseLayout` 的 `<head>` 注入：

html

```html
<metaname="description"content={description}/>
<metaproperty="og:title"content={title}/>
<metaproperty="og:description"content={description}/>
<metaproperty="og:type"content="website"/>
<metaname="twitter:card"content="summary"/>
<linkrel="canonical"href={canonicalURL}/>
<linkrel="sitemap"href="/sitemap-index.xml"/>
<!-- Astro @astrojs/sitemap 自动生成 sitemap -->
```

---

## 十、推荐的 astro.config.mjs

js

```js
import{ defineConfig }from'astro/config';
importtailwindfrom'@astrojs/tailwind';
importsitemapfrom'@astrojs/sitemap';
importmdxfrom'@astrojs/mdx';
importremarkReadingTimefrom'remark-reading-time';

exportdefaultdefineConfig({
site:'https://your-domain.com',
integrations:[
tailwind(),
sitemap(),
mdx(),
],
markdown:{
remarkPlugins:[remarkReadingTime],
shikiConfig:{
theme:'github-dark',// 代码块主题
wrap:true,
},
},
});
```

---

## 十一、整体风格关键词总结

这套设计的核心美学是： **克制、温暖、自然** 。

设计语言上，大量使用暖白（奶油色）底色，搭配橄榄绿主品牌色和暖棕次级色，整体传达一种"有点文艺的工程师"气质。卡片采用超大圆角（40px），视觉上非常柔和，与锋利的 SaaS 工具型网站风格截然不同。导航栏的"浮动胶囊"设计既现代又不张扬。字体上衬线体（Fraunces）用于标题，增加人文气息；正文使用 OPPO Sans 保证中文的可读性。

整体信息密度适中，不过分设计，内容本身是核心，设计只是辅助。
