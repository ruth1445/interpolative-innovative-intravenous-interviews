from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

old = '''@media(max-width:560px){
  .anita-press .top header{grid-template-columns:minmax(0,1fr) 68px;column-gap:7px}
  .anita-press .anita-title-pin{width:68px;max-width:68px;padding:1px}
}
'''
new = '''@media(max-width:560px){
  .anita-press .top header{
    grid-template-columns:minmax(0,1fr);
    grid-template-rows:auto auto auto;
    row-gap:4px;
  }
  .anita-press .top .kicker{grid-column:1;grid-row:1}
  .anita-press .top .shout{grid-column:1;grid-row:2}
  .anita-press .anita-title-pin{
    grid-column:1;grid-row:3;
    justify-self:end;
    width:min(42vw,150px);max-width:150px;height:auto;
    margin-top:5px;padding:1px;
  }
}
'''
if old not in s:
    raise SystemExit('mobile Anita title block not found')
s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')
