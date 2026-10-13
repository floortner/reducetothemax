#!/usr/bin/env python3
"""Generate site/option-a/index.html from site/new/index.html plus tools/option-a/layer.js.
Run after changing either file:  python3 tools/option-a/build.py"""
import pathlib,sys
root=pathlib.Path(__file__).resolve().parents[2]
src=(root/'site/new/index.html').read_text(encoding='utf-8')
layer=(root/'tools/option-a/layer.js').read_text(encoding='utf-8')
end='</script>\n</body>'
if src.count(end)!=1: sys.exit('anchor "</script></body>" not found exactly once in site/new/index.html')
out=src.replace(end,'</script>\n<script>\n'+layer+'</script>\n</body>')
(root/'site/option-a').mkdir(exist_ok=True)
(root/'site/option-a/index.html').write_text(out,encoding='utf-8')
print('wrote site/option-a/index.html',len(out)//1024,'KB')
