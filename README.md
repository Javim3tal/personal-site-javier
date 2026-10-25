# Javier Ortiz Borrego — personal website

Single-page personal site for Javier Ortiz Borrego, Senior Software Engineering Manager (Data & AI engineering leadership), Málaga, Spain. It covers the profile, expertise, experience timeline, projects, certifications, contact links and a downloadable CV.

Plain HTML, CSS custom properties and vanilla JavaScript. There is no build step, no framework and no npm dependencies. All paths are relative, so the site works at a domain root or under a sub-path such as `user.github.io/repo/`.

## Run locally

```sh
python3 -m http.server 8080
```

Open http://localhost:8080. Any static file server works. Opening `index.html` straight from disk also renders, because the content is a classic script and not a module.

## Where things live

| To change… | Edit |
|---|---|
| Any text, dates, links, stats, projects or certifications | `content/content.js` (plain text only, no HTML) |
| Colours, fonts, spacing tokens, light/dark values | `design/tokens.css` |
| How components look (cards, buttons, timeline…) | `design/theme.css` |
| Page layout, grids, breakpoints | `assets/css/base.css` |
| Rendering, navigation, theme toggle, animations | `assets/js/main.js` |
| `<head>` metadata (title, description, Open Graph, JSON-LD) | `index.html` (keep it in step with `meta` in `content.js`) |
| The downloadable CV | replace `assets/CV_Javier_Ortiz_Borrego.pdf` (keep the file name) |

`docs/SPEC.md` has the contracts between these layers, `filemap.md` indexes every file, and `design/styleguide.html` previews all tokens and components.

Never put the phone number on the site, and that includes the CV PDF. The site is public and gets scraped.

## Add a project

Append an object to the `projects` array in `content/content.js`:

```js
{
  title: "Agentic release-notes generator",
  summary: "Agent that drafts release notes from merged pull requests and tickets.",
  tags: ["AI", "Claude Agent SDK", "TypeScript"],
  status: "live",                       // "live" | "wip" (shows "In progress") | "placeholder" (dashed "Coming soon" card)
  links: {
    demo: "https://example.com/demo",   // full URL or ""
    repo: "https://github.com/...",     // full URL or ""
    writeup: ""                         // full URL or ""
  },
  image: "assets/img/projects/release-notes.png"  // relative path or "" (shown at 16:9)
}
```

Put screenshots in `assets/img/projects/`. Remove a `placeholder` entry once real work replaces it. If the array is empty, the site shows three "Coming soon" cards.

## Deploy to GitHub Pages

The repository is ready to publish as-is. `.nojekyll` is already at the root, so GitHub serves the files untouched.

1. Create a GitHub repository and push this project to its `main` branch:
   - **User site:** name the repository `<user>.github.io`. It is served at `https://<user>.github.io/`.
   - **Project site:** use any name, for example `website`. It is served at `https://<user>.github.io/website/`, and the relative paths make that work.
2. In the repository, go to **Settings → Pages → Build and deployment** and set **Source** to *GitHub Actions*.
3. Every push to `main` runs `.github/workflows/deploy.yml`: it checks `content/content.js` (shape, plain text, files it points to exist), validates `index.html` and checks links, then deploys only if all three pass. Pull requests run the checks without deploying. Watch it in the **Actions** tab.

Run the same checks locally before pushing:

```
node .github/scripts/check-content.js
npx --yes html-validate@11.17.0 index.html
```

Optional, once the final URL is known: add `<link rel="canonical">` and `og:url` to `index.html`. For a share preview with an image, set `meta.ogImage` in `content.js` (a 1200×630 image in `assets/img/`) and add the matching `og:image` tag to `index.html`, because link-preview crawlers do not run JavaScript.
