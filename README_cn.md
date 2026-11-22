# 刘城 — 个人学术主页

[English](README.md) · **中文** · [在线主页](https://liuchzzyy.github.io) · [设计规范](DESIGN.md) · [更新日志](CHANGELOG.md)

**刘城（Cheng Liu）** 的个人学术主页（巴塞罗那材料科学研究所 ICMAB-CSIC / 巴塞罗那自治大学），基于 [PRISM](https://github.com/xyjoey/PRISM) 构建，并采用定制的 **学术期刊社论风（Editorial Academic）** 视觉设计体系。

## 核心特性

- **学术期刊社论风设计**：暖纸白浅色模式（`#FAF9F6`）与深空蓝黑深色模式（`#0D1321`），搭配高对比度琥珀金强调色；西文衬线 `Newsreader`、正文 `Inter`、等宽 `JetBrains Mono` 与思源宋体/宋体中文排印自然融合（详见 [DESIGN.md](DESIGN.md)）。
- **配置驱动的中英双语**：英文内容位于 `content/`，中文内容位于 `content_zh/`，通过 TOML、Markdown 与 BibTeX 管理，缺失文件自动回退至默认语言。
- **全量 TOC 图文论文体系**：
  - 全部 25 篇论文统一采用 **TOC 缩略图 + 文献信息** 卡片呈现（对应 `public/papers/1.jpg`–`25.jpg`）。
  - 通过 `selected = {true/false}` 手动控制首页“代表性论文”展示。
  - 支持已核验的共同作者 ORCID 链接（`author_orcids`）、共同第一作者下划线（`#`）与多通讯作者上标星号（`*`）。
  - 支持关键词搜索、年份/类型筛选、BibTeX 展开查看与一键复制。
- **简历 PDF 一键下载**：`/cv/` 页面在展示结构化网页简历的同时，支持点击 **下载 PDF** 直接保存你上传的 `public/cv.pdf`。
- **静态导出与自动部署**：基于 Next.js 15（静态导出）、Tailwind CSS v4、TypeScript 与 Framer Motion，自动生成 RSS/Atom 订阅源并通过 GitHub Actions 自动部署至 GitHub Pages。

## 本地开发

### 环境要求

- Node.js 22 及以上版本
- npm

### 常用命令

```bash
git clone git@github.com:liuchzzyy/liuchzzyy.github.io.git
cd liuchzzyy.github.io
npm install
npm run dev      # 本地开发预览：http://localhost:3000
npm run lint     # ESLint 代码检查
npm run build    # 构建静态站点至 out/ 并生成 RSS/Atom
```

## 日常内容维护指南

### 1. 站点信息与底部更新时间
在 [`content/config.toml`](content/config.toml)（英文）与 [`content_zh/config.toml`](content_zh/config.toml)（中文）中修改个人头衔、机构、社交链接、办公地址及底部 `site.last_updated` 更新日期。

### 2. 论文列表维护（`content/publications.bib`）
除标准 BibTeX 字段外，支持以下扩展字段与标记：
- `selected = {true}` / `{false}`：控制该论文是否展示在首页「代表性论文」板块。
- `preview = {<文件名>}`：指定 `public/papers/` 下的 TOC 配图（当前按 `/publications/` 倒序展示顺序对应 `1.jpg`–`25.jpg`），直接覆盖同名文件即可替换真实 TOC 图。
- `author = {...}` 作者标记：
  - 姓名后加 `#` 标记共同第一作者（渲染为下划线）。
  - 姓名后加 `*` 标记通讯作者（渲染为上标星号 `*`，支持多位通讯作者；导出 BibTeX 时会自动清理标记）。
- `author_orcids = {Last, First|0000-0000-0000-0000; ...}`：为已核验的共同作者绑定 ORCID 主页链接。
- 标题行内格式：支持 `\textit{}`、`\emph{}`、`\textbf{}`、`\textsc{}`、`\textsuperscript{}` 与 `\textsubscript{}`。

### 3. 个人简历与 PDF 替换
- 网页简历正文分别编辑 `content/cv.md` 与 `content_zh/cv.md`。
- 将自己生成的简历 PDF 覆盖 [`public/cv.pdf`](public/cv.pdf) 即可生效；下载路径与保存文件名在 `content/cv.toml` 与 `content_zh/cv.toml` 中通过 `pdf`、`pdf_filename` 配置（如需中英文分别对应不同 PDF，可单独指定不同路径）。

### 4. 页面类型与多语言
- 默认（英文）内容放在 `content/`，中文覆盖文件放在 `content_zh/`，保持同名即可自动切换。
- 支持页面类型：`about`（首页）、`publication`（论文）、`card`（教学/项目/奖项）、`list`（新闻动态）、`text`（简历等长文）。

## 项目结构

```text
liuchzzyy.github.io/
├── .github/workflows/deploy.yml  # GitHub Pages 自动构建与部署工作流
├── content/                      # 英文内容配置（TOML / Markdown / BibTeX）
├── content_zh/                   # 中文内容配置
├── public/
│   ├── bio.jpg                   # 个人头像
│   ├── cv.pdf                    # 可直接下载的简历 PDF
│   └── papers/                   # 论文 TOC 配图（1.jpg–25.jpg）
├── scripts/generate-rss.js       # RSS / Atom 订阅源生成脚本
├── src/
│   ├── app/                      # Next.js App Router 页面与全局样式
│   ├── components/               # 首页、导航、论文、子页面与通用组件
│   ├── lib/                      # BibTeX/TOML/MD 解析器、多语言与状态管理
│   └── types/                    # TypeScript 类型定义
├── DESIGN.md                     # 学术期刊社论风设计系统说明
└── next.config.ts                # 静态导出配置
```

## 部署上线

推送代码至 `main` 分支后，[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 会自动执行 `npm run build`、校验 `out/rss/feed.xml` 与 `out/rss/feed-atom.xml`，并发布到 GitHub Pages。更多平台部署方式可参考 [docs/deployment_cn.md](docs/deployment_cn.md)。

## 致谢与协议

- 基于 [PRISM](https://github.com/xyjoey/PRISM)（**P**ortfolio & **R**esearch **I**nterface **S**ite **M**aker）模板构建。
- 本项目遵循 [MIT License](LICENSE) 开源协议。
