# CLAUDE.md

Stack: static HTML + CSS custom properties + vanilla JS. No build, no npm deps.

Run locally: `python3 -m http.server 8080` → http://localhost:8080
Check content data: `node -e "global.window={};require('./content/content.js');console.log(Object.keys(window.SITE_CONTENT))"`

Conventions
- Three layers, one owner each: content (`content/`), design (`design/`), structure/behaviour (`index.html`, `assets/`). They meet only via the contracts in `docs/SPEC.md`.
- All paths relative (no leading `/`) — must work on GitHub Pages under a sub-path.
- `base.css` uses tokens only (no raw colors); colors/fonts live in `design/tokens.css`.
- Content is plain text in `content/content.js`; the renderer escapes it. Never put HTML in content.
- New projects: append to `projects` in `content/content.js`; images in `assets/img/projects/`.
- Never publish the phone number.

Docs: `docs/SPEC.md` (contracts), `docs/PLAN.md` (tasks/status), `filemap.md` (file index — update when adding/moving files).
