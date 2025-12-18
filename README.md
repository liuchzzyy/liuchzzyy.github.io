<div align="center">
  <img src="docs\static\logo.png" alt="PRISM Logo" height="100"/>
</div>

---

**PRISM**（Portfolio & Research Interface Site Maker）是一个基于 Next.js、Tailwind CSS 和 TypeScript 的个人网站模板，适合研究人员、开发者与学者快速搭建作品集与学术主页。此文档为仓库的简洁介绍与快速上手指南。

**如果你喜欢这个项目，请给[原项目](https://github.com/xyjoey/PRISM)一个 Star ⭐️**

**在线演示**: https://prism-demo.pages.dev
![PRISM 预览](docs/static/screenshot.png)
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

构建后站点将输出到 `out/`（静态托管目录）。有关部署的详细步骤，请参阅 [docs/deployment.md](docs/deployment.md)。

## 配置说明（概览）

- 全站配置：`content/config.toml`，包含站点标题、作者、导航等
- 首页内容：`content/about.toml`（关于、新闻、精选论文等）
- 论文数据：`content/publications.bib`，支持从 Zotero/Google Scholar 导出
- 新页面：在 `content/` 下新增 TOML 文件，并将其添加到 `config.toml` 的导航中

常见页面类型：`text`（Markdown 文档）、`card`（卡片集合）、`publication`（论文列表）

## 项目结构（简要）

```
PRISM/
├─ content/        # 用户内容（TOML、MD、BibTeX）
├─ public/         # 静态资源（图片、PDF 等）
├─ src/
│  ├─ app/         # Next.js 应用路由
│  ├─ components/  # 组件
│  ├─ lib/         # 工具、解析器
│  └─ types/       # TypeScript 类型
├─ next.config.ts
└─ tailwind.config.ts
```

## 参与贡献

欢迎通过 Issue 或 Pull Request 参与改进。查看仓库的贡献指南（如有）并在 PR 中说明修改内容。

## 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE)。
