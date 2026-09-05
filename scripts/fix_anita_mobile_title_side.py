from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

old = '''@media(max-width:560px){
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
new = '''@media(max-width:560px){
  .anita-press .top header{
    grid-template-columns:minmax(0,1fr) 54px;
    grid-template-rows:auto auto;
    column-gap:6px;
    align-items:center;
  }
  .anita-press .top .kicker{grid-column:1;grid-row:1}
  .anita-press .top .shout{grid-column:1;grid-row:2}
  .anita-press .anita-title-pin{
    grid-column:2;grid-row:1 / span 2;
    justify-self:end;
    width:54px;max-width:54px;height:auto;
    margin:0;padding:1px;
  }
}
'''
if old not in s:
    raise SystemExit('current mobile Anita title block not found')
s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')
