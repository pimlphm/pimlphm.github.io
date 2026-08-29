# Weikun Deng — academic homepage

Personal academic homepage for Weikun Deng (邓炜坤), built as a responsive React site and deployed with GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

The GitHub Pages artifact is produced with:

```bash
npm run build:github
```

## Weekly Scholar refresh

A local scheduled task refreshes the approved Google Scholar snapshot every Monday at 10:17 Asia/Shanghai time, then pushes the validated change so GitHub Pages redeploys it. The job makes one request to the public profile, validates all metrics and known record IDs, updates `data/scholar.json`, and fails without changing the live site if Scholar returns a block page or an unexpected record set.

Run the same validation without changing local data:

```bash
npm run check:scholar
```

The allowlist is intentional: citation counts and links update automatically, while new or non-final profile records require review before they can appear publicly.

## Content provenance

Publication metadata links to publisher or repository records. Full-text links are limited to open or author-shared copies. Research figures are drawn from the author's published work.
