# Cheng Liu Academic Website Design System

## 1. Atmosphere & Identity

An editorial academic profile inspired by high-impact scientific journals: warm ivory paper canvas, deep ink navy typography, antique amber-bronze accents, and restrained paper-card depth keep dense research content calm, authoritative, and effortless to read across both English and Chinese locales.

## 2. Color

| Role | Token | Light | Dark |
|------|-------|-------|------|
| Background | `--background` | `#FAF9F6` | `#0D1321` |
| Elevated surface | `--surface` | `#FFFFFF` | `#141D2F` |
| Subtle surface | `--surface-subtle` | `#F3EFE7` | `#1B263B` |
| Hairline border | `--border-subtle` | `#E6E0D5` | `rgba(218, 198, 162, 0.14)` |
| Strong border | `--border-strong` | `#D3C9B8` | `rgba(224, 177, 101, 0.34)` |
| Foreground | `--foreground` | `#1A2332` | `#F0EDE6` |
| Primary headings | `--primary` | `#162032` | `#F6F4EE` |
| Accent | `--accent` | `#9A6B2F` | `#E0B165` |
| Accent soft tint | `--accent-soft` | `rgba(154, 107, 47, 0.09)` | `rgba(224, 177, 101, 0.14)` |

Light-mode accent (`#9A6B2F`) provides > 4.5:1 contrast against `#FAF9F6` and `#FFFFFF` for WCAG 2.2 AA legibility.

## 3. Typography

- **Body**: `Inter` (loaded via `next/font/google`) with system CJK sans fallbacks (`PingFang SC`, `Hiragino Sans GB`, `Microsoft YaHei`).
- **Headings & Journal Titles**: `Newsreader` (loaded via `next/font/google`), paired with `Source Han Serif SC` / `Noto Serif CJK SC` / `Songti SC` for Chinese locales.
- **Metadata (Dates, Years, Counts, BibTeX)**: `JetBrains Mono` (`--font-mono`).

## 4. Layout & Components

- **Two-column Homepage**: Sticky left profile sidebar (`lg:col-span-4`) and primary reading column (`lg:col-span-8`) inside a `max-w-6xl` container aligned with the masthead navigation bar.
- **Profile Sidebar**: Framed square portrait, serif name with subtle accent divider, circular contact/academic icon row with mutually exclusive inline popovers (Email with one-click copy; Work Address with direct ICMAB-CSIC Google Maps link), and scannable pill-styled Research Interests card.
- **Selected Publications**: Horizontal editorial cards pairing a 4:3 TOC graphical abstract frame (`public/papers/1.jpg`–`4.jpg`) with italic serif venue, monospaced year, linked title, verified ORCID author metadata, DOI link, and one-click BibTeX copy feedback.
- **News Timeline**: Vertical hairline timeline with amber markers and monospaced date badges.
- **Print-ready CV**: Clean `@media print` styling hides navigation and footer chrome for direct PDF export.
