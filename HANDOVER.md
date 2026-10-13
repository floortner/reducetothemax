# Handover: Dynatrace "Option B" navigation prototype

## Project
- **Repo:** GitHub `floortner/reducetothemax`. It's a static site: `site/` holds the mantras page for reducetothemax.com (see `CLAUDE.md`).
- **Deploy:** the GitHub Action validates `mantras.json` on every PR. A push to `main` starts the FTPS deploy, which waits for manual approval in the `production` environment. `main` is protected, so changes go through a branch and PR, and the `validate` check must pass before merging. Workflow used: `git checkout -b <branch>`, commit, `git push -u origin <branch>`, `gh pr create --base main`, then `gh pr merge <n> --merge`.
- **Screenshots:** `dynatrace-explore-apps-screenshots/` holds about 59 Dynatrace product screenshots and `dynatrace-app-icons/` (app icons, nav SVGs, logos). It's the source material for the analysis and the icons embedded in the prototype. It lives at the repo root and is not published (only `site/` is deployed).

## What was built
- **Deliverable:** `site/new/index.html`, a single self-contained file of about 560 KB (CSS and JS inline, no external requests, icons as data URIs). It's served at `/new/` after deploy.
- **Origin:** I analysed the screenshots and proposed two groupings to reduce the number of apps: **Option A** (aggressive, few apps and tabs) and **Option B** (relaxed). Only Option B is implemented. The original analysis text exists only in the Claude transcript on the old machine.
- **Menu order (hard-coded in `renderRail`):** Home | Search, Assist, Recents | Problems, Smartscape, Infrastructure, Applications, Telemetry, Security | Documents, Automate, QuickStart, Admin | pinned view | Collapse.
- **Tabs:**
  - Home: Overview, Business (industry dashboard templates)
  - Problems: Problems, Investigations, Recommendations
  - Smartscape: 10 views in a top-bar picker, no tabs
  - Infrastructure: Hosts, Network, Clouds, Kubernetes, Synthetic, SLOs, Alert templates
  - Applications: Services, Errors, Response time, Frontends, Feature flags, Alert templates
  - Telemetry: Logs, Metrics, Traces, User sessions, Events, AI
  - Security: Vulnerabilities, SIEM (MITRE ATT&CK matrix), User audits, Detections, Alert templates
  - Documents: Dashboards, Notebooks, Pages, Launchpads
  - Automate: Workflows, Executions, Guardians
  - Admin: Coverage, Fleet, Hub, Access requests, Settings
  - QuickStart: one page
  - Every app also has a "+" tab for user-created documents, saved in the browser.

## Architecture (all in `site/new/index.html`)
- **Structure:**
  - The global `APPS` array holds apps and tabs.
  - A tab uses the generic table engine (`renderTable`, `updateAll`, `updateGrid`, `filtered`, with facets, saved views, a drawer and `related` links) or a custom `render` function.
  - `scopeBar` builds the top bar: segment, search, extras, Explain, DQL, timeframe.
  - Detail pages (investigations, feature flags) use hash URLs of the form `#/app/tab/id`; `render()` derives `invOpen` and `flagOpen` from them.
- **Cross-linking:** `go`, `goSpec`/`stepGo` and the `DQL` map (the `dtctl` command is derived from it) tie views together. The `XV` map holds Explain text, and Explain opens in the docked Assist panel through `explainToAssist`. `entityTarget`/`goEntity` route an entity name to the right app.
- **Themes and storage:** the themes are system, light, dark, midnight, terminal, contrast and bluebox, set by a `data-theme` attribute. `localStorage` keys are `dtproto_theme`, `dtproto_docs`, `dtproto_views`, `dtproto_dets`, `dtproto_flags` and `dtproto_assist_mode`.
- **Data:** all mock. The pieces with real behaviour are the SLOs, feature flags, detections (linked to the SIEM matrix), investigations, and the Smartscape viewport (zoom, pan, mini map).

## Working method and pitfalls
- **Edits:** I used Python patch scripts with exact-string replacements that assert a single match, and kept backups. For a quick syntax check, extract the last `<script>` and run `node --check`.
- **Browser checks:** I used Chrome DevTools MCP. A file URL works for most checks, but `fetch` on the page needs an HTTP server (`python3 -m http.server` in `site/`). My standard check loops every `APPS`/`visibleTabs` route in each theme, asserts the body isn't empty, and watches for console errors. A second check asserts every `go()`/`goSpec` target resolves to a real tab id.
- **Data and load order:**
  - Data constants must be defined before `const APPS=[`.
  - Don't add `rnd()` calls early, or every later mock value changes. Use a hash like `flh`/`hr` instead.
  - Add new CSS before the final `@media (max-width:900px)` rule.

## Decisions and known gaps
- **Kept as designed:**
  - The Detections tab stays a list with a side form.
  - The SIEM technique panel stays inline beside the matrix.
  - Access requests has no drawer, because its approve and deny buttons sit in the row.
- **Not done:**
  - The custom search boxes now filter, but not every card-like component shares one style.
  - There are a few different "stat" tile layouts (`.kpi`, `.tile`, `.sx-kpi`).
- **Preferences:** replies should be very short, and look up library docs before using them. Wording is sentence case, with "Open" for navigation, "Show" for a filtered list and "Create" for a new object. Red badges stay red (square for Security and SLOs, round for Problems). The Dynatrace logo wordmark is lowercase.

## For revised Option A
Reuse these pieces: the `APPS` definition, the table engine, the `related`, `DQL` and `XV` maps, the drawer and detail routes, and the SLO, Synthetic and Security data models. The fewer-apps grouping is mostly a change to the `APPS` structure, `renderRail`, the link targets and the copy. Run the route sweep and the link-target check after regrouping.
