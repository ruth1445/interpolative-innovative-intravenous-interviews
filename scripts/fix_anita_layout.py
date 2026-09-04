from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

old_css = '''.press .cols .plate-pair{
  column-span:all;
  display:grid;
  grid-template-columns:minmax(0,.663fr) minmax(0,1.253fr);
  gap:clamp(10px,1.4vw,18px);
  align-items:end;
  margin:.55em 0 1.15em;
  break-inside:avoid;page-break-inside:avoid;
}
.press .cols .plate-pair .pairshot{
  display:block;overflow:hidden;
  border:1px solid rgba(18,17,12,.85);
  background:#E4D9BE;
}
.press .cols .plate-pair .pairshot img{
  display:block;width:100%;height:auto;
}
@media(max-width:900px){
  .press .cols .plate-pair{
    column-span:none;gap:8px;
    grid-template-columns:minmax(0,.663fr) minmax(0,1.253fr);
  }
}'''

new_css = '''.press .cols .plate-pair{
  column-span:all;
  display:grid;
  grid-template-columns:minmax(0,.663fr) minmax(0,1.253fr);
  gap:clamp(10px,1.4vw,18px);
  align-items:start;
  width:100%;
  box-sizing:border-box;
  margin:.8em 0 1.35em;
  break-inside:avoid;
  page-break-inside:avoid;
  clear:both;
  position:relative;
  z-index:0;
  overflow:visible;
}
.press .cols .plate-pair .pairshot{
  display:block;
  min-width:0;
  position:relative;
  overflow:hidden;
  border:1px solid rgba(18,17,12,.85);
  background:#E4D9BE;
}
.press .cols .plate-pair .pairshot img{
  display:block;
  width:100%;
  height:100%;
  object-fit:cover;
}
@media(max-width:900px){
  .press .cols .plate-pair{
    column-span:none;
    grid-template-columns:minmax(0,.663fr) minmax(0,1.253fr);
    gap:8px;
    margin:.7em 0 1em;
  }
}'''

if old_css not in s:
    raise SystemExit('pair CSS block not found')
s = s.replace(old_css, new_css, 1)

old_fn = '''function platePairHTML(p){
  const shots = (p.pair || []).map(x => `
    <span class="pairshot">
      <img src="${esc(x.img)}" alt="${esc(x.alt||'')}" loading="lazy">
    </span>`).join('');
  return `<figure class="plate-pair">${shots}</figure>`;
}'''

new_fn = '''function platePairHTML(p){
  const shots = (p.pair || []).map(x => {
    const ar = x.ar || 1.333;
    return `
      <span class="pairshot" style="aspect-ratio:${ar}">
        <img src="${esc(x.img)}" alt="${esc(x.alt||'')}" loading="lazy">
      </span>`;
  }).join('');
  return `<figure class="plate-pair">${shots}</figure>`;
}'''

if old_fn not in s:
    raise SystemExit('platePairHTML not found')
s = s.replace(old_fn, new_fn, 1)

old_data = '''        { img:'anita-portrait.jpg', ar:1.507, after:1, fx:50, fy:50, w:76, wide:true,
          alt:'Anita Wong with a friend' },
        { pair:[
            { img:'anita-subway.jpg', alt:'New York City subway interior' },
            { img:'anita-seinfeld.jpg', alt:'Seinfeld subway scene' }
          ], after:4 }'''

new_data = '''        { img:'anita-portrait.jpg?v=3', ar:1.508, after:1, fx:50, fy:50, w:92, wide:true,
          alt:'Anita Wong with a friend' },
        { pair:[
            { img:'anita-subway.jpg?v=3', ar:0.663, alt:'New York City subway interior' },
            { img:'anita-seinfeld.jpg?v=3', ar:1.253, alt:'Seinfeld subway scene' }
          ], after:4 }'''

if old_data not in s:
    raise SystemExit('Anita plate data block not found')
s = s.replace(old_data, new_data, 1)

p.write_text(s, encoding='utf-8')
print('Fixed Anita image sizing, aspect ratios, and cache-busting.')
