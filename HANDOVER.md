# Handover: Dynatrace "Option B" navigation prototype

## Project
- **Repo:** GitHub `floortner/reducetothemax`. It's a static site: `site/` holds the mantras page for reducetothemax.com (see `CLAUDE.md`).
- **Deploy:** the GitHub Action validates `mantras.json` on every PR. A push to `main` starts the FTPS deploy, which waits for manual approval in the `production` environment. `main` is protected, so changes go through a branch and PR, and the `validate` check must pass before merging. Workflow used: `git checkout -b <branch>`, commit, `git push -u origin <branch>`, `gh pr create --base main`, then `gh pr merge <n> --merge`.
- **Screenshots:** `dynatrace-explore-apps-screenshots/` holds about 59 Dynatrace product screenshots and `dynatrace-app-icons/` (app icons, nav SVGs, logos). It's the source material for the analysis and the icons embedded in the prototype. It lives at the repo root and is not published (only `site/` is deployed).

## What was built
- **Deliverable:** `site/new/index.html`, a single self-contained file of about 560 KB (CSS and JS inline, no external requests, icons as data URIs). It's served at `/new/` after deploy.
- **Origin:** I analysed the screenshots and proposed two groupings to reduce the number of apps: **Option A** (aggressive, few apps and tabs) and **Option B** (relaxed). Only Option B is implemented. The original analysis is captured below.
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

## Original analysis (from the screenshots)
Four patterns drove both groupings:
- **Same list, six tabs.** Dashboards, Notebooks and Workflows each split one document list into All, Favorites, Owned, Shared, Ready-made and Trash. These are filters, not tabs.
- **One explorer built six times.** Infrastructure, Kubernetes, Clouds, Services, Synthetic monitors and Experience Vitals all use a type tree or facets plus a Health/Utilization/Metadata table.
- **Overview tabs carry little content.** On Clouds, Services, Synthetic, Experience Vitals and Discovery & Coverage they are mostly promo, onboarding or numbers repeated from other tabs.
- **Some apps only launch other apps.** Smartscape, QuickStart and Business Events show no data of their own.

Both options group by user job instead of by product. Both also move Fleet, Coverage and Private locations to Admin (setup work, not daily use). Alert setup was split across Infrastructure Alert templates, K8s Recommendations and Problems, and consolidating it was called the best single UX win.

### Option A: aggressive (22 apps → 6, about 10 tabs)

| App | Tabs | Absorbs |
|---|---|---|
| **Home** | none | QuickStart, Smartscape launcher, Business Events landing, every Overview tab |
| **Explore** | Entities, Telemetry | Infra, K8s, Clouds, Services, Synthetic, Experience Vitals, Smartscape as a Map toggle, Logs, Traces, Business events |
| **Issues** | Problems, Security, Recommendations | Problems, Vulnerabilities (Prioritization and Findings become a grouping toggle), Discovery findings, K8s Recommendations |
| **Library** | none (one list with type and filter chips) | Dashboards, Notebooks, Investigations |
| **Automate** | Workflows, Executions, Guardians | Workflows, Site Reliability Guardian |
| **Admin** | left nav, not tabs | Hub, Settings, Fleet Management, Coverage, Private locations, Cloud connections |

- **Entities** is one type tree (Hosts, Clusters, Cloud, Services, Synthetic, Frontends).
- **Telemetry** is a signal switch for Logs, Traces and Events. Live logs and Exceptions become toggles, and Failures and Response Time become saved views.
- **Why:** a user thinks "what's broken?" (Issues), "show me the thing" (Explore), "keep my analysis" (Library), "automate it" (Automate) or "configure it" (Admin). Nobody thinks "open the Kubernetes app."
- **Risk:** Explore carries a lot, so the type tree has to scale well.
- **Suggested start:** the Library and Automate merges are the lowest risk. Decide between A and B for Explore using real tab-usage telemetry, since the screenshots show layout, not usage.

### Option B: relaxed on tabs (22 apps → 8, about 30 tabs), as first proposed
Home (Overview, Topology, Business); Infrastructure (Hosts & Network, Kubernetes, Clouds, Alert templates); Applications (Services, Failures, Response Time, Synthetic, Frontends); Telemetry (Logs, Live logs, Traces, Exceptions, Business events); Issues & Security (Problems, Vulnerabilities, Investigations, Recommendations); Library (Dashboards, Notebooks, one shared filter bar); Automate (Workflows, Executions, Guardians); Admin (Coverage, Fleet, Apps, Settings). The prototype has since evolved well beyond this (see the tab list above).

### Mapping Option A onto the current prototype
- **Home:** the Overview tab exists. The Business tab and QuickStart would fold into it.
- **Explore (Entities):** this is Hosts, Network, Clouds, Kubernetes, Synthetic, Services, Errors, Response time and Frontends. All use the same table engine, so a type tree plus one table needs only a new top-level view over the existing row arrays (`HOSTS_ONLY`, `NETDEV`, `K8S`, `SYNTH`, `SERVICES`, `FRONT`).
- **Explore (Telemetry):** Logs, Traces, Metrics, Events, User sessions and AI would become a signal switch.
- **Smartscape:** already a view picker. As a Map toggle it would reuse `renderSmartscape` and the zoom, pan and mini map code.
- **Issues:** Problems, Vulnerabilities (with its Prioritization/Findings `modes`), SIEM, User audits, Detections and Recommendations.
- **Library:** Dashboards, Notebooks, Pages, Launchpads and Investigations, which already share one document list pattern (`DOC_SCOPES`, user documents via the "+" tab).
- **Admin:** Coverage, Fleet, Hub, Access requests, Settings.
- **Existing glue to keep:** `related` links, the `DQL` and `XV` maps, drawers, hash detail routes and the SLO, Synthetic and Security data. Rewrite the `APPS` structure, `renderRail`, link targets and copy.

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
