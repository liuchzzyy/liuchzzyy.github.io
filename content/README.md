# 内容目录说明

此目录包含网站的所有内容配置文件。PRISM 采用配置驱动的内容管理，您只需编辑这些文件即可更新网站内容，无需修改源代码。

## 📁 文件组织

### 配置文件类型

1. **TOML 文件** (`.toml`) - 页面配置和结构定义
2. **Markdown 文件** (`.md`) - 文本内容
3. **BibTeX 文件** (`.bib`) - 论文引用数据

### 多语言支持

PRISM 支持中英双语：

- **英文**: `filename.ext` (例: `bio.md`, `news.toml`)
- **中文**: `filename.zh.ext` (例: `bio.zh.md`, `news.zh.toml`)

当切换语言时，系统会自动加载对应的 `.zh` 文件，如不存在则回退到英文版本。

## 🗂️ 核心文件说明

### `config.toml` / `config.zh.toml`
全站配置文件，包含：
- 网站标题、描述、图标
- 作者信息
- 社交媒体链接
- 导航菜单配置
- 功能开关

**示例结构**:
```toml
[site]
title = "Your Name"
description = "Your description"
favicon = "path/to/favicon.svg"

[author]
name = "Your Name"
avatar = "path/to/avatar.jpg"

[social]
email = "your@email.com"
github = "username"

[[navigation]]
title = "Page Title"
type = "page"
target = "about"
href = "/"
```

### `about.toml` / `about.zh.toml`
首页配置，定义首页各个部分的内容：
- Profile（个人信息）
- About（关于）
- News（新闻）
- Selected Publications（精选论文）

### `publications.bib`
BibTeX 格式的论文引用数据，支持：
- 从 Zotero、Google Scholar 等导出
- 使用 `selected = true` 标记精选论文
- 自动解析作者、标题、期刊等信息

### 页面配置文件
每个页面对应一个 TOML 文件：

- `resume.toml` / `resume.zh.toml` - 简历页面
- `publications.toml` / `publications.zh.toml` - 论文列表页面
- `projects.toml` / `projects.zh.toml` - 项目页面
- `techniques.toml` / `techniques.zh.toml` - 技术页面
- `news.toml` / `news.zh.toml` - 新闻页面

### 内容文件 (Markdown)
对应页面的实际内容：

- `bio.md` / `bio.zh.md` - 个人简介
- `resume.md` / `resume.zh.md` - 简历内容
- `techniques.md` / `techniques.zh.md` - 技术文章

## 📝 页面类型

PRISM 支持三种页面类型：

### 1. Text 页面
显示 Markdown 内容的文本页面。

```toml
type = "text"
title = "Page Title"
description = "Optional subtitle"
source = "content.md"
```

### 2. Publication 页面
显示论文列表，自动从 `publications.bib` 解析。

```toml
type = "publication"
title = "Publications"
description = "My research publications"
```

### 3. Card 页面
显示卡片列表（项目、新闻等）。

```toml
type = "card"
title = "Projects"

[[items]]
title = "Project Name"
description = "Project description"
image = "path/to/image.jpg"
link = "https://project.link"
```

## 🆕 添加新页面

1. **创建配置文件**: `content/newpage.toml`
   ```toml
   type = "text"
   title = "New Page"
   source = "newpage.md"
   ```

2. **创建内容文件**: `content/newpage.md`
   ```markdown
   # Page Content
   Your content here...
   ```

3. **添加到导航**: 编辑 `content/config.toml`
   ```toml
   [[navigation]]
   title = "New Page"
   type = "page"
   target = "newpage"  # 对应文件名（不含扩展名）
   href = "/newpage"
   ```

4. **（可选）添加中文版本**:
   - `content/newpage.zh.toml`
   - `content/newpage.zh.md`

## 🎨 自定义建议

### 修改个人信息
编辑 `config.toml` 和 `config.zh.toml` 的 `[author]` 部分。

### 更新论文列表
直接编辑 `publications.bib` 或从引用管理器导出新的 BibTeX。

### 调整首页布局
编辑 `about.toml` 的 `[[sections]]` 数组，添加、删除或重排版块。

### 添加社交链接
在 `config.toml` 的 `[social]` 部分添加新字段。

## 📖 更多文档

- [部署指南](../docs/guides/deployment.md)
- [国际化文档](../docs/guides/i18n.md)
- [贡献指南](../CONTRIBUTING.md)

## 💡 提示

- 修改内容后需要重新构建: `npm run build`
- 开发时使用 `npm run dev` 可实时预览更改
- TOML 格式对缩进和引号敏感，注意格式正确
- Markdown 支持标准语法及部分 HTML
