from pathlib import Path
import re, base64

p = Path('index.html')
s = p.read_text(encoding='utf-8')

# 1) Safari tab icon: turn the already-embedded cow favicon into a real file.
# Safari is much more reliable with a file URL than a data-URI favicon.
m = re.search(r'<link rel="icon" type="image/jpeg" href="data:image/jpeg;base64,([^\"]+)">', s)
if m:
    Path('favicon.jpg').write_bytes(base64.b64decode(m.group(1)))

# Replace the current data-URI favicon links with cache-busted file links.
s = re.sub(
    r'\n<link rel="icon"[^\n]*>\n<link rel="apple-touch-icon"[^\n]*>',
    '\n<link rel="icon" type="image/jpeg" href="favicon.jpg?v=3">\n<link rel="shortcut icon" href="favicon.jpg?v=3">\n<link rel="apple-touch-icon" href="favicon.jpg?v=3">',
    s,
    count=1
)

# 2) Tighten the gutter between the subway and Seinfeld pictures.
s = re.sub(
    r'const gap\s*=\s*\(list\.length - 1\) \* 2\.2;',
    'const gap  = (list.length - 1) * 0.7;',
    s,
    count=1
)
s = s.replace('flex-direction:column;gap:8px', 'flex-direction:column;gap:4px', 1)

# 3) The small painting belongs beside Anita's headline, NOT in the browser tab.
PIN = '''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'''

pin_html = f'<img class="anita-title-pin" src="data:image/jpeg;base64,{PIN}" alt="Group of people gathered in a shoe-repair shop">'
old_head = '<h1 class="shout">${H.shout || esc(p.name || \'\')}</h1>\n        </header>'
new_head = '<h1 class="shout">${H.shout || esc(p.name || \'\')}</h1>\n          ${p.slug===\'anita-wong\' ? `' + pin_html + '` : \'\'}\n        </header>'
if old_head in s:
    s = s.replace(old_head, new_head, 1)
elif 'class="anita-title-pin"' not in s:
    raise SystemExit('headline insertion anchor not found')

# Headline layout: article title stays dominant; painting is only a tiny brooch.
css_anchor = '.anita-press .story.cols{'
css = '''/* Anita title brooch: a tiny print tucked into the empty side of the headline. */
.anita-press .top header{
  display:grid;
  grid-template-columns:minmax(0,1fr) 1.2in;
  grid-template-rows:auto auto;
  column-gap:clamp(10px,1.35vw,16px);
  align-items:center;
}
.anita-press .top .kicker{grid-column:1;grid-row:1}
.anita-press .top .shout{grid-column:1;grid-row:2}
.anita-press .anita-title-pin{
  grid-column:2;grid-row:1 / span 2;
  display:block;width:1.2in;max-width:1.2in;height:auto;
  box-sizing:border-box;padding:2px;
  border:1px solid rgba(18,17,12,.72);
  background:#eadfc4;
  transform:rotate(1deg);
}
@media(max-width:560px){
  .anita-press .top header{grid-template-columns:minmax(0,1fr) 68px;column-gap:7px}
  .anita-press .anita-title-pin{width:68px;max-width:68px;padding:1px}
}
/* Visually lower only the final tips panel so its foot meets the column-rule ending. */
@media(min-width:901px){
  .anita-press .cols .panel{position:relative;top:22px}
}

'''
if 'Anita title brooch:' not in s:
    if css_anchor not in s:
        raise SystemExit('Anita CSS anchor not found')
    s = s.replace(css_anchor, css + css_anchor, 1)

p.write_text(s, encoding='utf-8')
