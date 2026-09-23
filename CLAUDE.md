# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single static page for **https://reducetothemax.com** — the five engineering mantras
for Dynatrace R&D. No build step, no framework, no dependencies. The whole site is four
files in `site/`: `index.html` (empty markup shell), `styles.css`, `app.js` (vanilla
renderer), and `mantras.json` (all content).

## Local preview

The page `fetch()`es `mantras.json`, so it must be served over HTTP — opening
`index.html` via `file://` shows a load error. Serve and open http://localhost:8000:

```bash
cd site && python3 -m http.server 8000
```

There is no lint, test, or build command.

## Architecture

- **Content vs. code are fully separated.** To change any copy, edit only `mantras.json`
  — never hardcode text in `app.js` or `index.html`. Strings render as plain text (no
  HTML). `{roleWord}` in `intro` is substituted with the selected role's plural noun.
- **Role-driven rendering.** The page has a role picker (engineer, architect, designer,
  product manager, manager). Each mantra carries a `roles` map keyed by a stable role
  `id`, each with a `do` (green `+` row) and `dont` (red `-` row). Every mantra must have
  an entry for every role `id`, or that role renders a blank line. `app.js` re-renders
  intro + mantras on role change; nothing is server-side.
- **State is per-browser.** Selected role and theme persist in `localStorage`
  (`rttm_role`, `rttm_theme`). Dark theme is the default; `t` or the toggle switches it.
  All `localStorage` access is wrapped in try/catch — keep it that way.
- **Theming** is CSS custom properties on `html[data-theme]`; the light palette overrides
  vars under `html[data-theme="light"]`.

## Deploy

The site is hosted on **world4you** and deployed over **FTPS**. `.github/workflows/deploy.yml`
runs on push to `main`: a `validate` job checks `mantras.json` on every PR, and a `deploy`
job uploads `site/` to the world4you FTP root. The deploy job is gated by the `production`
GitHub Environment, which requires a manual approval (the repo owner) before the upload runs.

FTP connection values are repo secrets — `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` — taken
from the world4you Kundencenter (Webspace → FTP). `server-dir` is `/` (world4you serves the
FTP account root at the domain root). The `site/CNAME` file is a leftover from the old GitHub
Pages setup and is unused by FTP hosting.
