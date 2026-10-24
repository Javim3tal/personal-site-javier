# Content notes

Source: `docs/cv.txt`. Data shape: `docs/SPEC.md` Contract 1. All strings are plain text.

## Tone
- Recruiter-first: role, years and scope visible in the hero; outcomes before tools.
- No first person in headings or highlights; bullets start with a past-tense verb (all listed roles have ended).
- Concise and scannable: highlights kept to one line where possible; tool lists grouped, not repeated.
- No invented facts or metrics. Every number in `stats` comes straight from the CV: 26+ years, 3 concurrent product lines, 10 Anthropic certifications (counted from the CV list).

## How the hero uses this data
- `person.name` is the page's h1 (recruiters see the name first); `hero.eyebrow` sits above it and `hero.headline` renders as the tagline under the name, then `hero.lead`.

## Condensed or left out
- Phone number: omitted everywhere (public page).
- Ciklum Project Development Manager: CV says "the same responsibilities" as the JLL role; rewritten as standalone bullets so it reads without the JLL context.
- Azure service names shortened after the first "Azure" mention (e.g. "Azure SQL, Tables, Data Lake").
- Earlier experience (2000–2017) kept as one-line summaries; detail lives in the downloadable CV.
- `github` and `meta.ogImage` are empty until available.
- Projects are three `placeholder` cards indicating planned Data/AI and agentic work; titles are intentions, not claims.

## How to add a project
Append an object to `projects` in `content/content.js` (optional image in `assets/img/projects/`). Replace or remove a placeholder when real work exists.

```js
{
  title: "Agentic release-notes generator",
  summary: "Agent that drafts release notes from merged pull requests and tickets.",
  tags: ["AI", "Claude Agent SDK", "TypeScript"],
  status: "live",                       // "live" | "wip" | "placeholder"
  links: {
    demo: "https://example.com/demo",   // full URL or ""
    repo: "https://github.com/...",     // full URL or ""
    writeup: ""                         // full URL or ""
  },
  image: "assets/img/projects/release-notes.png"  // relative path or ""
}
```
