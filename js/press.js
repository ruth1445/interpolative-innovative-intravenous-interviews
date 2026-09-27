/* The magazine/newspaper renderer. It knows how to arrange press-specific
   plates and headlines, but not how the editor stores or mutates a story. */
export function createPressRenderer({ app, esc, figureHTML, captionHTML, FONTS }) {
  function markHTML(p){
      const ar = p.ar || 1.333;
      const V  = 100 / ar;                       /* the box, in width-percent */
      const X  = v => v;                         /* x already is a percentage */
      const Y  = v => v * V / 100;               /* y is a percentage of height */
    
      const tx = X(p.tx ?? 20), ty = Y(p.ty ?? 60);
      /* ax/ay say where the line leaves the writing. Without them it guesses a
         couple of lines below the note, which leaves a gap when the note is
         shorter or lower than that. */
      const sx = X(p.ax ?? ((p.nx ?? 40) + 6));
      const sy = Y(p.ay ?? ((p.ny ?? 10) + 13));
      const cx = (sx + tx) / 2 - (ty - sy) * 0.13;   /* bow the line sideways */
      const cy = (sy + ty) / 2 - (tx - sx) * 0.10;
    
      /* the head, pointing back along the way the line came in */
      const dx = tx - cx, dy = ty - cy, L = Math.hypot(dx, dy) || 1;
      const ux = -dx / L, uy = -dy / L, H = 4.2, A = 0.42;
      const h1x = tx + H * (ux * Math.cos(A) - uy * Math.sin(A));
      const h1y = ty + H * (ux * Math.sin(A) + uy * Math.cos(A));
      const h2x = tx + H * (ux * Math.cos(-A) - uy * Math.sin(-A));
      const h2y = ty + H * (ux * Math.sin(-A) + uy * Math.cos(-A));
      const n = v => v.toFixed(2);
    
      /* the width is in viewBox units, not pixels: non-scaling-stroke isn't
         honoured everywhere and where it isn't the line comes out five times
         too fat. 0.55 of the picture's width lands at about two and a half
         pixels whatever size it's drawn. */
      const pen = 'fill="none" stroke="#B8242A" stroke-width="0.55" ' +
                  'stroke-linecap="round" stroke-linejoin="round"';
      return `<svg class="mark" viewBox="0 0 100 ${n(V)}" aria-hidden="true">
        <path ${pen} d="M${n(sx)} ${n(sy)} Q${n(cx)} ${n(cy)} ${n(tx)} ${n(ty)}"/>
        <path ${pen} d="M${n(tx)} ${n(ty)} L${n(h1x)} ${n(h1y)}
                 M${n(tx)} ${n(ty)} L${n(h2x)} ${n(h2y)}"/>
      </svg>`;
    }
    
    function plateHTML(p){
      const wide = p.w ? ` style="width:${p.w}%"` : '';
      return `<figure class="plate${p.wide ? ' wide' : ''}" data-img="${esc(p.img||'')}"${wide}>
        <span class="shot" style="padding-bottom:${(100/(p.ar||1.333)).toFixed(2)}%">
          <img src="${esc(p.img)}" alt="${esc(p.alt||'')}" loading="lazy"
               style="object-position:${p.fx ?? 50}% ${p.fy ?? 50}%">
          ${p.note ? markHTML(p) : ''}
          ${p.note ? `<span class="scribble"
            style="left:${p.nx ?? 40}%;top:${p.ny ?? 10}%">${p.note}</span>` : ''}
        </span>
        ${p.cap ? `<span class="bub">${p.cap}</span>` : ''}
      </figure>`;
    }
    
    /* The boxed list. Its contents ride along in a data attribute so that
       reading the page back in write mode returns a list block rather than a
       paragraph full of markup. */
    function panelHTML(b){
      const items = (b.list.items || []).map(t => `<li>${t}</li>`).join('');
      return `<aside class="panel" data-list="${esc(JSON.stringify(b.list))}">
        ${b.list.title ? `<h4>${b.list.title}</h4>` : ''}
        <ul>${items}</ul>
      </aside>`;
    }
    
    function platePairHTML(p){
      /* Two pictures side by side at the same height. The widths are shared out
         in proportion to each one's shape, so equal heights fall out of the
         arithmetic rather than out of grid fractions — which is what lets the
         pair sit inside a column instead of interrupting it. */
      const list = p.pair || [];
      const tot  = list.reduce((n,x)=> n + (x.ar || 1.333), 0) || 1;
      const gap  = (list.length - 1) * 0.7;          /* the gutter, in percent */
      const shots = list.map(x => {
        const ar = x.ar || 1.333;
        const w  = ((ar / tot) * (100 - gap)).toFixed(3);
        return `
          <span class="pairshot" style="width:${w}%;aspect-ratio:${ar}">
            <img src="${esc(x.img)}" alt="${esc(x.alt||'')}" loading="lazy">
          </span>`;
      }).join('');
      return `<figure class="plate-pair">
        <span class="pairrow">${shots}</span>
        ${p.cap ? `<figcaption class="paircap">${p.cap}</figcaption>` : ''}
      </figure>`;
    }
    
    /* Centre Siddharth's photo plates against the separators the eye actually
       sees: outer beige sheet edge ↔ column rule, rather than merely inside the
       CSS column box. This keeps the visible left/right gaps equal at any width. */
    function alignSiddharthPlates(){
      const press = app.querySelector('.press');
      const sheet = press && press.querySelector('.sheet');
      const cols  = press && press.querySelector('.cols');
      if(!sheet || !cols) return;
    
      const css = getComputedStyle(cols);
      const count = Math.max(1, parseInt(css.columnCount,10) || 1);
      const gap = parseFloat(css.columnGap) || 0;
    
      const targets = [...cols.querySelectorAll('.plate[data-img]')].filter(el =>
        /siddharth-(rooftop|metrograph)\.jpg$/i.test(el.dataset.img || '')
      );
    
      /* On the one-column mobile layout ordinary auto-centering is the right
         visual rule, so remove any desktop translation. */
      if(count < 2){
        targets.forEach(el => { el.style.transform = ''; });
        return;
      }
    
      const cr = cols.getBoundingClientRect();
      const sr = sheet.getBoundingClientRect();
      const colW = (cr.width - gap * (count - 1)) / count;
    
      const ruleX = i => cr.left + i * colW + (i - .5) * gap;
    
      targets.forEach(el => {
        el.style.transform = '';
        const pr = el.getBoundingClientRect();
        const baseCenter = pr.left + pr.width / 2;
    
        /* Find which newspaper column this plate occupies before shifting it. */
        let col = Math.round((baseCenter - (cr.left + colW / 2)) / (colW + gap));
        col = Math.max(0, Math.min(count - 1, col));
    
        const leftBoundary  = col === 0 ? sr.left  : ruleX(col);
        const rightBoundary = col === count - 1 ? sr.right : ruleX(col + 1);
        const wantedCenter = (leftBoundary + rightBoundary) / 2;
        const dx = wantedCenter - baseCenter;
    
        el.style.transform = `translateX(${dx.toFixed(2)}px)`;
      });
    }
    
    /* The press layout. Same blocks, different chrome: the writing goes into
       columns, the first picture becomes the pasted-in photograph, and the
       headline comes off the person's own record so nothing is hard-coded. */
    function pressHTML(p, story){
      const heroAt = story.findIndex(b => b.img !== undefined);
      const hero   = heroAt >= 0 ? story[heroAt] : null;
      const rest   = story.filter((_,i) => i !== heroAt);
      const H      = p.press || {};
    
      const pieces = rest.map(b => {
        if(b.img !== undefined) return figureHTML(b);
        if(b.box !== undefined) return captionHTML(b);
        if(b.list) return panelHTML(b);
        /* the type controls have to reach this layout too, or A+, font and
           column silently do nothing on a press page */
        const st = [
          b.font ? `font-family:var(${FONTS[b.font]||'--body'})` : '',
          b.size ? `font-size:${b.size}px` : '',
          b.w    ? `max-width:${b.w}%`     : ''
        ].filter(Boolean).join(';');
        return `<p${b.class ? ` class="${b.class}"` : ''} data-font="${b.font||'body'}"
          style="${st}">${b.p}</p>`;
      });
    
      /* Photographs go in among the paragraphs rather than off in a column of
         their own. `after` says which paragraph each one follows; going back to
         front means the earlier numbers still point where they did. */
      ((H.plates && H.plates.of) || []).slice().sort((a,b)=>(b.after||0)-(a.after||0))
        .forEach(p => pieces.splice(Math.min(p.after ?? pieces.length, pieces.length),
                                    0, p.pair ? platePairHTML(p) : plateHTML(p)));
      /* ONE column flow, always. The paired photograph used to be lifted out
         between separate multicol blocks; each block then balanced on its own,
         which is exactly where the ragged bottoms and the empty page came from.
         It now sits inside the flow like any other figure. */
      const body = `<div class="story cols">${pieces.join('')}</div>`;
    
      return `<article class="press${p.slug==='anita-wong' ? ' anita-press' : ''}${p.slug==='ashley' ? ' ashley-press' : ''}">
        <div class="sheet">
          <a href="#/" class="back">back to the index</a>
          <div class="top">
            <header>
              <p class="kicker">${H.kicker || ''}</p>
              <h1 class="shout">${H.shout || esc(p.name || '')}</h1>
              ${p.slug==='anita-wong' ? `<img class="anita-title-pin" src="pictures/people.jpg" alt="Group of people gathered in a shoe-repair shop">` : ''}
            </header>
          </div>
          ${body}
          <div class="colophon"></div>
        </div>
      </article>`;
    }

  return { pressHTML, alignSiddharthPlates };
}
