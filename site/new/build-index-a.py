#!/usr/bin/env python3
"""Generate site/new/index-a.html (Option A navigation) from site/new/index.html plus
site/new/index-a.layer.js. The layer replaces only the navigation chrome: 6 apps (Home, Explore, Issues,
Library, Automate, Admin) instead of 12. Pages, routes and data are shared, so old links still work.

Run after changing index.html or index-a.layer.js:   python3 site/new/build-index-a.py
The build fails if the end of index.html no longer matches its anchor.
The layer's GR table lists where each page went.
Not built: one combined Library list and a real left-hand type tree (chip rows are used)."""
import pathlib,sys
here=pathlib.Path(__file__).resolve().parent
src=(here/'index.html').read_text(encoding='utf-8')
layer=(here/'index-a.layer.js').read_text(encoding='utf-8')
end='</script>\n</body>'
if src.count(end)!=1: sys.exit('anchor "</script></body>" not found exactly once in index.html')
out=src.replace(end,'</script>\n<script>\n'+layer+'</script>\n</body>')
(here/'index-a.html').write_text(out,encoding='utf-8')
print('wrote site/new/index-a.html',len(out)//1024,'KB')
