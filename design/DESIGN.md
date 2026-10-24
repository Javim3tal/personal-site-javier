# Design proposal: "Calm signal"

Files: `tokens.css` (Contract 2 tokens + fonts, light/dark), `theme.css` (skin on Contract 3 classes), `styleguide.html` (open via `python3 -m http.server` → `/design/styleguide.html`; it has a System / Light / Dark switch and a live contrast table).

## 1. Concept

A senior Data & AI engineering leader should read as **confident, calm and precise**, not as a flashy developer portfolio.

- **Paper and ink.** A warm off-white page with near-black navy text in light mode, and deep ink-navy with soft white text in dark mode. Neutral, editorial, easy on recruiters' eyes.
- **One signal colour.** A petrol teal carries every interactive or "important" cue: primary CTA, links, eyebrows, the active nav item, timeline nodes and the stat ticks. Nothing else competes with it.
- **A data voice.** JetBrains Mono is used only for small "metadata" text: eyebrows, dates, tags, hero meta and section numbers (`01 | ABOUT`). It hints at data and engineering without turning the page into a terminal.
- **Data-flow motif.** In the hero, faint flow lines run from many sources into one hub and then out to three consumers. It mirrors Javier's career in data integration and enterprise data flow. It sits on a faint engineering grid with soft glows, and everything fades into the page so the next section joins seamlessly.

## 2. Palette

All values are solid hex, so they are easy to audit. Ratios use WCAG 2.x relative luminance; `styleguide.html` recomputes them live from the active theme.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-bg` | `#F8F7F4` | `#0B111C` | page |
| `--color-bg-alt` | `#F1EFEA` | `#0E1522` | alternate band (#expertise, #projects) |
| `--color-surface` | `#FFFFFF` | `#121A27` | cards |
| `--color-surface-2` | `#EEEDE7` | `#1A2331` | tags, media wells, hover fill |
| `--color-text` | `#0F1A2A` | `#E7EBF0` | headings, body |
| `--color-text-muted` | `#4D5767` | `#9AA5B4` | leads, secondary text |
| `--color-border` | `#E2E0D9` | `#243042` | hairlines (decorative) |
| `--color-border-strong` | `#8C8A83` | `#5F6B7D` | ≥3:1 boundaries: ghost button, dashed placeholder |
| `--color-accent` | `#0B6E69` | `#3CCFBF` | the signal |
| `--color-accent-hover` | `#085753` | `#6EDDD0` | hover / pressed accent |
| `--color-accent-contrast` | `#FFFFFF` | `#04211E` | text on accent |
| `--color-accent-soft` | `#DDEFEB` | `#11302F` | icon tiles, ghost hover |
| `--color-accent-line` | `#A8D2CB` | `#1F5753` | decorative accent borders, timeline rail |
| `--color-focus` | `#0B6E69` | `#6EDDD0` | focus ring |
| `--color-success` | `#15803D` | `#4ADE80` | availability dot |

Extra tokens: `--color-success-ring`, `--color-selection`, `--color-header-bg` / `--color-header-border` (translucent header), `--color-grid`, `--color-glow-1/2`, `--hero-flow`.

### Contrast (checked)

| Pair (fg / bg) | Light | Dark | Need |
|---|---|---|---|
| text / bg | 16.31 | 15.78 | 4.5 |
| text / surface | 17.48 | 14.58 | 4.5 |
| text-muted / bg | 6.82 | 7.57 | 4.5 |
| text-muted / bg-alt | 6.36 | 7.32 | 4.5 |
| text-muted / surface-2 (tags) | 6.23 | 6.33 | 4.5 |
| accent / bg | 5.68 | 9.78 | 4.5 |
| accent / surface | 6.09 | 9.04 | 4.5 |
| accent / accent-soft | 5.11 | 7.31 | 4.5 |
| accent-hover / accent-soft (ghost hover) | 7.05 | 8.68 | 4.5 |
| **accent-contrast / accent** (primary button) | 6.09 | 8.76 | 4.5 |
| accent-contrast / accent-hover | 8.41 | 10.40 | 4.5 |
| border-strong / bg (UI) | 3.22 | 3.50 | 3.0 |
| focus / bg (UI) | 5.68 | 11.62 | 3.0 |
| success / bg (UI) | 4.68 | 10.85 | 3.0 |

Every pair passes AA in both themes. The accent also passes as normal-size text, so links and eyebrows need no size exemption.

## 3. Typography

- **Manrope** (variable 400–700) for display and body. It is modern and slightly geometric, credible without being sterile. **JetBrains Mono** (400, 500) is for metadata only. Both load from Google Fonts with `display=swap` through the `@import` at the top of `tokens.css`. Fallbacks are system UI and system mono stacks.
- Fluid scale with `clamp()`, interpolated between 360 px and 1440 px. It is rem-based, so it respects zoom.

| Token | px (360 → 1440) | Use |
|---|---|---|
| `--fs-display` | 40 → 76 | hero h1 (line-height 1.04, tracking −0.035em) |
| `--fs-3xl` | 30 → 44 | section titles, stat values |
| `--fs-2xl` | 24 → 32 | contact heading |
| `--fs-xl` | 20 → 24 | card, project and company titles |
| `--fs-lg` | 18 → 20 | leads, role titles, cert-group titles |
| `--fs-base` | 16 → 17 | body |
| `--fs-sm` | 14 → 15 | buttons, nav, lists, certs |
| `--fs-xs` | 12 → 13 | mono eyebrows, dates, tags |

- Line heights: `--lh-tight` 1.1 (headings), `--lh-snug` 1.3, `--lh-body` 1.65. Weights: 400 / 500 / 600 (`--fw-semibold`, extra) / 700.
- Headings use `text-wrap: balance` and paragraphs use `pretty`. Recommended measure: `--measure` (62ch) for leads and paragraphs. The hero h1 reads best at about 18–20ch.
- Eyebrows are mono, xs, uppercase, +0.08em tracking, in accent. Section eyebrows get an automatic `01 |` number from a CSS counter on `.section`.

## 4. Space and shape

- Space: `--space-1…6` = 4, 8, 12, 16, 24, 32 px. `--space-7…10` are fluid: 40→48, 48→64, 64→96, 80→128.
- Radii: `--radius-sm` 6 px, `--radius-md` 10 px (icon tiles, media, earlier roles, icon buttons), `--radius-lg` 16 px (cards, contact card), `--radius-pill` (buttons, tags).
- Shadows are soft and low (`--shadow-sm` at rest, `--shadow-md` on hover / contact card, `--shadow-lg` for the mobile menu panel). In dark mode, hairline borders carry most of the separation.
- Layout tokens: `--container-max` 72rem (1152 px), `--container-pad` 16→32 px gutter (exactly 16 px at 360–375 px), `--header-h` 4rem, `--card-pad` 20→32 px, `--timeline-dot`, `--timeline-gutter`.

## 5. Motion

- `--ease` (standard) and `--ease-out` (reveal, pulse). `--duration-fast` 150 ms (colour changes), `--duration` 280 ms (shadows, theme switch), `--duration-slow` 700 ms (reveal).
- **Reveal:** `.reveal` fades up 1.5rem and becomes visible with `.is-visible`. It is hidden only under `(prefers-reduced-motion: no-preference) and (scripting: enabled)`, so with no JS, reduced motion or an old browser the content simply shows. Optional per-element `--reveal-delay` lets elements stagger.
- **Status dot:** a gentle 2.4 s pulse ring that stays a static halo under reduced motion.
- **Hover:** colour, border and shadow only. There are no lifts or scale effects; the only transform is a 1 px press on `.btn:active`. Fill/border hovers are gated by `@media (hover: hover)` so they don't stick after a tap on touch screens.
- A `prefers-reduced-motion: reduce` safety net stops all transitions and animations and disables smooth scrolling.

## 6. Components (what theme.css does)

- **Header:** translucent `--color-header-bg` with a blur and a hairline bottom border. When `.is-open` it turns opaque and drops the blur. `.brand` gets a small accent "data node" dot. `.nav__link` is muted; hover shows text colour, and `.is-active` / `[aria-current]` shows text colour plus a 2 px accent underline. `.theme-toggle` and `.nav-toggle` are 44 px outlined icon buttons.
- **Hero:** `background-image: var(--hero-flow), var(--gradient-hero)`. Up to 70rem the motif moves up into the hero's top padding (below that width the 40rem lead column would otherwise reach the hub). `.hero__eyebrow` is mono accent with a short leading rule. `h1.hero__title` is the person's name (`--fs-display`); `.hero__tagline` (the content headline) is a display subheading one clear step below it: `--fs-2xl`, semibold, ink, `--lh-snug`. `.hero__meta` is mono xs muted. `.stat` has a hairline top border with a 2rem accent tick; `.stat__value` is 3xl bold tabular, `.stat__label` sm muted.
- **Buttons:** pill-shaped, 46 px min height, semibold sm. `.btn--primary` uses an accent fill. `.btn--ghost` is transparent with `--color-border-strong`, and on hover fills with `accent-soft`. A bare `.btn` is a surface button. Icons are 1.125em. Labels may wrap; `overflow-wrap: anywhere` keeps a long email on one screen.
- **Tags:** mono xs pills on `surface-2`. `.tags` is a wrapping flex row.
- **Card:** surface, hairline border, `--radius-lg`, `--card-pad`. The hover border turns accent-line. `.card__icon` is a 44 px accent-soft tile. `.card__list` sits under a divider and uses accent dash markers.
- **Timeline:** a 2 px rail with a gradient from accent-line to border, connecting 14 px nodes. The first (most recent) node is filled with a soft halo. Company is xl bold, role title lg semibold, dates are mono xs uppercase muted, and highlights are muted with accent dashes. Several roles at one company are split by a dashed hairline. `.earlier__item` is a compact bordered card, and its first child is emphasised.
- **Project card:** a flex column. Media is full-bleed 16:9 over a faint grid well, and `.project-card__links` is pinned to the bottom. `data-status="placeholder"` gives a dashed `border-strong` outline, no fill, a faint diagonal hatch. The mono status pill is `.project-card__status`, real text rendered by main.js ("Coming soon" for placeholder, "In progress" for wip — the wip pill is accent-tinted; live cards have none).
- **Certifications:** `.cert-group` is a bordered surface card with the title over a divider. `.cert` is a row with the name on the left and a mono tabular date on the right, separated by hairlines.
- **Contact card:** surface with a soft accent-soft glow from the top-right corner, `--shadow-md` and generous fluid padding.
- **Prototype extras (styled after integration):** `.about__text` (fs-lg; first paragraph ink, the rest muted), `.timeline__location` (sm muted, next to the company), `.earlier__heading` (xl h3), `.earlier__company` / `.earlier__dates` (mono xs uppercase) / `.earlier__summary`, `.cert-group__issuer` (mono xs uppercase under the title; the divider moves below it), `.contact-card__text` (fs-lg ink, `--measure`) and `.contact-card__email` (sm muted). `.section__head` and `.icon` are structural only (base.css).
- **Footer:** hairline top border, sm muted text and underlined links.

## 7. Ownership boundary (theme.css vs base.css)

`theme.css` loads last, so these rules are deliberate:

- **theme.css sets:** colour, typography, borders, radii and shadows, plus **component-internal spacing**: padding inside btn, tag, card, project-card, cert-group, contact-card and earlier__item, and the small top margins inside the heading block (`.section__title`, `.section__lead`, `.hero__title`, `.hero__lead`) and inside cards and timeline roles. It also sets the timeline item's `padding-inline-start` / `padding-block-end`, which keep the rail continuous, and `display` on `.btn`, `.tag`, `.tags`, `.card__icon`, `.project-card` and `.cert`.
- **theme.css never sets:** `display` or positioning on `.site-header`, `.nav`, `.nav__link`, `.nav-toggle` or `.theme-toggle`. Container width, section padding, grids, gaps between components and breakpoints are also left out. The one media query is for the hero motif's background position only.
- **base.css should:**
  - set `display: inline-flex` on `.theme-toggle` / `.nav-toggle` and hide `.nav-toggle` on wide screens;
  - make the header sticky;
  - add `scroll-padding-top: var(--header-h)` on `html`;
  - give the mobile nav panel `background: var(--color-bg)`, `border-bottom: 1px solid var(--color-border)` and `box-shadow: var(--shadow-lg)`;
  - not set `background` on `.hero`.

## 8. Section-by-section layout recommendation (for base.css)

- **Header:** `--header-h` tall, sticky at top 0. Brand on the left; nav links on the right with a `--space-6` gap; theme toggle last. Under about 56rem, collapse the nav into a full-width panel below the header: links stacked at `--fs-base`, each with `--space-3` vertical padding. The nav-toggle sits after the theme toggle.
- **Hero (`#home`):** single left-aligned column. Padding is `--space-10` top and `--space-9` bottom; optional min-height around `min(88svh, 52rem)`. Vertical rhythm: eyebrow → h1 name (`--space-5`) → tagline (`--space-4`) → lead (`--space-5`, max 40rem so it stays left of the motif hub) → actions (`--space-7`, flex-wrap, gap `--space-3`) → meta (`--space-6`, flex-wrap, gap `--space-2` / `--space-5`, dot + label inline-flex with gap `--space-2`) → stats (`--space-9`). Stats grid: auto-fit columns of at least 9rem (2 on phones, one row of 3 from tablet), gap `--space-6` / `--space-5`. The motif sits behind the right side, so keep text left.
- **Every section:** `padding-block: var(--space-9)`. Heading block, then content after `--space-7`. Grid gap `--space-5`, rising to `--space-6` on wide screens.
- **About:** from 56rem, two columns: heading block in about 5/12, paragraphs in 7/12 (max `--measure`, gap `--space-4`). Single column on mobile.
- **Expertise (band):** `.grid--3`: 1 column, then 2 from 40rem, then 3 from 64rem. Cards stretch to equal height. Five items give a 3 + 2 layout.
- **Experience:** keep the timeline at max about 48rem (left-aligned, or as the right column of a 4/8 split with a sticky heading from 64rem). "Earlier experience" goes below as an h3 plus `.earlier` in a 2-column grid from 48rem, gap `--space-4`. Keep this section on `--color-bg`, because the timeline nodes are filled with `--color-bg`.
- **Projects (band):** `.grid.projects`: 1 column, then 2 from 40rem, then 3 from 64rem, equal-height cards. Three placeholders show as one dashed row.
- **Certifications:** a grid of `.cert-group`s: 1 column, then 2 from 48rem, then 3 from 64rem, with `align-items: start` (the groups have very different lengths).
- **Contact:** heading block, then `.contact-card` (max about 52rem). Buttons sit in a flex-wrap row with gap `--space-3`, primary (Email) first; under 30rem the buttons go full width.
- **Footer:** container with flex, space-between and wrap, `padding-block: var(--space-6)`.

## 9. Integration notes and open questions

1. **Status label is real DOM text** (resolved in review): main.js renders `.project-card__status` ("Coming soon" / "In progress") and theme.css styles it as the pill. The former `::before` label was removed so it is not shown twice and screen readers announce it.
2. **Section numbers come from CSS** (counter on `.section`; `#home` uses `.hero` and is not counted, so About = 01 … Contact = 06; hidden empty sections are skipped). They are decorative, so the rule uses `content: counter(…) / ""` to keep them out of the accessibility tree. main.js renders only the plain label ("About").
3. **Fonts:** `index.html` preconnects to `https://fonts.googleapis.com` and `https://fonts.gstatic.com` (crossorigin) to shorten the `@import` chain (done).
4. **Header blur:** `backdrop-filter` is dropped while `.is-open` because it would otherwise make the header the containing block of a `position: fixed` mobile panel.
5. **Theme toggle icon:** theme.css does not hide or show the sun and moon icons. main.js should render the right one, and update `aria-label`, `aria-pressed` and `aria-current` on nav links.
6. `.reveal` depends on main.js adding `.is-visible` (IntersectionObserver). If that fails while scripting is enabled, revealed content would stay hidden, so main.js should fall back to adding `.is-visible` to all elements.
