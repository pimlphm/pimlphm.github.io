# Publication upload folder

Each published output lives in one folder whose name matches the `id` in its `publication.json` file:

```text
content/publications/2026-example-paper/
  publication.json
  paper.pdf
  figure-01.png
```

Copy `_template/publication.example.json` into the new folder and complete every required English field. A push to `main` validates the metadata, checks IDs/DOIs/titles and uploaded-file hashes for duplicates, rebuilds the English site, and redeploys GitHub Pages. The first uploaded figure becomes the year-archive card image; the PDF receives a download link automatically.

Only upload final published material that you have the right to share. This is a public repository, so a committed file is public even if validation later stops deployment. Unsupported files, unsafe paths, non-HTTPS links, missing English fields, unconfirmed rights, or non-published status fail closed.
