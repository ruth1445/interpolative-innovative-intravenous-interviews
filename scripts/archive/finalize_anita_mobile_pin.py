from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')
marker = '</style>'
css = '''
/* Final mobile Anita title-pin override: keep image beside title, smaller, no overlap. */
@media(max-width:560px){
  .anita-press .top header{
    grid-template-columns:minmax(0,1fr) 44px !important;
    grid-template-rows:auto auto !important;
    column-gap:5px !important;
    align-items:center !important;
  }
  .anita-press .top .kicker{grid-column:1 !important;grid-row:1 !important;min-width:0}
  .anita-press .top .shout{grid-column:1 !important;grid-row:2 !important;min-width:0}
  .anita-press .anita-title-pin{
    grid-column:2 !important;
    grid-row:1 / span 2 !important;
    justify-self:end !important;
    width:44px !important;
    max-width:44px !important;
    height:auto !important;
    margin:0 !important;
    padding:1px !important;
  }
}
'''
if 'Final mobile Anita title-pin override' in s:
    raise SystemExit('override already present')
if marker not in s:
    raise SystemExit('style closing tag not found')
s = s.replace(marker, css + marker, 1)
p.write_text(s, encoding='utf-8')
