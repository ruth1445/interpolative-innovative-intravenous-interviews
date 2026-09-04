from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

# The photo pair must not live inside CSS multicolumn flow. Safari can
# overlap spanning grid items with the following column text. Style it as
# a normal full-width block between two column runs instead.
s = s.replace('.press .cols .plate-pair', '.press .plate-pair')
s = s.replace('  column-span:all;\n  display:grid;\n  grid-template-columns:minmax(0,.663fr) minmax(0,1.253fr);',
              '  display:grid;\n  grid-template-columns:minmax(0,.663fr) minmax(0,1.253fr);', 1)
s = s.replace('    column-span:none;\n    grid-template-columns:minmax(0,.663fr) minmax(0,1.253fr);',
              '    grid-template-columns:minmax(0,.663fr) minmax(0,1.253fr);', 1)

old = """  /* the first couple of paragraphs run beside the headline; the rest fall
     into the three columns. Both boxes are `.story`, so the editor still
     sees one ordered run of blocks across the two. */
  const body = pieces.join('');

  return `<article class=\"press\">
    <div class=\"sheet\">
      <a href=\"#/\" class=\"back\">back to the index</a>
      <div class=\"top\">
        <header>
          <p class=\"kicker\">${H.kicker || ''}</p>
          <h1 class=\"shout\">${H.shout || esc(p.name || '')}</h1>
        </header>
      </div>
      <div class=\"story cols\">${body}</div>
      <div class=\"colophon\"></div>
    </div>
  </article>`;
"""
new = """  /* A paired photo strip sits BETWEEN newspaper-column runs rather than
     spanning from inside one. This avoids Safari's multicolumn/grid overlap
     bug while keeping both pictures in one clean row. */
  const sections = [];
  let run = [];
  pieces.forEach(piece => {
    if(piece.includes('class=\"plate-pair\"')){
      if(run.length){
        sections.push(`<div class=\"story cols\">${run.join('')}</div>`);
        run = [];
      }
      sections.push(piece);
    } else {
      run.push(piece);
    }
  });
  if(run.length) sections.push(`<div class=\"story cols\">${run.join('')}</div>`);
  const body = sections.join('');

  return `<article class=\"press\">
    <div class=\"sheet\">
      <a href=\"#/\" class=\"back\">back to the index</a>
      <div class=\"top\">
        <header>
          <p class=\"kicker\">${H.kicker || ''}</p>
          <h1 class=\"shout\">${H.shout || esc(p.name || '')}</h1>
        </header>
      </div>
      ${body}
      <div class=\"colophon\"></div>
    </div>
  </article>`;
"""
if old not in s:
    raise SystemExit('pressHTML anchor not found')
s = s.replace(old, new, 1)

# Force browsers/CDN to fetch the restored multi-megabyte originals.
s = s.replace('anita-portrait.jpg?v=3', 'anita-portrait.jpg?v=4')
s = s.replace('anita-subway.jpg?v=3', 'anita-subway.jpg?v=4')
s = s.replace('anita-seinfeld.jpg?v=3', 'anita-seinfeld.jpg?v=4')

p.write_text(s, encoding='utf-8')
print('Anita layout fixed: photo pair outside columns; cache version bumped.')
