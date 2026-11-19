// Public Yuzu time-travel game. Entirely static: no API, accounts, or telemetry.
// "Known since" is a conservative practical milestone, not a claim that
// every precursor or concept was unknown until that exact year.
const ERAS = [
  { id:"16th", label:"16th century", year:1550 },
  { id:"17th", label:"17th century", year:1650 },
  { id:"18th", label:"18th century", year:1750 },
  { id:"19th", label:"19th century", year:1850 },
  { id:"early", label:"Early 20th century", year:1920 },
  { id:"50s", label:"1950s", year:1955 },
  { id:"60s", label:"1960s", year:1965 },
  { id:"70s", label:"1970s", year:1975 },
  { id:"80s", label:"1980s", year:1985 },
  { id:"90s", label:"1990s", year:1995 }
];

// Each "concept" is part of the non-AI answer sheet. Matched words are
// *prompts for human review*, not a reliable semantic correctness score.
// Each prompt uses one of the supplied photographs in a compact 4 x 4 atlas.
const ITEMS = [
  {
    id:"stanley", name:"Stanley tumbler", lead:"what a", knownSince:2016,
    concepts:[
      {label:"reusable drinking vessel", words:["cup","bottle","tumbler","vessel","container","drink","water"]},
      {label:"keeps drinks hot or cold", words:["cold","hot","temperature","insulat","cool","warm","hours"]},
      {label:"portable with a straw or handle", words:["straw","handle","carry","travel","portable","lid","fashion","trend"]}
    ],
    samples:{
      old:"Imagine a metal drinking vessel with walls built to keep heat out or in, much as a well-wrapped pot stays warm. You carry it about, drink through a small tube, and some people collect fashionable colours of it.",
      early:"It is a reusable travelling drinking cup, rather like a fine vacuum flask, but with a handle and a straw. It keeps water cold for hours, and particular colours have become fashionable.",
      "50s":"Picture a Thermos-style cup with a handle and straw. It keeps a drink cold for many hours and has become a fashionable everyday accessory.",
      "60s":"Think of an insulated flask shaped like a large cup, with a straw and handle. It keeps drinks cool and people even choose it for its fashionable colours.",
      "70s":"A large reusable insulated cup with a straw and handle. It keeps drinks cold for hours, and people collect different colours as a fashion trend.",
      "80s":"It's a fashionable reusable cup built like a Thermos, with a handle and straw, designed to keep drinks hot or cold for hours."
    }
  },
  {
    id:"llm", name:"LLM", lead:"what an", knownSince:2018,
    concepts:[
      {label:"learns patterns from a huge amount of writing", words:["book","text","writing","language","words","read","learn","pattern","trained"]},
      {label:"predicts or generates responses", words:["predict","reply","answer","respond","write","sentence","conversation","generate"]},
      {label:"is a computer system, not a human mind", words:["machine","computer","calculation","mechanical","not human","not a person","software","program","automat"]}
    ],
    samples:{
      old:"Imagine a clockwork clerk that has studied an immense library of written pages. When you ask it a question, its machinery arranges words into a likely reply. It may sound knowledgeable, but it is no thinking human being.",
      early:"Picture an extraordinarily elaborate calculating machine trained on vast libraries of printed words. Instead of merely counting, it arranges words into answers and letters. It can sound convincing even when wrong.",
      "50s":"Imagine a room-sized electronic computer fed an enormous collection of writing. It learns patterns in how words follow one another, then produces answers in ordinary language. It is not a person and can make mistakes.",
      "60s":"Think of a computer program exposed to enormous amounts of writing. By learning language patterns, it can compose responses to questions, though a fluent answer is not necessarily a true one.",
      "70s":"It's a computer system trained on vast amounts of text that predicts and produces words in response to a question. It can draft explanations and dialogue, but it can also confidently say false things.",
      "80s":"Imagine a much larger descendant of language-processing computer programs. It learns patterns across enormous text collections and generates conversational replies, without being a human expert."
    }
  },
  {
    id:"six-seven", name:"6–7 meme", lead:"what the", knownSince:2025,
    concepts:[
      {label:"a repeated joke or catchphrase", words:["joke","phrase","saying","chant","catchphrase","repeated","shout","nonsense","meme"]},
      {label:"spread by young people and online videos", words:["children","kids","teen","young","school","video","recording","internet","online","share","social"]},
      {label:"has no single fixed meaning", words:["no meaning","meaningless","absurd","nonsense","in joke","inside joke","doesn't mean","does not mean","random","silly"]}
    ],
    samples:{
      old:"Imagine schoolchildren endlessly shouting a short pair of numbers because they heard it in a popular song and think the repetition funny. Their friends imitate it, often with a hand motion. The words need not mean anything; sharing the joke is the point.",
      early:"It's a silly repeated phrase from a popular song, spread among youngsters through recorded moving pictures and imitation. Saying the two numbers and doing a hand motion is the joke; it has no single clear meaning.",
      "50s":"Picture a nonsensical catchphrase from a song that schoolchildren keep repeating, like a playground fad. Short films help spread it, and the phrase is funny largely because everyone recognises it.",
      "60s":"Imagine a teen catchphrase lifted from a song, repeated in countless short recorded clips. The two numbers and a hand gesture have become a running joke without a fixed meaning.",
      "70s":"It is a youth fad: people repeat two numbers from a song, often with a hand motion, because the absurdity and shared recognition are funny. Recorded clips spread the joke quickly.",
      "80s":"Think of a schoolyard catchphrase amplified by millions of short home-style videos that people exchange electronically. The phrase is simply 'six seven'; its meaning is intentionally loose."
    }
  },
  {
    id:"ipad", name:"iPad", lead:"what an", knownSince:2010,
    concepts:[
      {label:"flat portable touch-operated screen", words:["flat","thin","screen","tablet","slate","touch","portable","glass"]},
      {label:"a computer for reading, viewing or making things", words:["computer","machine","book","read","draw","write","film","picture","video","music","work"]},
      {label:"works by tapping rather than typing", words:["finger","tap","touch","swipe","no keyboard","without keys","hand"]}
    ],
    samples:{
      old:"Imagine a thin slate that glows and changes its writing and pictures when touched. Inside it is a calculating machine that can show books, drawings, maps and moving scenes, with no chalk or ink required.",
      early:"Picture a portable electric writing slate with a glass face. Touch it with your finger and it turns pages, shows moving pictures, plays sounds and performs calculations, without a typewriter keyboard.",
      "50s":"It is a flat, portable electronic computer, shaped like a thin book. Its screen shows pictures and writing, and you control it by touching the glass instead of pressing typewriter keys.",
      "60s":"Imagine carrying a small television screen that is also a computer. You touch the screen to read books, draw, watch films and perform tasks without a keyboard.",
      "70s":"Think of a portable computer that's almost entirely a flat screen. Instead of typing commands, you tap the glass to open books, draw or watch moving pictures.",
      "80s":"It is a slim tablet computer, with a screen that responds directly to your fingers. It replaces many uses of a book, notebook, portable television and computer keyboard."
    }
  },
  {
    id:"spotify", name:"Spotify", lead:"what", knownSince:2008,
    concepts:[
      {label:"a vast catalogue of recorded music", words:["song","music","record","album","artist","recording","catalogue","library"]},
      {label:"listen on demand without owning each record", words:["choose","any time","whenever","instant","demand","not buy","without buying","access","play"]},
      {label:"a subscription or network-based service", words:["monthly","subscription","pay","service","internet","network","wireless","stream","computer","phone"]}
    ],
    samples:{
      old:"Imagine a magical music cabinet connected to an immense archive of performances. You name a tune or composer and it plays that recording immediately. You pay for access, rather than keeping a separate instrument or printed score for every piece.",
      early:"Imagine a gramophone connected by wires to a nearly limitless record library. You request a song and hear it immediately, without buying the disc; a regular fee grants access to the collection.",
      "50s":"Picture a jukebox containing millions of records. You can choose almost any song at any time, even from home. Rather than owning the discs, you pay for access to the service.",
      "60s":"It's like a vast jukebox available anywhere: choose nearly any recording and hear it at once. A regular payment grants access, instead of purchasing each record.",
      "70s":"Think of a personal radio station you control completely. You select songs and albums from a huge catalogue whenever you want, without owning the records.",
      "80s":"Imagine a music service with a gigantic catalogue that plays your chosen album immediately through a connected device. Instead of buying every cassette or record, you subscribe to access the collection."
    }
  },
  {
    id:"matcha", name:"iced salted maple oat milk matcha latte", lead:"what an", knownSince:2020,
    concepts:[
      {label:"cold powdered green tea drink", words:["green tea","tea","matcha","powder","leaf","cold","ice","iced"]},
      {label:"made with oat milk", words:["oat","grain","milk","creamy","plant"]},
      {label:"sweet maple and a little salt", words:["maple","syrup","sweet","salt","flavour","flavor"]}
    ],
    samples:{
      old:"It is a chilled drink made from finely ground green tea leaves, mixed with a milky liquid drawn from soaked oats rather than a cow. It is sweetened with syrup from a maple tree and brightened with a little salt.",
      early:"Imagine cold powdered green tea whisked with a creamy drink made from oats, not dairy. Add maple syrup for sweetness, a pinch of salt, and ice.",
      "50s":"It is a cold café drink: powdered green tea mixed with oat-based milk, sweet maple syrup, a touch of salt and ice.",
      "60s":"Picture a chilled green tea drink, creamy from blended oats rather than cow's milk, flavoured with maple syrup and a small amount of salt.",
      "70s":"It's iced powdered green tea mixed with creamy oat milk, maple syrup and a little salt. It resembles a sweet café milk drink, but without coffee.",
      "80s":"Think of an iced café drink made from powdered green tea, creamy oat milk, maple syrup and a pinch of salt."
    }
  },
  {
    id:"jira", name:"Jira", lead:"what", knownSince:2002,
    concepts:[
      {label:"tracks tasks, issues or bugs", words:["task","issue","bug","problem","job","ticket","assignment","work"]},
      {label:"assigns people and progress", words:["assign","person","team","responsib","status","progress","deadline","workflow"]},
      {label:"a shared computer-based project board", words:["board","list","computer","software","program","digital","system","shared","project","chart"]}
    ],
    samples:{
      old:"Imagine a large clerk's ledger for a workshop. Every unfinished job has a page stating who owns it, what must be fixed, and whether it is begun or complete. Everyone can consult the same magically updated ledger.",
      early:"Picture a central office board and card index showing every job, the person assigned to it and its progress. Jira is that system kept electronically, so many workers can update it together.",
      "50s":"Think of a computerised office task board. A team lists problems and assignments, records who is responsible, and marks each job as new, in progress or finished.",
      "60s":"It's a shared computer record of a project's tasks and faults. Workers assign each item to someone, track its stage, and know what still needs doing.",
      "70s":"Imagine an electronic Kanban-like board: every task has an owner, details and a status. A team uses it to follow work from request to completion.",
      "80s":"It's a networked project-management program. Teams record tasks and software defects, assign owners, set priorities and see which work is unfinished."
    }
  },
  {
    id:"double-tape", name:"double-sided tape", lead:"what", knownSince:1956,
    concepts:[
      {label:"a thin strip of material", words:["strip","ribbon","tape","thin","paper","film","band"]},
      {label:"sticky on both faces", words:["both","two sides","double","each face","either face","adhesive","sticky","glue"]},
      {label:"joins two objects invisibly", words:["join","attach","stick","hold","fix","fasten","between","hide"]}
    ],
    samples:{
      old:"Imagine a thin ribbon coated on both faces with a tacky substance, as if you had spread glue on each side of paper. Put it between two things and they stay joined without a visible nail or knot.",
      early:"It is a thin strip, like adhesive medical tape, but sticky on both faces. Place it between two pieces of paper or wood to fasten them together while hiding the strip.",
      "50s":"Picture adhesive tape with glue on both sides instead of one. It can be hidden between two surfaces to hold them together without visible paste."
    }
  },
  {
    id:"electricity", name:"electricity", lead:"what", knownSince:1882,
    concepts:[
      {label:"an invisible force that can do work", words:["force","energy","charge","current","power","flow","lightning","spark"]},
      {label:"travels through wires", words:["wire","metal","copper","conductor","cable","travel","flow"]},
      {label:"powers lights and machines in homes", words:["lamp","light","home","house","room","machine","motor","heat","work"]}
    ],
    samples:{
      old:"You have seen lightning and perhaps sparks from rubbed amber. Imagine people learning to guide a steady flow of that same electrical force through metal wires from a distant machine, so it lights rooms and drives devices in ordinary homes."
    }
  },
  {
    id:"mta", name:"MTA subway system", lead:"what the", knownSince:1904,
    concepts:[
      {label:"an underground city railway", words:["underground","beneath","under","tunnel","rail","train","track"]},
      {label:"moves many passengers around New York", words:["people","passenger","crowd","commuter","city","new york","travel","transport"]},
      {label:"runs frequently between stations", words:["station","stop","line","frequent","regular","schedule","fare","ticket","network"]}
    ],
    samples:{
      old:"Picture a web of tunnels beneath the streets of a very large city. Long carriages run along iron tracks, taking hundreds of passengers between underground stopping places. Paying a small fare lets people cross the city without crowding the roads."
    }
  },
  {
    id:"cinema", name:"movie theatre", lead:"what a", knownSince:1895,
    concepts:[
      {label:"a room for an audience", words:["room","hall","theatre","theater","audience","people","seats","crowd"]},
      {label:"shows moving pictures on a large screen", words:["picture","image","screen","moving","project","film","shadow","light"]},
      {label:"tells stories with recorded scenes", words:["story","scene","actor","record","play","performance","drama","entertain"]}
    ],
    samples:{
      old:"Imagine a theatre where instead of living actors, a bright lantern projects many pictures in rapid succession onto a large cloth. The figures seem to move and perform an entire story, which the seated audience watches together."
    }
  },
  {
    id:"football", name:"black-and-white football", lead:"what a", knownSince:1970,
    concepts:[
      {label:"a ball made for a team sport", words:["ball","round","sport","team","game","panels","leather"]},
      {label:"kicked and passed with the feet", words:["kick","foot","feet","pass","field","pitch"]},
      {label:"modern black-and-white panel design", words:["black","white","panel","patch","pattern","sewn","television","1970"]}
    ],
    samples:{
      old:"This is a rounded leather ball for a game played between two teams. People kick it toward a goal, and this newer kind has alternating black and white patches sewn into the cover so it is easy to see during a televised match.",
      early:"It is the ball used in association football, but its modern covering has distinct black and white panels, designed to be visible on television.",
      "50s":"It is an association football with the distinctive black-and-white patchwork style that became famous in the 1970 World Cup.",
      "60s":"Picture a standard football, but with alternating black and white panels arranged to show up clearly on a television broadcast."
    }
  },
  {
    id:"qr-code", name:"QR code", lead:"what a", knownSince:1994,
    concepts:[
      {label:"printed square pattern of black and white marks", words:["square","black","white","block","grid","pattern","mark","code"]},
      {label:"stores coded information", words:["information","data","message","store","contains","link","writing"]},
      {label:"a camera can read it", words:["scan","camera","read","machine","device","lens","photograph"]}
    ],
    samples:{
      old:"Picture a little square covered in carefully arranged black and white marks. The arrangement carries a message, much as ink marks on a page do, but a modern optical machine reads it at a glance rather than a person sounding out letters.",
      early:"Imagine a small black-and-white square whose pattern stands for encoded information. A machine with a camera reads the pattern and displays the message immediately.",
      "50s":"It is a two-dimensional barcode made of black and white blocks. A camera device scans the pattern to read stored information.",
      "60s":"Think of a compact square barcode. Its tiny black and white shapes encode data that a camera-equipped machine can decode.",
      "70s":"It is a scannable square pattern that encodes information, such as a message or a destination address. A camera reads it automatically.",
      "80s":"A QR code is a small square matrix of black and white marks. A camera scans the pattern and a computer decodes the stored data."
    }
  },
  {
    id:"captcha", name:"CAPTCHA", lead:"what a", knownSince:2000,
    concepts:[
      {label:"a test to distinguish people from automated programs", words:["human","person","robot","bot","real","test","prove","verify","verification"]},
      {label:"appears at an online form or website", words:["site","website","internet","online","form","screen","computer","page"]},
      {label:"makes abuse by automatic software harder", words:["automat","program","spam","attack","abuse","machine","prevent","block"]}
    ],
    samples:{
      old:"Imagine an unseen gatekeeper to an enormous shared noticeboard, who asks each visitor to perform a small task. A real person can answer, but a mechanical imitator may fail. This helps keep automatic intruders from filling the noticeboard with unwanted messages.",
      early:"Picture a small test at the entrance to an electronic noticeboard. A person is asked to recognise letters or pictures, because automatic machines might otherwise overwhelm the service.",
      "50s":"It is a brief computer-screen test designed to tell a human visitor from an automated program. It helps prevent programs from entering or submitting forms repeatedly.",
      "60s":"Imagine a computer service that asks users to solve a simple visual test before continuing. The purpose is to stop automated programs pretending to be people.",
      "70s":"A CAPTCHA is a small challenge presented on a computer screen to separate human users from automated scripts.",
      "80s":"Think of a verification test on a networked computer form. It asks for a human response to help block automated programs.",
      "90s":"It is a test on a website intended to tell whether a real person, rather than a software bot, is using the page. It may ask you to recognise distorted writing or click a checkbox."
    }
  }
];

const FUTURE_WORDS = [
  {word:"internet", year:1990}, {word:"website", year:1991},
  {word:"smartphone", year:2007}, {word:"iphone", year:2007},
  {word:"ipad", year:2010}, {word:"app", year:2008},
  {word:"wifi", year:1997}, {word:"wi-fi", year:1997},
  {word:"bluetooth", year:1999}, {word:"social media", year:2000},
  {word:"streaming", year:1995}, {word:"television", year:1930},
  {word:"tv", year:1930}, {word:"computer", year:1945},
  {word:"radio", year:1900}, {word:"telephone", year:1876},
  {word:"electric motor", year:1830}, {word:"subway", year:1863}
];

// Normalized 1:1 pictures are packed into a single lightweight WebP atlas.
// Each tile is 280px square and uses padding rather than hard cropping.
const IMAGE_ORDER = [
  "stanley","llm","six-seven","ipad",
  "spotify","matcha","jira","double-tape",
  "electricity","mta","cinema","football",
  "qr-code","captcha"
];
const atlas=new Image();
atlas.onload=()=>{ if(activeItem)renderImage(activeItem); };
atlas.onerror=()=>{ if(activeItem)renderImage(activeItem); };
atlas.src="./images/atlas.webp?v=20261119";
function renderImage(item){
  const canvas=document.getElementById("itemImage");
  const placeholder=document.getElementById("imagePlaceholder");
  canvas.setAttribute("aria-label",item.name);
  const index=IMAGE_ORDER.indexOf(item.id);
  if(index<0 || !atlas.complete || !atlas.naturalWidth){
    canvas.hidden=true;
    placeholder.hidden=false;
    return;
  }
  const ctx=canvas.getContext("2d");
  if(!ctx)return;
  const unit=64, target=280;
  ctx.clearRect(0,0,target,target);
  ctx.drawImage(atlas,(index%4)*unit,Math.floor(index/4)*unit,unit,unit,0,0,target,target);
  canvas.hidden=false;
  placeholder.hidden=true;
}

const $ = id => document.getElementById(id);
const eraEl=$("era"), promptEl=$("prompt"), startEl=$("startScreen"), feedbackEl=$("feedback");
const answerEl=$("answer"), checkEl=$("check");
let activeEra=ERAS.find(e=>e.id==="17th"), activeItem=null, started=false;

function sampleFor(item, era) {
  // The original premodern examples were written as 'old'.
  // The 1995 audience can understand the earlier 1985-era explanations.
  if(item.samples[era.id]) return item.samples[era.id];
  if(["16th","17th","18th","19th"].includes(era.id)) return item.samples.old||null;
  if(era.id==="90s") return item.samples["90s"]||item.samples["80s"]||null;
  return null;
}
function valid(item,era) {
  return Boolean(item && era && item.knownSince>era.year && sampleFor(item,era));
}
function eligible(era) { return ITEMS.filter(item=>valid(item,era)); }
function randomNext(items,previousId) {
  const different=items.filter(item=>item.id!==previousId);
  const candidates=different.length?different:items;
  return candidates[Math.floor(Math.random()*candidates.length)];
}
function refreshEras(){
  eraEl.replaceChildren();
  ERAS.forEach(era=>{
    const opt=document.createElement("option");
    opt.value=era.id; opt.textContent=era.label;
    opt.disabled=Boolean(started && activeItem && !valid(activeItem,era));
    opt.selected=era.id===activeEra.id;
    eraEl.appendChild(opt);
  });
  eraEl.value=activeEra.id;
}
function renderRound() {
  if(!activeItem)return;
  $("itemName").textContent=activeItem.name;
  $("whatLine").textContent=activeItem.lead;
  answerEl.value="";
  feedbackEl.hidden=true;
  feedbackEl.replaceChildren();
  renderImage(activeItem);
  checkEl.disabled=false;
  refreshEras();
}
function nextRound() {
  const pool=eligible(activeEra);
  if(!pool.length)return;
  activeItem=randomNext(pool,activeItem?.id||null);
  renderRound();
}
function setEra(id) {
  const found=ERAS.find(e=>e.id===id);
  if(!found)return;
  if(started && activeItem && !valid(activeItem,found))return;
  activeEra=found;
  if(started) renderRound();
  else refreshEras();
}
function startGame() {
  if(started)return;
  started=true;
  startEl.hidden=true;
  promptEl.hidden=false;
  nextRound();
}
function hasTerm(text, term){
  // Word/phrase cue matching, including common stems such as "insulat".
  const safe=term.toLowerCase().replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&");
  return new RegExp("\\b"+safe,"i").test(text);
}
function hasWholeTerm(text, term) {
  const safe=term.toLowerCase().replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&");
  return new RegExp("\\b"+safe+"\\b","i").test(text);
}
function node(tag,text,className){
  const el=document.createElement(tag);
  if(text!==undefined)el.textContent=text;
  if(className)el.className=className;
  return el;
}
function grade(){
  if(!activeItem||!activeEra)return;
  const raw=answerEl.value.trim();
  feedbackEl.hidden=false;
  feedbackEl.replaceChildren();
  if(raw.length<12){
    feedbackEl.appendChild(node("h2","Give your listener a little more to work with."));
    feedbackEl.appendChild(node("p","Try at least a sentence or two. What would someone in their time already recognise?"));
    return;
  }
  const found=activeItem.concepts.filter(c=>c.words.some(word=>hasTerm(raw,word)));
  const missing=activeItem.concepts.filter(c=>!found.includes(c));
  const outdated=[...new Set(FUTURE_WORDS
    .filter(w=>w.year>activeEra.year&&hasWholeTerm(raw,w.word))
    .map(w=>w.word))];
  feedbackEl.appendChild(node("h2",found.length===activeItem.concepts.length?"You've covered the main ideas":"Let's compare explanations"));
  feedbackEl.appendChild(node("p","The offline answer sheet spotted "+found.length+" of "+activeItem.concepts.length+" suggested ideas. This is a keyword guide, not an AI judge; great metaphors may use completely different words.","subtle"));
  if(missing.length){
    feedbackEl.appendChild(node("p","You could also explain:"));
    const ul=node("ul");
    missing.forEach(c=>ul.appendChild(node("li",c.label)));
    feedbackEl.appendChild(ul);
  } else feedbackEl.appendChild(node("p","You've touched every idea on the checklist. How well would your listener understand the analogy?"));
  if(outdated.length)feedbackEl.appendChild(node("p","Watch out for words from the future: "+outdated.join(", ")+". Your listener in "+activeEra.year+" may not know them."));
  const box=node("div",undefined,"modelanswer");
  box.appendChild(node("strong","An example for "+activeEra.year));
  box.appendChild(node("p",sampleFor(activeItem,activeEra)));
  feedbackEl.appendChild(box);
}
eraEl.addEventListener("change",()=>setEra(eraEl.value));
$("startGame").addEventListener("click",startGame);
$("next").addEventListener("click",nextRound);
checkEl.addEventListener("click",grade);
refreshEras();
