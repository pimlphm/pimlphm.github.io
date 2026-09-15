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

The repository's GitHub Pages workflow is scheduled every Monday at 10:17 Asia/Shanghai time (GitHub may delay scheduled jobs). It attempts to refresh the approved Google Scholar snapshot, validates all metrics and known record IDs, records the result in `data/scholar.json`, then rebuilds and deploys the site. Recovery runs on Tuesday and Wednesday at 14:47 only request Scholar when this week's verification is still missing. This mechanism runs on GitHub and does not depend on a local computer.

If Scholar returns a block page, an unexpected record set or invalid metrics, the workflow preserves the last verified snapshot and records the failed attempt. The page and Actions summary distinguish a failed verification from a successful deployment. A manual `workflow_dispatch` exercises the same refresh path, including a fresh request even if this week already has verified data.

The build exports the verified snapshot to `/data/scholar.json`. The page requests this file without browser caching when it opens, becomes visible again, and every five minutes while visible. All impact counts share this data, so an open or cached page can receive the latest published snapshot. These requests read the site's data; Google Scholar itself is still checked weekly. Invalid, unrelated or older responses do not replace the displayed snapshot.

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

## PYRENEES laboratory

The English homepage includes the owner-supplied PYRENEES development plan: **Prognostics and cYber-physical Resilience Engineering Nexus for Equipment and System Safety**. Research directions, proposed equipment, the 30 m² area allocation, facilities, sensing and milestones are described as planned facilities, not confirmed installations. The laboratory is linked from the main navigation and profile area at `/#pyrenees`.

## Content provenance

Publication metadata links to publisher or repository records. Full-text links are limited to open or author-shared copies. Research figures are drawn from the author's published work.
