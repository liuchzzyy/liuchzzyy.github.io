# PRISM Codebase Guide for AI Agents

## Project Overview

**PRISM** (Portfolio & Research Interface Site Maker) is a Next.js-based academic portfolio template featuring **configuration-driven content management**. No source code changes needed to update site content—all customization happens through TOML, Markdown, and BibTeX files in `content/`.

## Architecture: Three-Layer Design

### 1. Content Layer (`content/`)

- **TOML files** (`config.toml`, `about.toml`, `publications.toml`, etc.): Define site structure, metadata, and page configurations
- **Markdown files** (`resume.md`, `bio.md`): Full page content with `source:` reference in TOML
- **BibTeX** (`publications.bib`): Academic publication data (automatically parsed and rendered)
- **Key patterns**:
  - Each page maps to a `.toml` config file specifying `type: 'text'|'publication'|'card'`
  - Pages declared in `config.toml` `[[navigation]]` sections; pages not in navigation are excluded
  - BibTeX fields include custom `selected: true` marker for homepage featured publications

### 2. Parsing & Type Layer (`src/lib/`)

- **`config.ts`**: Loads `content/config.toml`, exports `getConfig()` → `SiteConfig` interface
- **`content.ts`**: Generic loaders (`getTomlContent()`, `getMarkdownContent()`, `getBibtexContent()`, `getPageConfig()`)
- **`bibtexParser.ts`**: Converts BibTeX entries to `Publication[]` type; maps entry types (article→journal, inproceedings→conference); respects `selected` field and author highlighting
- **Type files** (`src/types/`): Defines `BasePageConfig` (title, description, type), `TextPageConfig`, `PublicationPageConfig`, `CardPageConfig`, `Publication`

### 3. Rendering Layer (`src/components/` & `src/app/`)

- **Route structure**:
  - Root page (`src/app/page.tsx`): Renders "about" homepage, combines multiple sections (Profile, About, News, SelectedPublications)
  - Dynamic routes (`src/app/[slug]/page.tsx`): Renders all non-about pages; uses `generateStaticParams()` to pre-generate static HTML
- **Component types**:
  - **Layout**: `Navigation`, `Footer` (read from `config.social` and `config.navigation`)
  - **Page wrappers**: `TextPage` (Markdown → ReactMarkdown), `PublicationsList`, `CardPage`
  - **Home sections**: `Profile`, `About`, `News`, `SelectedPublications` (each reads specific TOML sections)

## Data Flow Example: Adding a Publication

1. **Edit** `content/publications.bib` (add BibTeX entry with `selected = true`)
2. **Parser** (`bibtexParser.ts`): Converts to `Publication` object, marks author with dark background
3. **Homepage** (`page.tsx`): Calls `parseBibTeX()`, filters where `selected === true`, passes to `SelectedPublications`
4. **Render**: Component displays formatted citation with metadata

## Configuration-Driven Content Model

### Core Config File: `content/config.toml`

```toml
[site]
title = "Your Name"  # Page title and breadcrumb label
description = "..."  # SEO description
favicon = "path/to/favicon.svg"

[author]
name = "..."  # Used in BibTeX parsing (highlights publications where name is author)
avatar = "path/to/image"

[social]
email = "..."  # Listed in footer
github = "..."  # Social links in navigation

[[navigation]]
title = "Page Title"
type = "page"  # or "link" for external URLs
target = "about"  # matches content/about.toml filename
href = "/"  # URL path

[features]
enable_one_page_mode = false  # If true, all pages render on homepage
```

### Page Config Pattern: `content/{name}.toml`

```toml
type = "text"  # or "publication", "card", "about"
title = "Page Title"
description = "Optional subtitle"
source = "resume.md"  # Markdown file to render (text type only)
```

### About Page Sections: `content/about.toml`

Special structure with `[[sections]]` array, each section defines:

- `id`: Unique identifier
- `type`: "markdown" | "publications" | "list"
- `source`: Filename (for markdown/publications types)
- `title`: Section heading
- `limit`: Max items to display (for publications/lists)
- `filter`: BibTeX keyword filter (for publications)

## Developer Workflows

### Local Development

```bash
npm install          # Node.js 22+ required
npm run dev          # Start dev server with turbopack (http://localhost:3000)
```

### Building & Deployment

```bash
npm run build        # Generates static HTML to `out/` directory
npm start            # Preview production build locally
npm run lint         # ESLint + Next.js linting
```

- Static export enabled in `next.config.ts` → compatible with GitHub Pages, Cloudflare Pages, Vercel static
- See [docs/deployment.md](../../docs/deployment.md) for platform-specific guides

### Content-Only Updates

**No rebuild needed**: TOML/BibTeX/Markdown in `content/` load at build time via `getConfig()`, `getPageConfig()`. Update content files and rebuild.

## Project-Specific Conventions

### File Organization

- **Never modify** `src/app/` routes or `src/components/` for content changes—use `content/` files instead
- **Components expect props**: page config objects (type-specific) + content string (for text/publications)
- **Styling**: Tailwind CSS v4 with dark mode support via `next-themes` + `ThemeProvider`

### BibTeX Parsing Details

- Month parsing: Handles both names (jan, january) and numbers (1-12)
- Type mapping: article→journal, inproceedings→conference, phdthesis/mastersthesis→thesis, misc→preprint
- Author extraction: Parses "First Last, First Last" format; highlights matching `config.author.name`
- Publication date: Uses year + optional month; fallback to current year if missing

### Markdown Rendering

- Uses `react-markdown` with custom component overrides (h1/h2/h3 styling, links open in new tabs)
- Embedded markdown sections inherit smaller font sizes when nested (check `embedded` prop in components)

### State Management

- Theme switching: Zustand store (`themeStore.ts`) + `next-themes` wrapper
- No complex state needed—data flows from config files through React components

## Common Modifications

### Add a New Page

1. Create `content/{pagename}.toml` with page config
2. Add `[[navigation]]` entry in `content/config.toml`
3. Create markdown file if type is "text" (referenced in `source` field)
4. Run `npm run build` to pre-generate static HTML

### Filter Publications by Research Area

- Edit `content/about.toml` section: add `filter: "keyword"` to filter by BibTeX keywords
- Parser automatically includes publications where BibTeX `keywords` field contains the filter term

### Customize Component Layout

- Page-specific logic in `src/app/page.tsx` (homepage) or `src/app/[slug]/page.tsx` (other pages)
- Reusable components in `src/components/pages/` and `src/components/home/`
- Styling in individual components or `src/app/globals.css`

## Key Dependencies

- **Next.js 15.3**: App Router, static generation via `generateStaticParams()`
- **React 19**: Server components by default, minimal client interactivity
- **Tailwind CSS 4 + PostCSS**: Responsive design, dark mode
- **Zustand**: Minimal theme state
- **bibtex-parse-js**: BibTeX parsing (legacy CommonJS module, required with `eslint-disable-next-line`)
- **smol-toml**: TOML parsing for configuration files
- **react-markdown + framer-motion**: Content rendering with animations

## Debugging Tips

- **Config not loading**: Check `content/config.toml` syntax (TOML is strict about formatting)
- **Page not appearing**: Verify page name in navigation `target` matches TOML filename
- **BibTeX not parsed**: Ensure `publications.bib` has valid BibTeX syntax; check `selected` field uses lowercase `true`/`false`
- **Static generation fails**: Check that `generateStaticParams()` returns all expected pages; missing config files cause `notFound()`
