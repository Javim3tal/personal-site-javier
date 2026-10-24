# Plan

Tasks 1–3 run in parallel (each owns its own files, see SPEC "Architecture"); task 4 waits for all three. Orchestrator does final acceptance after 4.

## 1. Content — savvy-medium — deps: none — status: done
Write `content/content.js` per SPEC Contract 1 from `docs/cv.txt`, plus `content/CONTENT_NOTES.md`. Recruiter-oriented copy: outcome-led, concise, scannable, first person avoided in headings, no invented facts or metrics. Email `javier_ortiz_borrego@hotmail.com`, LinkedIn `https://www.linkedin.com/in/javier-ortiz-borrego-5a994329`, github `""`, no phone. `projects`: 3 `placeholder` entries suggesting the kind of work to come (Data/AI). Verify: `node -e` loads the file and checks every key/shape in the contract.

## 2. Design proposal — savvy-heavy (Fable unavailable: no usage credits) — deps: none — status: done
Write `design/DESIGN.md`, `design/tokens.css`, `design/theme.css`, `design/styleguide.html` per SPEC Contracts 2–3. Modern, credible, recruiter-friendly "senior Data & AI leader" look; light + dark. Verify: styleguide opens standalone and shows every token and contract component in both themes.

## 3. HTML prototype — savvy-careful — deps: none — status: done
Write `index.html`, `assets/css/base.css`, `assets/js/main.js`, `assets/img/favicon.svg` per SPEC Contract 3, rendering from `window.SITE_CONTENT` (Contract 1) and styled only through tokens (Contract 2). Verify against a temporary fixture kept outside the repo.

## 4. Whole-project review — savvy-heavy — deps: 1, 2, 3 — status: done
Integrate-and-review: serve on localhost, check every SPEC requirement and contract across the three layers, fix integration defects, write `docs/REVIEW.md`.
