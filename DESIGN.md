# Cheng Liu Academic Website Design System

## 1. Atmosphere & Identity

An editorial academic profile: deep navy structure, warm gold accents, and restrained card depth keep dense research content readable. The signature is author-first metadata presented in a calm, bilingual reading flow.

## 2. Color

| Role | Token | Light | Dark |
|------|-------|-------|------|
| Background | `--background` | `#fefffe` | `#0f172a` |
| Foreground | `--foreground` | `#0f172a` | `#f8fafc` |
| Primary | `--primary` | `#1e293b` | `#f8fafc` |
| Accent | `--accent` | `#d4a562` | `#e4b976` |
| Neutral surfaces | `--neutral-50` to `--neutral-900` | Tailwind CSS variables | inverted dark ramp |

Interactive links use `accent` and `accent-dark`; no new colors are introduced by the ORCID links.

## 3. Typography

- Body: `Inter`, system sans fallback, using Tailwind `text-sm` through `text-lg`.
- Headings: `Georgia CDN`, Georgia fallback, using Tailwind serif heading utilities.
- Chinese headings use the existing Source Han Serif fallback stack.
- Author metadata remains at the existing body-small scale.

## 4. Spacing & Layout

- Existing Tailwind spacing scale is the source of truth; spacing follows a 4px base.
- Publication cards use the existing responsive stack: one column on narrow screens and preview/content rows from `md` upward.
- The document retains the existing full-width reading flow and responsive breakpoints.

## 5. Components

### Publication author metadata

- **Structure**: inline author list, optional ORCID anchor around the author name, optional superscript correspondence marker.
- **Variants**: highlighted author, co-first author, corresponding author, verified ORCID link, plain author.
- **Spacing**: existing inline punctuation and author-list flow.
- **States**: default, hover (accent color), focus (browser-visible focus), visited (browser default).
- **Accessibility**: semantic external anchor, descriptive `aria-label`, `target="_blank"` with `rel="noopener noreferrer"`.
- **Motion**: existing short color transition only; no new layout animation.
- **Layout**: inline cluster within the publication card.

## 6. Motion & Interaction

Existing Framer Motion entry transitions remain unchanged. ORCID links use the existing accent color transition and respect the site's global reduced-motion behavior.

## 7. Depth & Surface

The existing mixed strategy is retained: neutral surface shifts plus the current subtle card borders and shadows. ORCID links do not add a new surface treatment.

## 8. Accessibility Constraints & Accepted Debt

- WCAG 2.2 AA target, keyboard-reachable links, visible browser focus, and bilingual text preserved.
- ORCID links are added only for verified author identity matches from ORCID/Crossref metadata. Corresponding-author status is not inferred where source metadata does not identify it.
