<div align="center">
  <img src="docs/assets/images/logo.png" alt="PRISM Logo" height="100"/>
</div>

---

**PRISM**（Portfolio & Research Interface Site Maker）是一个基于 Next.js、Tailwind CSS 和 TypeScript 的个人网站模板，适合研究人员、开发者与学者快速搭建作品集与学术主页。此文档为仓库的简洁介绍与快速上手指南。

**如果你喜欢这个项目，请给[原项目](https://github.com/xyjoey/PRISM)一个 Star ⭐️**

**在线演示**: https://prism-demo.pages.dev
![PRISM 预览](docs/assets/images/screenshot.png)
**更新日志**: [CHANGELOG.md](CHANGELOG.md)

---

## 简要说明

PRISM 采用配置驱动的内容管理：通过编辑 `content/` 下的 TOML、Markdown 与 BibTeX 文件即可控制站点内容；无需修改源码。项目优化了静态导出与 SEO，便于在各种静态托管平台上部署。

## 主要功能

- 配置驱动的内容管理（TOML / Markdown / BibTeX）
- 原生 BibTeX 支持，自动生成论文列表与引用展示
- 响应式设计与深色模式支持
- 针对静态部署优化，容易部署到 GitHub Pages / Cloudflare Pages 等

## 快速开始

先决条件：Node.js 22+（推荐使用 Docker 安装）

1. 克隆仓库并进入目录：

```bash
git clone https://github.com/xyjoey/PRISM.git
cd PRISM
```

2. 安装依赖：

```bash
npm install
```

3. 启动开发服务器：

```bash
npm run dev
```

在浏览器中访问 http://localhost:3000 进行预览。

构建静态站点：

```bash
npm run build
```

构建后站点将输出到 `out/`（静态托管目录）。有关部署的详细步骤，请参阅 [docs/guides/deployment.md](docs/guides/deployment.md)。

## 配置说明（概览）

- 全站配置：`content/config.toml`，包含站点标题、作者、导航等
- 首页内容：`content/about.toml`（关于、新闻、精选论文等）
- 论文数据：`content/publications.bib`，支持从 Zotero/Google Scholar 导出
- 新页面：在 `content/` 下新增 TOML 文件，并将其添加到 `config.toml` 的导航中

常见页面类型：`text`（Markdown 文档）、`card`（卡片集合）、`publication`（论文列表）

## 项目结构

```
PRISM/
├─ content/           # 用户内容配置
│  ├─ *.toml          # 页面配置文件
│  ├─ *.md            # Markdown 内容
│  └─ publications.bib # 论文引用数据
├─ docs/              # 项目文档
│  ├─ guides/         # 使用指南
│  │  ├─ deployment.md   # 部署指南
│  │  └─ i18n.md         # 国际化文档
│  └─ assets/         # 文档相关资源
│     ├─ images/      # 图片资源
│     ├─ papers/      # 论文相关文件
│     └─ projects/    # 项目图片
├─ scripts/           # 构建脚本
├─ src/               # 源代码
│  ├─ app/            # Next.js 应用路由
│  ├─ components/     # React 组件
│  │  ├─ home/        # 首页组件
│  │  ├─ layout/      # 布局组件
│  │  ├─ pages/       # 页面组件
│  │  ├─ publications/ # 论文列表组件
│  │  └─ ui/          # UI 组件
│  ├─ lib/            # 工具库
│  │  ├─ i18n/        # 国际化支持
│  │  └─ stores/      # 状态管理
│  └─ types/          # TypeScript 类型定义
├─ .github/           # GitHub 配置
│  └─ workflows/      # CI/CD 工作流
├─ LICENSE            # 许可证
├─ README.md          # 项目说明
├─ CHANGELOG.md       # 更新日志
├─ package.json       # 项目依赖
├─ tsconfig.json      # TypeScript 配置
├─ next.config.ts     # Next.js 配置
├─ tailwind.config.mjs # Tailwind 配置
├─ postcss.config.mjs  # PostCSS 配置
└─ eslint.config.mjs   # ESLint 配置
```

## 参与贡献

欢迎通过 Issue 或 Pull Request 参与改进。请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细的贡献指南。

## 📚 文档

- **[内容管理说明](content/README.md)** - 如何编辑和组织内容
- **[部署指南](docs/guides/deployment.md)** - 部署到各种平台的详细步骤
- **[国际化文档](docs/guides/i18n.md)** - 多语言支持的使用说明
- **[文档索引](docs/README.md)** - 完整文档目录

## 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE)。
