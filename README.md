# Dr. Cheng Liu — Academic Website

**English** · [中文](README_cn.md) · [Live Site](https://liuchzzyy.github.io) · [Design System](DESIGN.md) · [Changelog](CHANGELOG.md)

Personal academic website of **Cheng Liu** (Institute of Materials Science of Barcelona, ICMAB-CSIC & Universitat Autònoma de Barcelona), built on [PRISM](https://github.com/xyjoey/PRISM) with a customized **Editorial Academic** visual system.

## Features

- **Editorial Academic Design**: Warm ivory light mode (`#FAF9F6`) and deep midnight dark mode (`#0D1321`) with antique amber-bronze accents, pairing `Newsreader`, `Inter`, `JetBrains Mono`, and CJK serif fallbacks (see [DESIGN.md](DESIGN.md)).
- **Configuration-Driven Bilingual Content**: English (`content/`) and Chinese (`content_zh/`) content managed cleanly with TOML, Markdown, and BibTeX, with automatic locale fallback.
- **BibTeX-Driven Publications with TOC Cards**:
  - Every publication renders as a **TOC graphical abstract + metadata** card (`public/papers/1.jpg`–`25.jpg`).
  - Manual `selected = {true/false}` control for homepage Selected Publications.
  - Verified co-author ORCID links (`author_orcids`), co-first author underline (`#`), and multi-corresponding author asterisk (`*`) support.
  - Live search, Year/Type filters, expandable BibTeX view, and one-click BibTeX copy.
- **Direct CV PDF Download**: `/cv/` renders structured Markdown alongside a one-click **Download PDF** button serving `public/cv.pdf`.
- **Static Export & Feeds**: Built with Next.js 15 (`output: 'export'`), Tailwind CSS v4, TypeScript, and Framer Motion, automatically generating RSS/Atom feeds and deploying to GitHub Pages via GitHub Actions.

## Local Development

### Prerequisites

- Node.js 22+
- npm

### Commands

```bash
git clone git@github.com:liuchzzyy/liuchzzyy.github.io.git
cd liuchzzyy.github.io
npm install
npm run dev      # Local preview at http://localhost:3000
npm run lint     # ESLint checks
npm run build    # Static export to out/ + RSS/Atom generation
```

## Content Maintenance Guide

### 1. Site Settings & Last Updated Date
Edit [`content/config.toml`](content/config.toml) (English) and [`content_zh/config.toml`](content_zh/config.toml) (Chinese) to update bio metadata, navigation items, social links, work address, or `site.last_updated`.

### 2. Publications (`content/publications.bib`)
Each entry supports standard BibTeX fields plus the following extensions:
- `selected = {true}` / `{false}`: Controls whether the paper appears in **Selected Publications** on the homepage.
- `preview = {<filename>}`: TOC image located under `public/papers/` (currently `1.jpg`–`25.jpg` in reverse-chronological display order). Replace the corresponding placeholder image to update a paper's TOC graphic.
- Author markers in `author = {...}`:
  - Append `#` for co-first authors (rendered underlined).
  - Append `*` for corresponding authors (rendered as superscript `*`; multiple corresponding authors are supported).
- `author_orcids = {Last, First|0000-0000-0000-0000; ...}`: Verified ORCID profile links for co-authors.
- Inline LaTeX title formatting: supports `\textit{}`, `\emph{}`, `\textbf{}`, `\textsc{}`, `\textsuperscript{}`, and `\textsubscript{}`.

### 3. Curriculum Vitae & PDF Download
- Update the web CV text in `content/cv.md` and `content_zh/cv.md`.
- Replace [`public/cv.pdf`](public/cv.pdf) with your generated CV PDF file. Download path and filename are configured in `content/cv.toml` and `content_zh/cv.toml` (`pdf` and `pdf_filename`).

### 4. Pages & Localization
- Default (English) content lives in `content/`; Chinese overrides live in `content_zh/`.
- Supported page types: `about`, `publication`, `card` (`teaching`, `services`, `awards`), `list` (`news`), and `text` (`cv`).

## Project Structure

```text
liuchzzyy.github.io/
├── .github/workflows/deploy.yml  # Automated GitHub Pages build & deploy
├── content/                      # English content (TOML, Markdown, BibTeX)
├── content_zh/                   # Chinese localized content
├── public/
│   ├── bio.jpg                   # Profile avatar
│   ├── cv.pdf                    # Downloadable CV PDF
│   └── papers/                   # Publication TOC graphics (1.jpg–25.jpg)
├── scripts/generate-rss.js       # Static RSS & Atom feed generator
├── src/
│   ├── app/                      # Next.js App Router pages & global styles
│   ├── components/               # Home, layout, publications, pages, and UI components
│   ├── lib/                      # BibTeX/TOML/Markdown loaders, i18n, and stores
│   └── types/                    # TypeScript interfaces
├── DESIGN.md                     # Editorial Academic design system specification
└── next.config.ts                # Static export configuration
```

## Deployment

Pushing to the `main` branch automatically triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the static site into `out/`, verifies `out/rss/feed.xml` and `out/rss/feed-atom.xml`, and publishes to GitHub Pages. See [docs/deployment.md](docs/deployment.md) for additional hosting options.

## Credits & License

- Built with [PRISM](https://github.com/xyjoey/PRISM) (**P**ortfolio & **R**esearch **I**nterface **S**ite **M**aker).
- Licensed under the [MIT License](LICENSE).
