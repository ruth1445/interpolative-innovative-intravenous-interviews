import { PEOPLE } from '../interviews/index.js';
import { createInterviewController } from './editor.js';

/* ==================================================================
   ▓  YOUR DATA  ▓
   Copy a block to add a person. Everything else builds itself —
   the doodle rows and the next/prev links.
   qa[] is just question/answer pairs, in the order they were asked —
   free-form, since every conversation goes its own way.
   qa[].pull  = true  blows that answer up as a pull quote.
   ================================================================== */

const SITE = {
  title: "Interpolations",
  curator: "Ruth Sharon"
};

/* ==================================================================
   ▓  ENGINE  ▓
   ================================================================== */

const app  = document.getElementById('app');

const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pad = n => String(n).padStart(2,'0');
const byslug = s => PEOPLE.find(p=>p.slug===s);
const SOON = 'Blooming soon';
const label = p => (p.soon && !p.named) ? SOON : p.name;

/* deterministic per-slug pseudo-random, so the scatter never jumps around */
function rng(seed){
  let h=2166136261;
  for(const ch of seed){ h^=ch.charCodeAt(0); h=Math.imul(h,16777619); }
  return ()=>{ h^=h<<13; h^=h>>>17; h^=h<<5; return ((h>>>0)%100000)/100000; };
}


/* ---------- INDEX ---------- */
/* ---- the image plate: a doodle, drawn badly, by a different hand ----
   Twenty-two motifs, one per person. Each is defined as clean geometry
   and then re-drawn with a wobble: the line is resampled, every sample
   nudged, closed shapes overshoot where they meet. The "hand" — stroke
   weight, how shaky, one pass or two, tilt, ink — is seeded off the slug,
   so no two people draw alike and nobody's drawing ever changes. */

/* ---------- INDEX: the bunch ----------
   No wrap, no bow. Flowers packed close enough to leave no gaps, small
   leaves filling what's left, and long stems gathering to a point below.
   Nothing is blurred — every edge is a clean line. */

const CLUSTER = {cx:50, cy:36, rx:34, ry:27};
const GATHER  = [50, 108];

/* Each flower is a radial wash, the way a real petal is: a throat that
   contrasts, the body of the colour, and a rim that lifts at the edge.
   throat · inner · petal · rim · vein  */
const PALETTE = [
  ['#7E1C4B','#F2E7EA','#FDFCFA','#FFFFFF','#D9C9CE'],  // white, magenta throat
  ['#C9A227','#FFF6D9','#FFFDF4','#FFFFFF','#E4D9B8'],  // ivory, gold throat
  ['#B8860B','#FFE9A3','#FFD34E','#FFE884','#C99A12'],  // yellow
  ['#B03A0A','#FFC24A','#F79226','#FFBE5C','#B4600E'],  // marigold
  ['#A62310','#FF9E5E','#F4652A','#FF9C63','#AF4818'],  // orange
  ['#5E0C06','#F2836E','#DE2A1C','#F4695A','#6E1008'],  // scarlet
  ['#380408','#D8564E','#B01420','#C93038','#3E060A'],  // deep red
  ['#2A0410','#A83E52','#7E1028','#9E2038','#2E040F'],  // burgundy
  ['#8E1C55','#FFC9DA','#F58CB0','#FFC2D6','#C4527E'],  // blush
  ['#8A0F45','#F26FA6','#DE3D80','#F074A8','#9C1B55'],  // rose
  ['#5E0A45','#E05FC0','#BE1E93','#DC55B4','#6E1256'],  // magenta
  ['#26063A','#B872D0','#7E2E9E','#A459BE','#2E0846'],  // plum
  ['#2A1A6E','#8E86E0','#5A4EC4','#8880DC','#33227E'],  // violet
  ['#1A2A7E','#7FA0EE','#3E62CE','#7A9CEA','#22357E'],  // cornflower
  ['#123A6E','#6EC0F2','#1E86D4','#6ABCEE','#155A94'],  // azure
  ['#050C28','#5E78C4','#22357E','#4A66B4','#080F30'],  // navy
  ['#7E9E2A','#F2F7DC','#DCEAB4','#EAF2CE','#A8BE7E'],  // pale green
  ['#4A6E1A','#B4D48A','#8ABE5C','#B0D086','#5E7E2E']   // sage
];

/* Phyllotaxis: the arrangement a real flower head uses. Every point sits
   the same distance from its neighbours, which is exactly what "no gaps"
   requires — a random scatter always leaves holes. */
function bouquetLayout(n){
  const GOLDEN = Math.PI * (3 - Math.sqrt(5));
  return [...Array(n)].map((_,i)=>{
    const r = rng('pack'+i);
    const t = Math.sqrt((i + 0.5) / n);
    const a = i * GOLDEN;
    return {
      x: CLUSTER.cx + Math.cos(a)*CLUSTER.rx*t + (r()-0.5)*1.6,
      y: CLUSTER.cy + Math.sin(a)*CLUSTER.ry*t + (r()-0.5)*1.6,
      s: (1.08 - t*0.16) * (0.96 + r()*0.08),      // middle heads a little larger
      t, a
    };
  }).sort((p,q)=> q.t - p.t);                       // rim first, centre last
}

/* small leaves tucked into the spaces between heads */
function leafFill(n){
  const GOLDEN = Math.PI * (3 - Math.sqrt(5));
  const bits = [...Array(n)].map((_,i)=>{
    const r = rng('leaf'+i);
    const t = Math.sqrt((i + 0.5) / n) * 1.06;
    const a = i * GOLDEN + 0.8;
    const x = CLUSTER.cx + Math.cos(a)*CLUSTER.rx*t;
    const y = CLUSTER.cy + Math.sin(a)*CLUSTER.ry*t;
    const L = 7 + r()*5, w = 2.6 + r()*1.4;
    const g = ['#8FBB6E','#6F9E57','#A6C98A'][Math.floor(r()*3)];
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(r()*360).toFixed(0)})">
      <path d="M0 0 C${w} ${-L*.3} ${w*.8} ${-L*.72} 0 ${-L.toFixed(1)}
               C${-w*.8} ${-L*.72} ${-w} ${-L*.3} 0 0 Z" fill="${g}" class="leafshape"/>
      <path d="M0 -1 L0 ${(-L+1.5).toFixed(1)}" class="leafvein"/></g>`;
  }).join('');
  return `<svg class="leaves" viewBox="0 0 100 100" preserveAspectRatio="none">${bits}</svg>`;
}

/* long stems, gathered */
function stemArt(spots){
  /* A square bouquet can't fill a tall phone, so the box stops short of the
     bottom. Run the stems further past it there and the screen edge still
     does the cutting. */
  const gx = GATHER[0];
  const gy = ((typeof window !== 'undefined' && window.innerWidth) || 1440) < 820 ? 132 : GATHER[1];
  const lower = spots.filter(sp=>sp.y > CLUSTER.cy - 2);
  const stems = lower.map((sp,i)=>{
    const r = rng('stem'+i);
    const bend = (sp.x - gx) * 0.45;
    return `<path d="M${sp.x.toFixed(1)} ${sp.y.toFixed(1)}
             C${(sp.x - bend*0.25).toFixed(1)} ${(sp.y+14).toFixed(1)}
              ${(gx + bend*0.30).toFixed(1)} ${(gy-22).toFixed(1)}
              ${gx} ${gy}" class="stem" style="--w:${(0.8+r()*0.7).toFixed(2)}"/>`;
  }).join('');

  const sprigs = lower.filter((_,i)=>i%3===1).map((sp,i)=>{
    const r = rng('sl'+i);
    const my = sp.y + 16 + r()*20;
    const mx = sp.x + (gx - sp.x)*((my - sp.y)/(gy - sp.y)) * 0.9;
    const dir = mx < gx ? -1 : 1;
    const L = 5 + r()*4;
    return `<g transform="translate(${mx.toFixed(1)} ${my.toFixed(1)}) rotate(${(dir*58 + (r()-0.5)*24).toFixed(0)})">
      <path d="M0 0 C${2.4*dir} ${-L*.3} ${2*dir} ${-L*.7} 0 ${-L.toFixed(1)}
               C${-2*dir} ${-L*.7} ${-2.4*dir} ${-L*.3} 0 0 Z" fill="#7FAD64" class="leafshape"/></g>`;
  }).join('');

  return `<svg class="stems" viewBox="0 0 100 100" preserveAspectRatio="none">${stems}${sprigs}</svg>`;
}


/* ---- the blooms ----
   Six shapes that stay legible at the size they're actually drawn. Flat
   colour, black line, nothing clever. */

/* ---- the blooms ----
   Built from the reference: broad ruffled petals, a throat that contrasts,
   veins running out from the middle, and a stamen column standing proud of
   the face. Every petal is filled with the flower's own radial wash, so the
   colour deepens into the centre the way it does on a real one. */

/* one petal, pointing up from the middle, ruffled along its outer edge */
const P = {
  /* hibiscus: a broad fan, widest near the tip, ruffled across the top —
     five of these at 72° just meet, which is what makes them read as five
     petals instead of one lump */
  broad: `M50 50 C42 43 31 33 28 22
          C25 13 32 6 39 9 C43 10 44 5 50 5
          C56 5 57 10 61 9 C68 6 75 13 72 22
          C69 33 58 43 50 50 Z`,
  /* lily: narrow, pointed, curling back */
  spear: `M50 50 C40 41 34 24 44 6 C46 2 54 2 56 6
          C66 24 60 41 50 50 Z`,
  /* gerbera: a slim tongue with a rounded tip */
  ray:   `M50 50 C45 43 43 27 45 14 C46 8 54 8 55 14
          C57 27 55 43 50 50 Z`,
  /* dahlia: pointed, folded down the middle */
  quill: `M50 50 C44 41 41 25 50 8 C59 25 56 41 50 50 Z`,
  /* rounded and overlapping — camellia, ranunculus, pompom */
  round: `M50 50 C37 47 29 38 31 27 C33 17 41 11 50 14
          C59 11 67 17 69 27 C71 38 63 47 50 50 Z`
};

const ring = (n, d, off=0, scale=1) => [...Array(n)].map((_,i)=>
  `<path d="${d}" class="fl" transform="rotate(${(i*(360/n)+off).toFixed(1)} 50 50)${
    scale!==1 ? ` translate(50 50) scale(${scale}) translate(-50 -50)` : ''}"/>`).join('');

const veins = (n, len, off=0) => [...Array(n)].map((_,i)=>
  `<path d="M50 46 C50 ${(50-len*0.45).toFixed(0)} 50 ${(50-len*0.7).toFixed(0)} 50 ${(50-len).toFixed(0)}"
     class="vein" transform="rotate(${(i*(360/n)+off).toFixed(1)} 50 50)"/>`).join('');

/* the column of stamens a hibiscus carries out in front of its face.
   Small and thin it just disappears at the size these are drawn, so it is
   deliberately bold. */
const column = (len=32) => `
  <g transform="rotate(-20 50 50)">
    <path d="M50 48 C50 ${(50-len*0.4).toFixed(0)} 49 ${(50-len*0.75).toFixed(0)} 47.5 ${(50-len).toFixed(0)}" class="fil"/>
    ${[...Array(8)].map((_,i)=>{
      const t = 0.44 + i*0.075, a = (i%2 ? 1 : -1) * (3 + i*0.5);
      const y = 50 - len*t, x = 50 + a;
      return `<path d="M${(50-(50-x)*0.3).toFixed(1)} ${(50-(50-y)*0.7).toFixed(1)}
                       L${x.toFixed(1)} ${y.toFixed(1)}" class="fil"/>
              <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.1" class="anth"/>`;
    }).join('')}
    ${[...Array(5)].map((_,i)=>{
      const a = (i-2)*0.42, x = 47.5 + Math.sin(a)*4.6, y = 50-len + Math.cos(a)*1.4 - 2.4;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" class="stig"/>`;
    }).join('')}
  </g>`;

const BLOOMS = {
  /* the shape that runs right through her reference */
  poppy: ()=>`
    ${ring(5, P.broad, 18)}
    ${veins(5, 36, 18)}
    ${[...Array(5)].map((_,i)=>
      `<path d="M50 47 C45 39 42 30 43 21 M50 47 C55 39 58 30 57 21"
        class="vein" transform="rotate(${i*72+18} 50 50)" opacity=".34"/>`).join('')}
    ${column(33)}`,

  /* a second hibiscus, petals turned the other way and a shorter column */
  cosmos: ()=>`
    ${ring(5, P.broad, -16, 0.96)}
    ${veins(5, 33, -16)}
    ${column(28)}`,

  /* gerbera: two rings of rays around a packed disc */
  daisy: ()=>`
    ${ring(16, P.ray, 0)}
    ${ring(16, P.ray, 11.25, 0.76)}
    <circle cx="50" cy="50" r="13" class="mid"/>
    ${[...Array(26)].map((_,i)=>{
      const t = Math.sqrt((i+0.5)/26), a = i*2.399963;
      return `<circle cx="${(50+Math.cos(a)*11.5*t).toFixed(1)}"
                      cy="${(50+Math.sin(a)*11.5*t).toFixed(1)}"
                      r="1.6" class="anth" opacity=".85"/>`;}).join('')}`,

  /* lily: six pointed petals, freckled throat, stamens out front */
  tulip: ()=>`
    ${ring(3, P.spear, 60, 0.97)}
    ${ring(3, P.spear, 0)}
    ${veins(6, 36)}
    ${[...Array(16)].map((_,i)=>{
      const r0 = rngv(i), a = i*2.399963, t = Math.sqrt((i+0.5)/16);
      return `<circle cx="${(50+Math.cos(a)*14*t).toFixed(1)}"
                      cy="${(50+Math.sin(a)*14*t).toFixed(1)}"
                      r="${(1+r0*0.6).toFixed(1)}" class="stig" opacity=".6"/>`;}).join('')}
    ${column(28)}`,

  /* camellia: rounded petals folding in, each ring turned off the last */
  rose: ()=>`
    ${ring(7, P.round, 0)}
    ${ring(6, P.round, 26, 0.68)}
    ${ring(5, P.round, 12, 0.4)}
    <circle cx="50" cy="50" r="3.4" class="mid"/>`,

  /* dahlia: three rings of quills, tight eye */
  aster: ()=>`
    ${ring(13, P.quill, 0)}
    ${ring(13, P.quill, 13.8, 0.74)}
    ${ring(9, P.quill, 6, 0.46)}
    <circle cx="50" cy="50" r="4.6" class="mid"/>`,

  /* ranunculus: small rounded petals wound tight */
  ranunculus: ()=>`
    ${ring(8, P.round, 0)}
    ${ring(8, P.round, 22, 0.7)}
    ${ring(6, P.round, 11, 0.44)}
    <circle cx="50" cy="50" r="3" class="mid"/>`,

  /* pompom dahlia: a dense ball of little petals */
  pom: ()=>`
    ${ring(11, P.round, 0, 0.94)}
    ${ring(11, P.round, 16, 0.66)}
    ${ring(8,  P.round, 8,  0.42)}
    <circle cx="50" cy="50" r="2.6" class="mid"/>`,

  /* Still closed, and smaller than an open flower, because that is what a
     bud is. Levelling it to the same size as the blooms turned the page
     into a heap of green eggs with six flowers lost in it. */
  bud: ()=>`
    <path d="M50 12 C63 24 69 44 65 61 C61 76 56 86 50 88
             C44 86 39 76 35 61 C31 44 37 24 50 12 Z" class="fl"/>
    <path d="M50 12 C60 32 61 60 53 87" class="ln" opacity=".5"/>
    <path d="M50 12 C40 32 39 60 47 87" class="ln" opacity=".5"/>
    <path d="M37 40 C45 48 48 62 48 88" class="ln" opacity=".3"/>
    <path d="M63 40 C55 48 52 62 52 88" class="ln" opacity=".3"/>`
};

/* a scrap of noise for the lily freckles, so they don't sit in a lattice */
function rngv(i){ const x = Math.sin(i*127.1)*43758.5453; return x - Math.floor(x); }

const BLOOM_KEYS = ['daisy','cosmos','poppy','tulip','rose',
                    'daisy','cosmos','poppy','rose','bud'];

/* Shape and colour are chosen against the neighbours rather than at
   random, so no two touching flowers are the same. Each person keeps a
   seeded order of preference and takes the first one nobody beside them
   has already used; if every option is taken, whichever is rarest wins. */
const SHAPES = ['daisy','cosmos','poppy','tulip','rose','bud','aster','ranunculus','pom'];

/* how much of its 100-unit box each shape actually fills, inverted — so
   every flower ends up the same size on the page and none leaves a hole */
/* measured from each shape's own markup, not guessed */
const SHAPE_FIT = {
  poppy:1.01, cosmos:1.06, daisy:1.14, tulip:1.00, rose:1.20,
  aster:1.15, ranunculus:1.20, pom:1.28, bud:0.80
};

function assignBlooms(spots, people){
  const shape = [], colour = [];
  /* A colour asked for by name is held back — but only from flowers near
     enough to be confused with it. Reserving all six across the whole bunch
     left too few colours for everyone else, and neighbours started
     repeating. */
  const claims = (people||[]).map((p,i)=>
    (p && p.colour !== undefined) ? {i, c:p.colour} : null).filter(Boolean);
  const freeFor = i => {
    const near = new Set(claims
      .filter(cl => cl.i !== i && Math.hypot(spots[cl.i].x-spots[i].x, spots[cl.i].y-spots[i].y) < 34)
      .map(cl => cl.c));
    return [...PALETTE.keys()].filter(k => !near.has(k));
  };
  const shuffled = (arr, r)=>{
    const a = arr.slice();
    for(let k=a.length-1;k>0;k--){ const j=Math.floor(r()*(k+1)); [a[k],a[j]]=[a[j],a[k]]; }
    return a;
  };
  const pick = (pref, near, taken)=>{
    const free = pref.find(v=>!near.includes(v));
    if(free !== undefined) return free;
    const count = v => near.filter(x=>x===v).length;      // fall back to rarest
    return pref.slice().sort((a,b)=>count(a)-count(b))[0];
  };
  spots.forEach((sp,i)=>{
    const r = rng('assign'+i);
    const nb = [];
    for(let j=0;j<i;j++)
      if(Math.hypot(spots[j].x-sp.x, spots[j].y-sp.y) < 24) nb.push(j);
    const want = people[i] || {};
    /* no name yet, no bloom yet */
    shape[i]  = (want.soon && !want.named) ? 'bud'
              : want.shape !== undefined   ? want.shape
              : pick(shuffled(SHAPES, r),              nb.map(j=>shape[j]));
    colour[i] = want.colour !== undefined ? want.colour
              : pick(shuffled(freeFor(i), r),          nb.map(j=>colour[j]));
  });
  return {shape, colour};
}

const BUD = '#C9D8B2';           // every unopened one, the same soft green

function flower(p, kind, c, r){
  const spin = Math.round(rng(p.slug+'::spin')()*360);
  /* buds all share a colour on purpose — twenty-four different greens would
     compete with the six flowers that are meant to be the subject */
  const B = ['#AFC894','#BCD2A2','#A8C48A','#C6DAAE','#6F8E56'];
  const [throat, inner, petal, rim, vein] = kind === 'bud' ? B : PALETTE[c];

  /* Its own gradient, because the whole point is that the colour is not
     flat: it sits deep in the throat and opens out towards the rim. The
     id has to be unique or every flower on the page borrows the first
     one's colours. */
  const id = 'w-' + p.slug;
  return `<svg viewBox="0 0 100 100" class="bloom"
       style="--throat:${throat};--inner:${inner};--petal:${petal};
              --rim:${rim};--vein:${vein};--spin:${spin}deg">
    <defs>
      <!-- userSpaceOnUse, not the default. On the default every petal gets
           its own little gradient centred on itself, which is exactly wrong:
           a flower has ONE throat and the colour opens out from it. -->
      <radialGradient id="${id}" gradientUnits="userSpaceOnUse"
                      cx="50" cy="50" r="46">
        <stop offset="0%"   stop-color="${throat}"/>
        <stop offset="17%"  stop-color="${throat}"/>
        <stop offset="30%"  stop-color="${inner}"/>
        <stop offset="52%"  stop-color="${petal}"/>
        <stop offset="88%"  stop-color="${petal}"/>
        <stop offset="100%" stop-color="${rim}"/>
      </radialGradient>
    </defs>
    <g fill="url(#${id})">${BLOOMS[kind]()}</g>
  </svg>`;
}


function viewIndex(){
  app.innerHTML = `
  <div class="hand-page">
    <div class="sheet">
      <h1 class="masthead">Trying to learn<br>from people</h1>

      <div class="searchrow">
        <input id="q" type="search" autocomplete="off" spellcheck="false"
               placeholder="search for someone">
        <button class="aboutlink" type="button" id="aboutbtn">about this site</button>
      </div>

      <nav class="name-index" aria-label="people">
                <a class="name-oval" href="#/p/anita-wong">anita wong</a>
        <a class="name-oval" href="#/p/ashley">ashley</a>
        <span class="name-oval soon" aria-disabled="true">george st. camera</span>
        <span class="name-oval soon" aria-disabled="true">larry</span>
        <span class="name-oval soon" aria-disabled="true">louis mendez</span>
        <a class="name-oval" href="#/p/samir-dorothy">samir &amp; dorothy</a>
        <a class="name-oval" href="#/p/siddharth">siddharth</a>
        <span class="name-oval soon" aria-disabled="true">tejas</span>
      </nav>
    </div>
  </div>

  <div class="overlay" id="about" hidden>
    <div class="scrim"></div>
    <div class="card-about" role="dialog" aria-modal="true" aria-label="About this site">
      <button class="close" type="button" aria-label="Close">&times;</button>
      <p>This is my attempt at learning from as many people as I can meet. I
         interview people I find interesting and turn it into an essay.
         Documenting these conversations is very important to me because
         a)&nbsp;I don&rsquo;t want to lose any of this info to my poor memory
         and b)&nbsp;it challenges me to keep at something I love doing.</p>
      <p>Everything will remain unnamed and untitled for now till I find the
         perfect word(s).</p>
    </div>
  </div>`;

  const sheet = document.getElementById('about');
  const shut  = ()=>{ sheet.classList.remove('on'); setTimeout(()=>{sheet.hidden = true;}, 200); };
  document.getElementById('aboutbtn').onclick = ()=>{
    sheet.hidden = false;
    requestAnimationFrame(()=> sheet.classList.add('on'));
    sheet.querySelector('.close').focus();
  };
  sheet.querySelector('.scrim').onclick = shut;
  sheet.querySelector('.close').onclick = shut;

  const q = document.getElementById('q');
  const ovals = [...document.querySelectorAll('.name-index .name-oval')];

  const filterNames = ()=>{
    const v = q.value.trim().toLowerCase();
    ovals.forEach(el=>{
      const match = !v || el.textContent.trim().toLowerCase().includes(v);
      el.hidden = !match;
    });
  };

  q.addEventListener('input', filterNames);
  q.addEventListener('search', filterNames);

  q.onkeydown = e=>{
    if(e.key !== 'Enter') return;
    const firstPublished = ovals.find(el =>
      !el.hidden && el.matches('a.name-oval[href]')
    );
    if(firstPublished) location.hash = firstPublished.getAttribute('href');
  };
}

const interview = createInterviewController({ app, byslug, esc, viewIndex });

/* ---------- ROUTER ---------- */
function route(){
  const h = location.hash.replace(/^#\/?/,'');
  if(h.startsWith('p/'))    interview.viewPerson(h.slice(2));
  else                      viewIndex();
}
document.addEventListener('keydown', e=>{
  if(e.key !== 'Escape') return;
  /* escape gets you out of cropping first, and out of the card second */
  const c = app.querySelector('.fig.cropping');
  if(c){ interview.leaveCrop(c); return; }
  const s = document.getElementById('about');
  if(s && !s.hidden){ s.classList.remove('on'); setTimeout(()=>{s.hidden = true;}, 200); }
});

/* clicking away puts the picture down and stops cropping */
document.addEventListener('pointerdown', e=>{
  const c = app.querySelector('.fig.cropping');
  if(c && !c.contains(e.target)) interview.leaveCrop(c);
  if(!e.target.closest('.fig,.cap,.tools')){
    app.querySelectorAll('.picked').forEach(n=>n.classList.remove('picked'));
  }
}, true);

/* the arrow is drawn in pixels, so it has to be redrawn when they change */
window.addEventListener('resize', ()=> interview.layArrows());

window.addEventListener('hashchange', route);

let rt;
window.addEventListener('resize', ()=>{
  clearTimeout(rt);
  rt = setTimeout(()=>{ if(!location.hash.replace(/^#\/?/,'')) viewIndex(); }, 180);
});

route();
