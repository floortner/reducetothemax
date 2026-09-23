# reduce to the max

The five engineering mantras for Dynatrace R&D, as a small static site. Live at
**https://reducetothemax.com**.

## Editing content

All copy lives in [`mantras.json`](./mantras.json) — nothing else needs to change to
update text.

- **intro** — the paragraph under the role picker. Use `{roleWord}` where the selected
  role's plural noun should appear (e.g. "engineers").
- **signature** — the credit line at the bottom.
- **roles** — the picker chips. Each has an `id` (stable key used everywhere else), a
  `label` (what's shown on the chip) and a `word` (plural noun for the intro).
- **mantras** — ordered list. Each has `num`, `title`, `sub`, and a `roles` map keyed by
  role `id`, each with a `do` and a `dont`.

Rules of thumb:
- Every mantra must have an entry for every role `id`, or that role shows a blank line.
- Keep it valid JSON — trailing commas will break the page. Most editors flag this.
- No HTML in the strings; they're rendered as plain text.

## Local preview

The page fetches `mantras.json`, so it must be served over HTTP — opening `index.html`
directly (`file://`) will show a load error. Any static server works:

```bash
cd site
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy

`index.html`, `styles.css`, `app.js` and `mantras.json` are the whole site — no build
step. It's hosted on **world4you** and deployed over **FTPS** by
[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml): open a PR (a validation
check runs), merge to `main`, then approve the `production` deployment to upload `site/`.

Deploy needs three repo secrets from the world4you Kundencenter (Webspace → FTP):
`FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`. Any static host works too — the four `site/`
files are self-contained.

## Structure

```
site/
  index.html     markup shell (no content)
  styles.css     all styling + light/dark themes
  app.js         vanilla renderer (no framework, no dependencies)
  mantras.json   ← edit this
  CNAME          custom domain for GitHub Pages
```

## Notes

- Dark theme is the default; press **t** or click the toggle to switch. The choice and
  the selected role are remembered per browser (localStorage).
- The only external dependency is the JetBrains Mono webfont from Google Fonts. To make
  the page fully self-contained/offline, self-host the font and swap the `<link>` in
  `index.html` for a local `@font-face`.
