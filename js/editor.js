import { createPressRenderer } from './press.js';

/* Interview pages, their in-browser editor, and the page-level rendering
   machinery live here. The homepage/bouquet stays in app.js. */
export function createInterviewController({ app, byslug, esc, viewIndex }) {
  const pager = null;
  
  /* ---------- WRITING IT IN THE PAGE ----------
     Press `write` on any page and it becomes editable in place. Everything
     you change is kept in this browser straight away, so a reload doesn't
     lose it. `copy the code` hands you the block to paste into the file when
     you want it to be permanent for everyone, not just this browser. */
  
  let EDIT = false;
  let BLOCKS = [];
  let CURRENT = null;
  let SEL = -1;          // the block the buttons act on
  
  const FONTS = {body:'--body', narrow:'--ui', serif:'--note', hand:'--hand'};
  const FONT_ORDER = ['body','narrow','serif','hand'];
  const RATIOS = ['auto','4/5','1/1','3/2','16/9','3/4'];
  
  /* ---- keeping it ----------------------------------------------------
     Two layers, because the first one is not always there.

     1. The browser's own memory keeps edits instantly when localStorage is
        available.

     2. `save interview file` downloads the current person's standalone
        module, ready to replace interviews/<slug>.js in the repository.
     -------------------------------------------------------------------- */
  
  /* a real test: write something, read it back, take it away again */
  const CAN_KEEP = (()=>{
    try{
      localStorage.setItem('bouquet:probe','1');
      const ok = localStorage.getItem('bouquet:probe') === '1';
      localStorage.removeItem('bouquet:probe');
      return ok;
    }catch(e){ return false; }
  })();
  
  const kept = p => { try{ return localStorage.getItem('bouquet:'+p.slug); }catch(e){ return null; } };
  
  const keyFor = p => 'bouquet:' + p.slug;
  function save(){
    if(!CURRENT) return;
    let ok = false;
    try{
      localStorage.setItem(keyFor(CURRENT), JSON.stringify(BLOCKS));
      ok = localStorage.getItem(keyFor(CURRENT)) !== null;
    }catch(e){ ok = false; }
    const dot = app.querySelector('.saved');
    if(dot){
      dot.textContent = ok ? 'kept' : 'not kept — use save this page';
      dot.classList.toggle('bad', !ok);
      clearTimeout(save._t);
      if(ok) save._t = setTimeout(()=>{ if(dot) dot.textContent = ''; }, 1400);
    }
  }
  function load(p){
    try{
      const raw = localStorage.getItem(keyFor(p));
      if(raw){
        const saved = JSON.parse(raw);
        /* Preserve local edits, but migrate the one Siddharth link added
           after those edits may have been saved in this browser. */
        if(p.slug === 'anita-wong'){
          const FINAL_ANITA_MARKER = 'Passion is contagious and will infect you too if you simply allow it to.';
          if(!JSON.stringify(saved).includes(FINAL_ANITA_MARKER)){
            try{ localStorage.removeItem(keyFor(p)); }catch(e){}
            return JSON.parse(JSON.stringify(p.story || []));
          }
        }
        if(p.slug === 'siddharth'){
          const oldReach = 'you can reach out to him yourself!';
          const linkedReach = 'you can <a href="https://x.com/itsiddharth_" target="_blank" rel="noopener noreferrer">reach</a> out to him yourself!';
          let changed = false;
          saved.forEach(b => {
            if(typeof b.p === 'string' && b.p.includes(oldReach)){
              b.p = b.p.replace(oldReach, linkedReach);
              changed = true;
            }
          });
          if(changed){
            try{ localStorage.setItem(keyFor(p), JSON.stringify(saved)); }catch(e){}
          }
        }
        return saved;
      }
    }catch(e){}
    return JSON.parse(JSON.stringify(p.story || []));
  }
  
  /* ---- save interview file ---------------------------------------------
     The editor serializes the current person's metadata plus edited story
     into one standalone ES module. No other interview has to be rewritten. */
  /* Save the current interview as its own module. The site used to rewrite the
     whole HTML file, but interviews now live independently. Keeping the
     export self-contained means Cmd-E still works after the refactor. */
  function interviewModuleCode(){
    const record = JSON.parse(JSON.stringify(CURRENT || {}));
    record.story = JSON.parse(JSON.stringify(BLOCKS || []));
    return 'export default ' + JSON.stringify(record, null, 2) + ';\n';
  }
  
  function saveCopy(){
    harvest();
    if(!CURRENT) return false;
    try{
      const out = interviewModuleCode();
      const url = URL.createObjectURL(new Blob([out], {type:'text/javascript'}));
      const a = document.createElement('a');
      a.href = url;
      a.download = CURRENT.slug + '.js';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(url), 4000);
      const dot = app.querySelector('.saved');
      if(dot){ dot.classList.remove('bad');
               dot.textContent = 'saved — replace interviews/' + CURRENT.slug + '.js';
               clearTimeout(save._t);
               save._t = setTimeout(()=>{ if(dot) dot.textContent=''; }, 6000); }
      return true;
    }catch(e){ showCode(); return false; }
  }
  
  /* NB: <a> is deliberately left alone in here — anything not named survives,
     and links must. */
  const tidy = html => html
    .replace(/<b>/g,'<strong>').replace(/<\/b>/g,'</strong>')
    .replace(/<i>/g,'<em>').replace(/<\/i>/g,'</em>')
    .replace(/<div>/g,'<br>').replace(/<\/div>/g,'')
    .replace(/<font[^>]*>|<\/font>/g,'')
    .replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
  
  const numOf = v => Math.round(parseFloat(v)*10)/10;
  
  /* The photographs strewn through the columns belong to the person's record,
     not to the writing, so everything that counts blocks has to step over
     them — otherwise reading the page back turns a photograph into a
     paragraph of markup and the save is corrupted. */
  const partsOf = host => [...host.children].filter(el =>
    !el.classList.contains('ghostline') &&
    !el.classList.contains('dropline') &&
    !el.classList.contains('plate') &&
    !el.classList.contains('plate-pair'));   /* a pair is a plate too */
  
  /* The writing can be split across two boxes — the opening paragraphs beside
     the headline, the rest in the columns. Everything that counts or indexes
     blocks works off this, so the split is invisible to the editor. */
  const allParts = () => [...app.querySelectorAll('.story')].flatMap(partsOf);
  
  /* read the page back into the blocks */
  function harvest(){
    if(!app.querySelector('.story')) return;
    BLOCKS = allParts().map(el=>{
      if(el.classList.contains('panel') && el.dataset.list){
        try{ return {list: JSON.parse(el.dataset.list)}; }catch(e){}
      }
      if(el.classList.contains('fig')){
        const b = {img: el.dataset.src};
        if(el.dataset.alt) b.alt = el.dataset.alt;
        const note = el.querySelector('.note');
        if(note){
          const c = note.cloneNode(true);
          c.querySelectorAll('svg,.grip').forEach(n=>n.remove());
          b.note = tidy(c.innerHTML);
        }
        b.side  = (/side-(\w+)/.exec(el.className)||[,'right'])[1];
        const w = el.style.getPropertyValue('--figw'); if(w) b.width = w;
        b.ratio = el.dataset.ratio || 'auto';
        b.fx = numOf(el.dataset.fx || 50);  b.fy = numOf(el.dataset.fy || 50);
        b.zoom = numOf(el.dataset.zoom || 1);
        b.nx = numOf(el.style.getPropertyValue('--nx') || -30);
        b.ny = numOf(el.style.getPropertyValue('--ny') || 52);
        b.nrot = numOf(el.style.getPropertyValue('--nrot') || -4);
        b.tx = numOf(el.dataset.tx || 18); b.ty = numOf(el.dataset.ty || 48);
        if(!el.querySelector('.arrowlayer')) b.arrow = false;
        return b;
      }
      if(el.classList.contains('cap')){
        return {box: tidy(el.querySelector('.captext').innerHTML),
                x: numOf(el.style.left), y: numOf(el.style.top),
                w: numOf(el.style.width), rot: numOf(el.style.getPropertyValue('--rot')||0),
                font: el.dataset.font || 'hand', size: numOf(el.style.fontSize || 19),
                tone: el.dataset.tone || 'red'};
      }
      const b = {p: tidy(el.innerHTML)};
      if(el.classList.contains('pull')) b.class = 'pull';
      if(el.dataset.font && el.dataset.font!=='body') b.font = el.dataset.font;
      if(el.style.fontSize) b.size = numOf(el.style.fontSize);
      if(el.style.maxWidth) b.w = numOf(el.style.maxWidth);
      return b;
    });
    save();
  }
  
  function storyCode(){
    const q = s => String(s).replace(/`/g,'\\`');
    const esc1 = s => String(s||'').replace(/'/g,"\\'");
    return 'story:[\n' + BLOCKS.map(b=>{
      if(b.img !== undefined) return `      { img:'${b.img}',${b.alt?` alt:'${esc1(b.alt)}',`:''}\n` +
        `        note:'${esc1(b.note)}', side:'${b.side||'right'}'${b.width?`, width:'${b.width}'`:''},\n` +
        `        ratio:'${b.ratio||'auto'}', fx:${b.fx??50}, fy:${b.fy??50}, zoom:${b.zoom??1},\n` +
        `        nx:${b.nx??-30}, ny:${b.ny??52}, nrot:${b.nrot??-4},\n` +
        `        tx:${b.tx??18}, ty:${b.ty??48}${b.arrow===false?', arrow:false':''} },`;
      if(b.box !== undefined) return `      { box:\`${q(b.box)}\`, x:${b.x}, y:${b.y}, w:${b.w},\n` +
        `        rot:${b.rot||0}, font:'${b.font||'hand'}', size:${b.size||19}, tone:'${b.tone||'red'}' },`;
      if(b.list) return '      { list:{ title:`' + q(b.list.title||'') + '`, items:[\n' +
        (b.list.items||[]).map(t => '        `' + q(t) + '`').join(',\n') +
        '\n      ]}},';
      return '      { ' + (b.class?`class:'${b.class}', `:'') + 'p:`' + q(b.p) + '`' +
        (b.font?`, font:'${b.font}'`:'') + (b.size?`, size:${b.size}`:'') +
        (b.w?`, w:${b.w}`:'') + ' },';
    }).join('\n\n') + '\n    ]';
  }
  
  function showCode(){
    const code = storyCode();
    try{ navigator.clipboard && navigator.clipboard.writeText(code); }catch(e){}
    const box = app.querySelector('#codebox');
    if(box){ box.value = code; box.hidden = false; box.select(); }
  }
  
  function toolbar(){
    return `<div class="tools">
      <button data-a="bold"><b>B</b></button>
      <button data-a="italic"><i>I</i></button>
      <button data-a="link">link</button>
      <button data-a="unlink">unlink</button>
      <button data-a="red" class="t-red">red</button>
      <button data-a="green" class="t-green">green</button>
      <button data-a="plain">plain</button>
      <i class="sep"></i>
      <button data-a="font">font</button>
      <button data-a="smaller">A−</button>
      <button data-a="bigger">A+</button>
      <button data-a="colnarrow">column −</button>
      <button data-a="colwide">column +</button>
      <i class="sep"></i>
      <button data-a="addp">+ paragraph</button>
      <button data-a="addimg">+ picture</button>
      <button data-a="addcap">+ caption</button>
      <button data-a="del">delete</button>
      <i class="sep"></i>
      <button data-a="up">↑</button>
      <button data-a="down">↓</button>
      <button data-a="side">left / right / full</button>
      <button data-a="narrow">−</button>
      <button data-a="wider">+</button>
      <i class="sep"></i>
      <button data-a="ratio">crop shape</button>
      <button data-a="zoomout">zoom −</button>
      <button data-a="zoomin">zoom +</button>
      <button data-a="tiltl">tilt ↺</button>
      <button data-a="tiltr">tilt ↻</button>
      <button data-a="arrow">arrow</button>
      <i class="sep"></i>
      <button data-a="savepage" class="t-go">save interview file</button>
      <button data-a="copy">copy the code</button>
      <button data-a="revert">revert</button>
      <button data-a="done">done</button>
      <span class="saved"></span>
    </div>
    ${CAN_KEEP ? '' : `<p class="warn">This browser will not hold on to your
      writing between visits — nothing typed here is being kept on its own.
      Press <b>save interview file</b> before you close it and you get a fresh
      copy of this person’s module with your writing already inside it. Replace
      the matching file in <code>interviews/</code> and everything stays modular.</p>`}`;
  }
  
  function wrapSel(cls){
    const sel = window.getSelection();
    if(!sel.rangeCount || sel.isCollapsed) return;
    const r = sel.getRangeAt(0);
    if(cls){
      const span = document.createElement('span');
      span.className = cls; span.appendChild(r.extractContents()); r.insertNode(span);
    } else {
      const f = r.extractContents();
      f.querySelectorAll('span').forEach(sp=>sp.replaceWith(...sp.childNodes));
      r.insertNode(f);
    }
    sel.removeAllRanges();
  }
  
  /* Turning selected words into a link, and back again.
     The selection has to be grabbed BEFORE the prompt opens — a prompt takes
     the focus, and on some browsers that collapses the selection, so asking
     first and reading the selection afterwards gets you nothing. */
  function linkSel(){
    const sel = window.getSelection();
    if(!sel.rangeCount || sel.isCollapsed){
      alert('Select the words you want to link first.');
      return false;
    }
    const r = sel.getRangeAt(0).cloneRange();
  
    /* if the selection is already inside a link, offer its address to edit */
    const inside = (n => { while(n && n.nodeType !== 1) n = n.parentNode;
                           return n && n.closest ? n.closest('a[href]') : null;
                         })(sel.anchorNode);
  
    const url = prompt('Link to where?', inside ? inside.getAttribute('href') : 'https://');
    if(url === null) return false;
    const clean = url.trim();
    if(!clean) return false;
  
    if(inside){ inside.setAttribute('href', clean); sel.removeAllRanges(); return true; }
  
    const a = document.createElement('a');
    a.setAttribute('href', clean);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
    a.appendChild(r.extractContents());
    r.insertNode(a);
    sel.removeAllRanges();
    return true;
  }
  
  function unlinkSel(){
    const sel = window.getSelection();
    if(!sel.rangeCount) return false;
    const host = (n => { while(n && n.nodeType !== 1) n = n.parentNode;
                         return n && n.closest ? n.closest('.story > *') : null;
                       })(sel.anchorNode);
    if(!host) return false;
    const r = sel.getRangeAt(0);
    const hit = [...host.querySelectorAll('a[href]')]
      .filter(a => r.intersectsNode ? r.intersectsNode(a) : true);
    if(!hit.length) return false;
    hit.forEach(a => a.replaceWith(...a.childNodes));
    host.normalize();
    sel.removeAllRanges();
    return true;
  }
  
  function editAction(a){
    /* which block is selected has to survive the button press — clicking a
       toolbar button would otherwise take the focus and the selection with it */
    const live = document.activeElement && document.activeElement.closest
      ? document.activeElement.closest('.story > *') : null;
    const sel = live ? allParts().indexOf(live)
              : (SEL >= 0 && SEL < BLOCKS.length ? SEL : -1);
  
    if(a==='bold')   return document.execCommand('bold');
    if(a==='italic') return document.execCommand('italic');
    if(a==='link')   { if(linkSel())   { harvest(); renderStory(); } return; }
    if(a==='unlink') { if(unlinkSel()) { harvest(); renderStory(); } return; }
    if(a==='red')    return wrapSel('red');
    if(a==='green')  return wrapSel('green');
    if(a==='plain')  return wrapSel(null);
  
    harvest();
    const i = sel >= 0 ? sel : BLOCKS.length - 1;
    const B = BLOCKS[i] || {};
    const figAt = BLOCKS.findIndex(b=>b.img !== undefined);
    const F = (B.img !== undefined) ? i : figAt;
  
    if(a==='addp')   BLOCKS.splice(i+1, 0, {p:'New paragraph.'});
    if(a==='addcap') BLOCKS.push({box:'a caption', x:60, y:30, w:24, rot:-3,
                                  font:'hand', size:19, tone:'red'});
    if(a==='addimg'){
      const name = prompt('File name of the picture, sitting next to this page:','photo.jpg');
      if(!name){ renderStory(); return; }
      BLOCKS.splice(i+1, 0, {img:name, note:'a note', side:'right', ratio:'auto',
                             fx:50, fy:50, zoom:1, nx:-30, ny:52, nrot:-4, tx:18, ty:48});
    }
    if(a==='del' && BLOCKS.length>1) BLOCKS.splice(i,1);
    if(a==='up'   && i>0)                 BLOCKS.splice(i-1,0,BLOCKS.splice(i,1)[0]);
    if(a==='down' && i>=0 && i<BLOCKS.length-1) BLOCKS.splice(i+1,0,BLOCKS.splice(i,1)[0]);
  
    if(a==='font' && B){
      const cur = B.font || (B.box !== undefined ? 'hand' : 'body');
      B.font = FONT_ORDER[(FONT_ORDER.indexOf(cur)+1) % FONT_ORDER.length];
    }
    if(a==='smaller'||a==='bigger'){
      const base = B.box !== undefined ? 19 : 17;
      B.size = Math.max(10, Math.min(64, (B.size || base) + (a==='bigger'?1:-1)));
    }
    if(a==='colnarrow'||a==='colwide'){
      if(B.box !== undefined) B.w = Math.max(8, Math.min(90, (B.w||24) + (a==='colwide'?3:-3)));
      else B.w = Math.max(20, Math.min(100, (B.w||100) + (a==='colwide'?5:-5)));
    }
  
    if(F>=0){
      const G = BLOCKS[F];
      if(a==='side'){ const o=['right','left','full'];
        G.side = o[(o.indexOf(G.side||'right')+1)%3]; }
      if(a==='narrow'||a==='wider'){
        const now = parseFloat(G.width)||42;
        G.width = Math.min(100, Math.max(16, now + (a==='wider'?4:-4)))+'%';
      }
      if(a==='ratio') G.ratio = RATIOS[(RATIOS.indexOf(G.ratio||'auto')+1)%RATIOS.length];
      if(a==='zoomin'||a==='zoomout')
        G.zoom = Math.max(1, Math.min(3, +( (G.zoom||1) + (a==='zoomin'?0.1:-0.1) ).toFixed(2)));
      if(a==='tiltl'||a==='tiltr'){
        const n = G.nrot!==undefined?G.nrot:-4;
        G.nrot = Math.max(-24, Math.min(24, n + (a==='tiltr'?3:-3)));
      }
      if(a==='arrow') G.arrow = G.arrow === false;
    }
    if(a==='tiltl'||a==='tiltr'){
      if(B.box !== undefined) B.rot = Math.max(-24, Math.min(24, (B.rot||0) + (a==='tiltr'?3:-3)));
    }
  
    if(a==='copy'){ showCode(); return; }
    if(a==='savepage'){ saveCopy(); return; }
    if(a==='revert'){
      if(!confirm('Throw away the changes kept in this browser and go back to what is in the file?')) return;
      try{ localStorage.removeItem(keyFor(CURRENT)); }catch(e){}
      BLOCKS = JSON.parse(JSON.stringify(CURRENT.story || []));
    }
    if(a==='done') EDIT = false;
    save();
    renderStory();
  }
  
  
  /* A picture, its note and the arrow between them are three things you
     should be able to put anywhere. side puts the picture left, right or
     across the page; nx/ny place the note relative to the picture and can
     sit outside it; tx/ty are where the arrow points. */
  function figureHTML(b){
    const side = b.side || 'right';
    const st = [
      b.width ? `--figw:${b.width}` : '',
      `--nx:${b.nx !== undefined ? b.nx : -30}%`,
      `--ny:${b.ny !== undefined ? b.ny : 52}%`,
      `--nrot:${b.nrot !== undefined ? b.nrot : -4}deg`
    ].filter(Boolean).join(';');
  
    const ratio = b.ratio || 'auto';
    const zoom  = b.zoom || 1;
    return `
      <figure class="fig side-${side}" data-src="${esc(b.img)}" data-alt="${esc(b.alt||'')}"
        data-tx="${b.tx !== undefined ? b.tx : 18}" data-ty="${b.ty !== undefined ? b.ty : 48}"
        data-ratio="${ratio}" data-fx="${b.fx ?? 50}" data-fy="${b.fy ?? 50}" data-zoom="${zoom}"
        style="${st}">
        <span class="crop"${ratio!=='auto' ? ` style="aspect-ratio:${ratio}"` : ''}>
          <img src="${esc(b.img)}" alt="${esc(b.alt || '')}"
            style="object-position:${b.fx ?? 50}% ${b.fy ?? 50}%;transform:scale(${zoom})">
        </span>
        ${b.note ? `<span class="note">${b.note}</span>` : ''}
        ${b.note && b.arrow !== false ? `<svg class="arrowlayer" aria-hidden="true"></svg>` : ''}
      </figure>`;
  }
  
  /* a caption is a small box of words you can put anywhere on the page */
  function captionHTML(b){
    const st = [
      `left:${b.x ?? 60}%`, `top:${b.y ?? 30}%`, `width:${b.w ?? 24}%`,
      `--rot:${b.rot || 0}deg`,
      `font-family:var(${FONTS[b.font||'hand']})`,
      `font-size:${b.size || 19}px`
    ].join(';');
    return `
      <div class="cap tone-${b.tone||'red'}" data-font="${b.font||'hand'}"
        data-tone="${b.tone||'red'}" style="${st}">
        <span class="captext">${b.box}</span>
      </div>`;
  }
  
  /* the arrow is drawn in the picture's own pixels, so the head never skews */
  function layArrows(){
    app.querySelectorAll('.fig').forEach(fig=>{
      const svg = fig.querySelector('.arrowlayer');
      const note = fig.querySelector('.note');
      if(!svg || !note) return;
      const F = fig.getBoundingClientRect();
      if(!F.width) return;
      const N = note.getBoundingClientRect();
      const tx = (+fig.dataset.tx/100) * F.width;
      const ty = (+fig.dataset.ty/100) * F.height;
      const sx = N.left - F.left + N.width/2;
      const sy = N.top  - F.top  + N.height/2;
  
      /* leave the note from whichever edge faces the target */
      const ax = sx + (tx > sx ? N.width/2 + 6 : -N.width/2 - 6);
      const ay = sy + (ty > sy ? N.height/2 * 0.5 : -N.height/2 * 0.5);
      const mx = (ax+tx)/2, my = (ay+ty)/2;
      const dx = tx-ax, dy = ty-ay, len = Math.hypot(dx,dy) || 1;
      const cx = mx - dy/len * len*0.18, cy = my + dx/len * len*0.18;   // a bow
      const a  = Math.atan2(ty-cy, tx-cx);
      const h  = 11;
      const h1 = [tx - Math.cos(a-0.42)*h, ty - Math.sin(a-0.42)*h];
      const h2 = [tx - Math.cos(a+0.42)*h, ty - Math.sin(a+0.42)*h];
  
      svg.setAttribute('viewBox', `0 0 ${F.width} ${F.height}`);
      svg.innerHTML =
        `<path d="M${ax} ${ay} Q${cx} ${cy} ${tx} ${ty}" fill="none" stroke="currentColor"
               stroke-width="2.2" stroke-linecap="round"/>
         <path d="M${tx} ${ty} L${h1[0]} ${h1[1]} M${tx} ${ty} L${h2[0]} ${h2[1]}"
               fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`;
  
      const t = fig.querySelector('.target');
      if(t){ t.style.left = fig.dataset.tx+'%'; t.style.top = fig.dataset.ty+'%'; }
    });
  }
  
  /* ---------- crop mode ----------------------------------------------
     The frame stays where it is and the picture slides behind it, which is
     the way cropping is supposed to feel. Drag anywhere inside to move the
     picture. Drag the bar at the bottom to change how tall the frame is.
     Click anywhere else, or press Escape, to come out of it. */
  function enterCrop(fig){
    app.querySelectorAll('.fig.cropping').forEach(f=>leaveCrop(f));
    fig.classList.add('cropping');
  
    const crop = fig.querySelector('.crop');
    const im   = fig.querySelector('img');
    if(!crop || !im) return;
  
    /* a picture with no frame yet gets the shape it already has, so that
       the first drag changes something instead of jumping */
    if((fig.dataset.ratio||'auto') === 'auto'){
      const R = crop.getBoundingClientRect();
      if(R.width && R.height){
        fig.dataset.ratio = (R.width/R.height).toFixed(3);
        crop.style.aspectRatio = fig.dataset.ratio;
      }
    }
  
    const hint = document.createElement('i');
    hint.className = 'crophint';
    hint.textContent = 'drag the picture to move it · drag the bar to reshape · esc when done';
    fig.appendChild(hint);
  
    const bar = document.createElement('i');
    bar.className = 'cropbar';
    fig.appendChild(bar);
  
    /* slide the picture behind the frame */
    crop.addEventListener('pointerdown', crop._pan = e=>{
      if(e.target.closest('.cropbar')) return;
      e.preventDefault(); e.stopPropagation();
      crop.setPointerCapture(e.pointerId);
      const start = {x:e.clientX, y:e.clientY,
                     fx:+fig.dataset.fx || 50, fy:+fig.dataset.fy || 50};
      const R = crop.getBoundingClientRect();
      const move = ev => {
        /* moving right shows more of the left of the picture */
        const fx = Math.max(0, Math.min(100, start.fx - ((ev.clientX-start.x)/R.width )*100));
        const fy = Math.max(0, Math.min(100, start.fy - ((ev.clientY-start.y)/R.height)*100));
        fig.dataset.fx = fx.toFixed(1); fig.dataset.fy = fy.toFixed(1);
        im.style.objectPosition = fx+'% '+fy+'%';
      };
      const up = ()=>{ crop.removeEventListener('pointermove', move);
                       crop.removeEventListener('pointerup', up); harvest(); };
      crop.addEventListener('pointermove', move);
      crop.addEventListener('pointerup', up);
    });
  
    /* reshape the frame */
    bar.addEventListener('pointerdown', e=>{
      e.preventDefault(); e.stopPropagation();
      bar.setPointerCapture(e.pointerId);
      const R = crop.getBoundingClientRect();
      const move = ev => {
        const h = Math.max(60, ev.clientY - R.top);
        fig.dataset.ratio = (R.width / h).toFixed(3);
        crop.style.aspectRatio = fig.dataset.ratio;
        layArrows();
      };
      const up = ()=>{ bar.removeEventListener('pointermove', move);
                       bar.removeEventListener('pointerup', up); harvest(); };
      bar.addEventListener('pointermove', move);
      bar.addEventListener('pointerup', up);
    });
  }
  
  function leaveCrop(fig){
    if(!fig || !fig.classList.contains('cropping')) return;
    fig.classList.remove('cropping');
    fig.querySelectorAll('.crophint,.cropbar').forEach(n=>n.remove());
    const crop = fig.querySelector('.crop');
    if(crop && crop._pan){ crop.removeEventListener('pointerdown', crop._pan); crop._pan = null; }
    harvest();
  }
  
  /* dragging: the note by its grip, the arrow by its tip */
  function armDragging(){
    const drag = (handle, onMove, onEnd)=>{
      handle.addEventListener('pointerdown', e=>{
        e.preventDefault(); e.stopPropagation();
        handle.setPointerCapture(e.pointerId);
        const move = ev => onMove(ev);
        const up = ()=>{ handle.removeEventListener('pointermove', move);
                         handle.removeEventListener('pointerup', up);
                         if(onEnd) onEnd(); harvest(); };
        handle.addEventListener('pointermove', move);
        handle.addEventListener('pointerup', up);
      });
    };
  
    /* the figures and caption boxes live in the main flow; the opening
       paragraphs beside the headline are text only */
    const boxes = [...app.querySelectorAll('.story')];
    const host = boxes[boxes.length - 1];
    if(!host) return;
  
    /* On a phone every picture is already full width and the captions sit in
       the flow, so there is nothing to place. Typing still works; the placing
       is for a real screen. */
    const roomy = window.innerWidth > 900;
  
    /* -------- picking one thing up -------- */
    const pick = el => {
      host.querySelectorAll('.picked').forEach(n=>n.classList.remove('picked'));
      if(el){ el.classList.add('picked');
              SEL = allParts().indexOf(el); }
    };
    host.addEventListener('pointerdown', e=>{
      const obj = e.target.closest('.fig,.cap');
      if(!e.target.closest('.hand')) pick(obj);
    });
  
    /* -------- corner handles: resize -------- */
    if(roomy) host.querySelectorAll('.hand').forEach(h=>{
      const el = h.parentElement;
      const isFig = el.classList.contains('fig');
      drag(h, ev=>{
        const S = host.getBoundingClientRect();
        const R = el.getBoundingClientRect();
        /* width is measured from whichever edge you are NOT holding */
        const anchor = h.classList.contains('se') || h.classList.contains('ne')
          ? R.left : R.right;
        const w = Math.abs(ev.clientX - anchor);
        const pct = Math.max(12, Math.min(100, (w / S.width) * 100));
        if(isFig){
          el.style.setProperty('--figw', pct.toFixed(1)+'%');
        } else {
          el.style.width = pct.toFixed(1)+'%';
        }
        layArrows();
      });
    });
  
    /* -------- pictures: drag to move them through the writing --------
       A floated picture lives between two paragraphs. So moving one means
       two answers: which gap it belongs in, and which side of the column
       it hangs off. The red line shows the gap; the half of the page you
       let go on picks the side. */
    host.querySelectorAll('.fig').forEach(fig=>{
      let line = null, at = null, side = null;
  
      const gaps = ()=> partsOf(host)
        .filter(el => el !== fig && !el.classList.contains('cap'));
  
      fig.addEventListener('pointerdown', e=>{
        if(!roomy) return;
        if(e.target.closest('.hand,.grip,.target,.focal,.cropbar')) return;
        if(fig.classList.contains('cropping')) return;   /* cropping owns the drag */
        e.preventDefault();
        fig.setPointerCapture(e.pointerId);
  
        /* A click and a drag start out identical. Until the pointer has
           actually travelled a few pixels this is still a click — which
           matters, because otherwise every click would count as a move and
           a double-click could never survive long enough to open cropping. */
        const from = {x:e.clientX, y:e.clientY};
        let live = false;
  
        const move = ev => {
          if(!live){
            if(Math.hypot(ev.clientX-from.x, ev.clientY-from.y) < 5) return;
            live = true;
            fig.classList.add('dragging');
            line = document.createElement('div');
            line.className = 'dropline';
          }
          const S = host.getBoundingClientRect();
          side = (ev.clientX - S.left) / S.width < 0.42 ? 'left' : 'right';
          const rows = gaps();
          at = rows.length;
          for(let i=0;i<rows.length;i++){
            const r = rows[i].getBoundingClientRect();
            if(ev.clientY < r.top + r.height/2){ at = i; break; }
          }
          const before = rows[at] || null;
          if(before) host.insertBefore(line, before); else host.appendChild(line);
        };
        const up = ()=>{
          fig.removeEventListener('pointermove', move);
          fig.removeEventListener('pointerup', up);
          fig.removeEventListener('pointercancel', up);
          if(!live){ line = null; return; }        /* it was only a click */
          fig.classList.remove('dragging');
          if(line && line.parentNode){
            fig.className = 'fig side-' + (side || 'right')
                          + (fig.classList.contains('picked') ? ' picked' : '');
            host.insertBefore(fig, line);
            line.remove();
          }
          line = null;
          harvest(); renderStory();
        };
        fig.addEventListener('pointermove', move);
        fig.addEventListener('pointerup', up);
        fig.addEventListener('pointercancel', up);
      });
  
      /* -------- double-click a picture to crop it -------- */
      fig.addEventListener('dblclick', e=>{
        if(!roomy) return;
        if(e.target.closest('.note,.grip')) return;
        enterCrop(fig);
      });
    });
  
    /* -------- captions: drag the box itself, type on double-click -------- */
    host.querySelectorAll('.cap').forEach(cap=>{
      const text = cap.querySelector('.captext');
      if(text && roomy) text.setAttribute('contenteditable','false'); /* until asked */
      cap.addEventListener('dblclick', ()=>{
        if(!text) return;
        text.setAttribute('contenteditable','true');
        text.focus();
      });
      cap.addEventListener('pointerdown', e=>{
        if(!roomy) return;
        if(e.target.closest('.hand')) return;
        if(text && text.getAttribute('contenteditable') === 'true') return;
        e.preventDefault();
        cap.setPointerCapture(e.pointerId);
        const R = cap.getBoundingClientRect();
        const ox = e.clientX - R.left, oy = e.clientY - R.top;
        const from = {x:e.clientX, y:e.clientY};
        let live = false;
        const move = ev => {
          if(!live){
            if(Math.hypot(ev.clientX-from.x, ev.clientY-from.y) < 5) return;
            live = true; cap.classList.add('dragging');
          }
          const S = host.getBoundingClientRect();
          cap.style.left = (((ev.clientX - ox - S.left)/S.width )*100).toFixed(1)+'%';
          cap.style.top  = (((ev.clientY - oy - S.top )/S.height)*100).toFixed(1)+'%';
        };
        const up = ()=>{
          cap.removeEventListener('pointermove', move);
          cap.removeEventListener('pointerup', up);
          cap.removeEventListener('pointercancel', up);
          if(!live) return;
          cap.classList.remove('dragging'); harvest();
        };
        cap.addEventListener('pointermove', move);
        cap.addEventListener('pointerup', up);
        cap.addEventListener('pointercancel', up);
      });
    });
    /* caption boxes drag around the whole story area */
    app.querySelectorAll('.cap').forEach(cap=>{
      const grip = cap.querySelector('.grip');
      if(grip) drag(grip, ev=>{
        const S = app.querySelector('.story').getBoundingClientRect();
        cap.style.left = (((ev.clientX-S.left)/S.width )*100).toFixed(1)+'%';
        cap.style.top  = (((ev.clientY-S.top )/S.height)*100).toFixed(1)+'%';
      });
    });
    /* the focal dot decides which part of a picture survives the crop */
    app.querySelectorAll('.fig .focal').forEach(dot=>{
      const fig = dot.closest('.fig'), im = fig.querySelector('img');
      dot.style.left = fig.dataset.fx+'%'; dot.style.top = fig.dataset.fy+'%';
      drag(dot, ev=>{
        const C = fig.querySelector('.crop').getBoundingClientRect();
        const fx = Math.max(0, Math.min(100, ((ev.clientX-C.left)/C.width )*100));
        const fy = Math.max(0, Math.min(100, ((ev.clientY-C.top )/C.height)*100));
        fig.dataset.fx = fx.toFixed(1); fig.dataset.fy = fy.toFixed(1);
        dot.style.left = fx+'%'; dot.style.top = fy+'%';
        im.style.objectPosition = fx+'% '+fy+'%';
      });
    });
    app.querySelectorAll('.fig').forEach(fig=>{
      const grip = fig.querySelector('.note .grip');
      if(grip) drag(grip, ev=>{
        const F = fig.getBoundingClientRect();
        fig.style.setProperty('--nx', (((ev.clientX-F.left)/F.width)*100).toFixed(1)+'%');
        fig.style.setProperty('--ny', (((ev.clientY-F.top )/F.height)*100).toFixed(1)+'%');
        layArrows();
      });
      const tgt = fig.querySelector('.target');
      if(tgt) drag(tgt, ev=>{
        const F = fig.getBoundingClientRect();
        fig.dataset.tx = (((ev.clientX-F.left)/F.width )*100).toFixed(1);
        fig.dataset.ty = (((ev.clientY-F.top )/F.height)*100).toFixed(1);
        layArrows();
      });
    });
  }
  
  /* ---------- PERSON ---------- */
  function viewPerson(slug){
    const p = byslug(slug);
    if(!p) return viewIndex();
  
    /* nobody unnamed has a page at all */
    if(!p.named && !p.story) return viewIndex();
  
    CURRENT = p;
    BLOCKS = load(p);            // whatever this browser kept, else the file
    renderStory();
  }
  
  
  /* Three snapshots in a heap./* Three snapshots in a heap. Each one carries its own place in the pile —
     where it sits, how wide it is, how far it's turned, and what sits on top
     of what — so the arrangement is data, not something baked into the CSS. */
  /* An arrow drawn on the photograph itself. The viewBox is made to match
     the picture's own proportions, so x is a percentage of the width and the
     arrowhead can't come out skewed. */
  const { pressHTML, alignSiddharthPlates } = createPressRenderer({
    app, esc, figureHTML, captionHTML, FONTS
  });

  window.addEventListener('resize', () => {
    if(CURRENT && CURRENT.press) requestAnimationFrame(alignSiddharthPlates);
  }, {passive:true});
  
  function renderStory(){
    const p = CURRENT;
    const story = BLOCKS;
  
    if(p && p.press){
      app.innerHTML = pressHTML(p, story);
      wireStory();
      requestAnimationFrame(alignSiddharthPlates);
      return;
    }
  
    app.innerHTML = `<article class="article"><div class="wrap">
      <a href="#/" class="back">back to the bouquet</a>
      ${story.length ? `
      <div class="story">
        ${story.map(b => {
          if(b.img !== undefined) return figureHTML(b);
          if(b.box !== undefined) return captionHTML(b);
          const st = [
            b.font ? `font-family:var(${FONTS[b.font]||'--body'})` : '',
            b.size ? `font-size:${b.size}px` : '',
            b.w    ? `max-width:${b.w}%`     : ''
          ].filter(Boolean).join(';');
          return `<p${b.class ? ` class="${b.class}"` : ''} data-font="${b.font||'body'}"
            style="${st}">${b.p}</p>`;
        }).join('')}
      </div>` : ''}
    </div></article>`;
  
    wireStory();
  }
  
  /* Everything that has to be hooked up after a redraw — the same for both
     layouts, so neither one can quietly lose the editor. */
  function wireStory(){
    const tools = app.querySelector('.tools');
    if(tools){
      /* holding the focus and the text selection where they were is what makes
         B, I and the colours work at all */
      tools.addEventListener('mousedown', e=>{ if(e.target.closest('button')) e.preventDefault(); });
      tools.onclick = e=>{
        const b = e.target.closest('button');
        if(b) editAction(b.dataset.a);
      };
    }
  
    /* remember what you last touched, and put the cursor back after a redraw */
    const hosts = [...app.querySelectorAll('.story')];
    if(hosts.length){
      const mark = e=>{
        const b = e.target.closest('.story > *');
        if(b) SEL = allParts().indexOf(b);
      };
      hosts.forEach(h=>{ h.addEventListener('focusin', mark);
                         h.addEventListener('mousedown', mark); });
      const parts = allParts();
      if(EDIT && SEL >= 0 && parts[SEL]){
        const back = parts[SEL];
        const t = back.matches('[contenteditable]') ? back : back.querySelector('[contenteditable]');
        if(t) t.focus({preventScroll:true});
      }
    }
    /* paste arrives as plain text, so nothing brings Word's markup with it */
    if(EDIT) armDragging();
    layArrows();
    /* every keystroke is kept, so a reload never costs you a paragraph */
    app.querySelectorAll('[contenteditable]').forEach(el=>{
      el.addEventListener('input', ()=>{ clearTimeout(renderStory._s);
        renderStory._s = setTimeout(harvest, 400); });
      el.addEventListener('blur', harvest);
    });
    app.querySelectorAll('[contenteditable]').forEach(el=>{
      el.addEventListener('paste', ev=>{
        ev.preventDefault();
        document.execCommand('insertText', false,
          (ev.clipboardData || window.clipboardData).getData('text'));
      });
    });
  
    /* say so plainly if a photo isn't beside the file yet */
    app.querySelectorAll('.fig img').forEach(im=>{
      im.onerror = ()=>{
        const d = document.createElement('div');
        d.className = 'ph';
        d.textContent = im.getAttribute('src') + ' — not found';
        im.replaceWith(d);
      };
    });
  
    window.scrollTo(0,0);
  }

  return { viewPerson, leaveCrop, layArrows };
}
