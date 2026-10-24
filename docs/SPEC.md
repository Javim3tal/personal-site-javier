# Personal website — Javier Ortiz Borrego

## Goals
- A modern, fast, single-page personal site that makes a recruiter understand in ~10 seconds who Javier is: **Senior Software Engineering Manager · Data & AI engineering leadership**, 26 years in software/data, Málaga (Spain), open to new roles.
- Content comes from the CV (`assets/CV_Javier_Ortiz_Borrego.pdf`; text extract in `docs/cv.txt`).
- A **Projects** section Javier can extend later by adding one object to an array — no HTML editing.
- Runs on localhost with no build step; deployable to GitHub Pages as-is (user site or project repo).

## Non-goals
- No framework, bundler, npm dependencies, backend, CMS, analytics, contact form or blog.
- No phone number anywhere on the site (public page → scrapers). Email, LinkedIn and CV download only.
- English only.

## Stack
Plain HTML5 + CSS (custom properties) + vanilla ES2020 JavaScript. Google Fonts allowed (loaded via `@import` in `design/tokens.css`). Local server: `python3 -m http.server 8080`.
All URLs/paths must be **relative** (no leading `/`) so the site works under `user.github.io/` and `user.github.io/repo/`. `.nojekyll` at root.

## Architecture — three independent layers, one owner each
| Layer | Files | Owner |
|---|---|---|
| Content | `content/content.js` (data), `content/CONTENT_NOTES.md` (copy rationale, what was left out) | Content agent |
| Design | `design/DESIGN.md` (proposal), `design/tokens.css` (custom properties, fonts, light/dark), `design/theme.css` (visual skin on contract classes), `design/styleguide.html` (standalone preview of tokens + components) | Design agent |
| Prototype | `index.html`, `assets/css/base.css` (reset, layout, grid, responsive structure — uses tokens only, no raw colors), `assets/js/main.js` (renders `window.SITE_CONTENT`, nav, theme toggle, reveal-on-scroll), `assets/img/*` (favicon etc.) | Prototype agent |

Nobody edits another layer's files. The three layers meet only through the contracts below.

Load order in `index.html` `<head>`: `design/tokens.css` → `assets/css/base.css` → `design/theme.css`; end of `<body>`: `content/content.js` → `assets/js/main.js` (both `defer` or at the end).

## Contract 1 — content data (`content/content.js`)
A classic script (not a module, so it works from `file://`) that assigns one global:

```js
window.SITE_CONTENT = {
  meta: { title, description, lang: "en", ogImage /* relative path or "" */ },
  person: { name, role, location, email, linkedin /* full https URL */, github /* full URL or "" */, cvUrl: "assets/CV_Javier_Ortiz_Borrego.pdf", availability /* short line, e.g. "Open to new opportunities" */ },
  hero: { eyebrow, headline, lead, ctas: [{ label, href, kind: "primary" | "ghost" }] },
  stats: [{ value /* "26+" */, label }],                  // 3–4 items
  about: { title, paragraphs: [string] },                   // 2–3 short paragraphs
  expertise: [{ icon, title, summary, items: [string] }],    // icon ∈ "team" | "data" | "ai" | "quality" | "code"
  experience: [{ company, location, roles: [{ title, start, end, highlights: [string] }] }], // newest first
  earlierExperience: [{ company, title, start, end, summary }],
  projects: [{ title, summary, tags: [string], status: "live" | "wip" | "placeholder", links: { demo, repo, writeup } /* each URL or "" */, image /* relative path or "" */ }],
  certifications: [{ group, issuer, items: [{ name, date }] }],
  contact: { title, text }
};
```
Strings are plain text (renderer escapes them; no HTML inside). Dates as displayed, e.g. `"Jan 2023"`, `"Aug 2026"`. Any field may be an empty string/array; the renderer must hide empty parts.

## Contract 2 — design tokens (`design/tokens.css`)
Defined on `:root` (light), redefined under `:root[data-theme="dark"]` and under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }`. Required names (more allowed):
- Color: `--color-bg --color-surface --color-surface-2 --color-text --color-text-muted --color-border --color-accent --color-accent-contrast --color-accent-soft --color-focus`
- Effects: `--gradient-hero --shadow-sm --shadow-md --shadow-lg`
- Type: `--font-sans --font-display --font-mono --fs-xs --fs-sm --fs-base --fs-lg --fs-xl --fs-2xl --fs-3xl --fs-display --lh-tight --lh-body --fw-regular --fw-medium --fw-bold`
- Space/shape: `--space-1 … --space-10 --radius-sm --radius-md --radius-lg --radius-pill --container-max --header-h`
- Motion: `--ease --duration-fast --duration` (and respect `prefers-reduced-motion` in theme.css)

## Contract 3 — DOM and class names (rendered by `main.js`, styled by `base.css` + `theme.css`)
- `<html data-theme="light|dark">` (set before first paint by an inline script in `<head>` and kept in sync by main.js, from localStorage or system preference; the attribute is absent without JS so the CSS system-dark rule still applies); `html.js` class when scripting runs; `.theme-toggle` button in header.
- `a.skip-link` → `#main`. `header.site-header > .container > a.brand + nav.nav (a.nav__link[, .is-active, aria-current]) + .theme-toggle + button.nav-toggle` (mobile menu below 896px; `.site-header.is-open` when expanded). base.css sets `display` on `.nav`, `.nav-toggle`, `.theme-toggle`; theme.css never does.
- Sections, in order, each `section.section#id > .container`: `#home` (class `hero` instead of `section`), `#about`, `#expertise`, `#experience`, `#projects`, `#certifications`, `#contact`. Section heading block: `.section__head > .section__eyebrow + h2.section__title + optional p.section__lead`. The eyebrow holds the plain label ("About"); the `01 |` number is decorative CSS (`::before` counter, hidden from assistive tech).
- Hero, in order: `p.hero__eyebrow` (`hero.eyebrow`), `h1.hero__title` = **`person.name`** (the only h1), `p.hero__tagline` (`hero.headline`, a display subheading smaller than the h1), `p.hero__lead`, `.hero__actions > a.btn.btn--primary|.btn--ghost`, `p.hero__meta > span.hero__location + span.hero__availability (.status-dot + text)`, `ul.stats > li.stat > .stat__value + .stat__label`. `<noscript>` fallback inside `#home`: `.noscript-fallback` with the same h1/tagline/lead/actions classes.
- Generic: `.container`, `.grid` (`.grid--2`, `.grid--3`), `.card` (`.card__icon`, `.card__title`, `.card__text`, `ul.card__list`), `.tag` (inside `ul.tags`), `.btn`, `.link`, `.sr-only`, `svg.icon.icon--<name>` (inline icons), `.reveal` (+ `.is-visible` added by IntersectionObserver, or immediately under reduced motion / no IntersectionObserver).
- About: `.section__head` + `.about__body > p.about__text` (one per paragraph); two columns (head 5/12, text 7/12) from 896px.
- Expertise: `.grid.grid--3.expertise > article.card`.
- Experience: `ol.timeline > li.timeline__item > h3.timeline__company (span.timeline__company-name + span.timeline__location) + .timeline__role (h4.timeline__title, p.timeline__dates, ul.timeline__highlights)`; rail, nodes and indent are theme.css's. Earlier roles: `h3.earlier__heading` + `ul.earlier > li.earlier__item (p.earlier__title, p.earlier__company, p.earlier__dates, p.earlier__summary)`. `#experience` stays on the plain page background (timeline nodes are filled with `--color-bg`).
- Projects: `.grid.grid--3.projects > article.project-card[data-status]` with `.project-card__media > img`, `p.project-card__status`, `h3.project-card__title`, `p.project-card__text`, `ul.tags`, `.project-card__links > a.link`. `.project-card__status` is real text rendered by main.js — "Coming soon" for `placeholder` (dashed card), "In progress" for `wip`, none for `live` — and is the only place the label appears (no CSS-generated label). If `projects` is empty, render 3 placeholder cards.
- Certifications: `.grid.grid--3.certs > .cert-group > h3.cert-group__title + p.cert-group__issuer + ul.cert-list > li.cert (.cert__name, .cert__date)`.
- Contact: `.contact-card > p.contact-card__text + .contact-card__actions (a.btn for email [primary], LinkedIn, GitHub if set, CV download) + p.contact-card__email > a.link` (mailto).
- `footer.site-footer > .container > p.site-footer__text` (`[data-year]`, `[data-name]` filled by main.js).
- Icons: inline SVGs (stroke, 24×24, `currentColor`, `aria-hidden`) owned by main.js for keys `team data ai quality code` plus `mail linkedin github download external sun moon menu close`.
- Styling ownership: `base.css` = display, positioning, grids, gaps *between* components, section padding, breakpoints (640 / 896 / 1024px); `theme.css` = colour, typography, borders, radii, shadows, motion and spacing *inside* components (card, timeline rail/indent, cert rows, stat tick…). See `design/DESIGN.md` §7.

## Key flows
1. Recruiter lands → hero shows name, role, availability, “Download CV” + “Contact me” CTAs, key stats.
2. Scrolls / uses sticky nav → expertise → experience timeline → projects → certifications → contact.
3. Javier adds a project: append an object to `projects` in `content/content.js`, optional image in `assets/img/projects/`.

## Quality bar
- Responsive 360px → 1440px, no horizontal scroll; mobile menu works.
- Accessible: semantic landmarks, one `h1`, skip link, visible focus, AA contrast in both themes, `prefers-reduced-motion` honoured, all icons `aria-hidden` with text labels.
- SEO: `<title>`, meta description, Open Graph/Twitter tags, JSON-LD `Person` in `index.html`; `<noscript>` fallback with name, role and CV link.
- No console errors; Lighthouse-friendly (no blocking JS beyond the two small scripts).

## Definition of done (MVP)
`python3 -m http.server 8080` → `http://localhost:8080` renders every section from `content.js` with the design tokens/theme applied in light and dark, mobile + desktop, no console errors, and the reviewer's report (`docs/REVIEW.md`) has no open blocking issues.
