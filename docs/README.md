# PRISM 文档索引

本目录包含 PRISM 项目的完整文档。

## 📚 使用指南

- **[部署指南](guides/deployment.md)** - 如何将网站部署到 GitHub Pages 或 Cloudflare Pages
- **[国际化文档](guides/i18n.md)** - 多语言支持的使用说明

## 📁 项目资源

### 图片资源 (`assets/images/`)
- `logo.png` - PRISM 项目 Logo
- `favicon.svg` - 网站图标
- `screenshot.png` - 项目预览截图
- `bio.jpg` - 示例个人照片

### 论文资源 (`assets/papers/`)
存放论文相关的文件和图片

### 项目资源 (`assets/projects/`)
存放项目展示相关的图片和资源

## 🔧 开发文档

### 核心概念

PRISM 使用配置驱动的内容管理系统：

1. **内容配置** (`content/` 目录)
   - TOML 文件定义页面结构
   - Markdown 文件编写内容
   - BibTeX 文件管理论文引用

2. **源代码** (`src/` 目录)
   - `app/` - Next.js 应用路由
   - `components/` - React 组件
   - `lib/` - 工具函数和解析器
   - `types/` - TypeScript 类型定义

3. **构建流程**
   - `scripts/sync-assets.js` 在构建前同步资源
   - Next.js 生成静态站点到 `out/` 目录

### 文件组织规范

```
docs/
├─ README.md          # 本文件，文档索引
├─ guides/            # 用户指南
│  ├─ deployment.md   # 部署说明
│  └─ i18n.md         # 国际化说明
└─ assets/            # 文档资源
   ├─ images/         # 图片文件
   ├─ papers/         # 论文相关
   └─ projects/       # 项目图片
```

## 🤝 贡献

欢迎贡献！请查看项目根目录的 [CONTRIBUTING.md](../CONTRIBUTING.md) 了解如何参与。

## 📝 许可证

本项目采用 MIT 许可证，详见 [LICENSE](../LICENSE)。
