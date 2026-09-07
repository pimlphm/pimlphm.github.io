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

## Language

The homepage is published in English at `/`. Run `npm run test:site` to validate the English entry, metadata, project archive and publication catalogue.

## Weekly Scholar refresh

The repository's GitHub Pages workflow runs every Monday at 10:17 Asia/Shanghai time. It attempts to refresh the approved Google Scholar snapshot, validates all metrics and known record IDs, updates and commits `data/scholar.json` when a verification succeeds, then rebuilds and deploys the site in the same run. This mechanism runs on GitHub and does not depend on a local computer or a Codex task.

If Scholar returns a block page, an unexpected record set or invalid metrics, the workflow preserves the last verified snapshot and still completes that week's GitHub Pages deployment. It never publishes unverified citation metrics. A manual `workflow_dispatch` exercises the same end-to-end refresh path.

Run the same validation without changing local data:

```bash
npm run check:scholar
```

The allowlist is intentional: citation counts and links update automatically, while a new Scholar record appears only after its uploaded `publication.json` explicitly supplies the matching `scholarId`. Duplicate and non-final records remain excluded.

## Upload a published article

Create a folder under `content/publications/` from the included English template, then add the published PDF and an optional article figure. Pushing that folder to `main` activates the repository workflow, validates rights, metadata and DOI/title/file duplicates, then adds a valid record automatically to the publication list and year-grouped project archive before GitHub Pages redeploys.

Run the same validation locally:

```bash
npm run content:check
```

A bare PDF is intentionally not published automatically because it cannot reliably establish publication status, sharing rights or the canonical record. See `content/publications/README.md` for the upload format.

## Content provenance

Publication metadata links to publisher or repository records. Full-text links are limited to open or author-shared copies. Research figures are drawn from the author's published work.
