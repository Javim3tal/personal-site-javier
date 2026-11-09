# CLAUDE.md

Stack: static HTML + CSS custom properties + vanilla JS. No build, no npm deps for the site (Playwright lives only in `tests/`).

Run locally: `python3 -m http.server 8080` → http://localhost:8080
Check content data: `node .github/scripts/check-content.js` · HTML: `npx --yes html-validate@11.17.0 index.html`
E2E: `cd tests && npm ci && npx playwright install && npx playwright test` (serves the repo on :4173; `BASE_URL=https://… npx playwright test` targets a deployed site). Run it after any change to `index.html`, `assets/`, `design/` or the content shape.
Deploy: push to `main` → `.github/workflows/deploy.yml` runs the checks + e2e and deploys to Pages only if they pass.

Conventions
- Three layers, one owner each: content (`content/`), design (`design/`), structure/behaviour (`index.html`, `assets/`). They meet only via the contracts in `docs/SPEC.md`.
- All paths relative (no leading `/`) — must work on GitHub Pages under a sub-path.
- `base.css` uses tokens only (no raw colors); colors/fonts live in `design/tokens.css`.
- Content is plain text in `content/content.js`; the renderer escapes it. Never put HTML in content.
- New projects: append to `projects` in `content/content.js`; images in `assets/img/projects/`.
- Never publish the phone number.

Docs: `docs/SPEC.md` (contracts), `docs/PLAN.md` (tasks/status), `filemap.md` (file index — update when adding/moving files).
