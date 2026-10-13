# Option A navigation

`site/option-a/index.html` is generated. It is the Option B prototype (`site/new/index.html`) plus
`layer.js`, which replaces only the navigation chrome: 6 apps (Home, Explore, Issues, Library,
Automate, Admin) instead of 12. Pages, routes and data are unchanged, so every old link still works.

Rebuild after changing `site/new/index.html` or `layer.js`:

    python3 tools/option-a/build.py

The build fails if the end of `site/new/index.html` no longer matches its anchor.

Where things went: see the `GR` table at the top of `layer.js`.
Not built: a single combined Library list (the type chips switch between the existing lists) and a
real left-hand type tree (a chip row is used instead).
