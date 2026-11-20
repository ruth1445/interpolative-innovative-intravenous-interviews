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
// Images come directly from the existing high-resolution repository files.
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
    id:"football", name:"soccer ball", lead:"what a", knownSince:1970,
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
    id:"dating-profile", name:"dating profile", lead:"what a", knownSince:2012,
    concepts:[
      {label:"a brief personal introduction with photos", words:["profile","portrait","photo","picture","name","description","bio","introduc","self"]},
      {label:"intended to find a romantic partner", words:["date","dating","romance","romantic","love","partner","relationship","suitor","court","marry","marriage"]},
      {label:"people browse and mutually choose whom to contact", words:["choose","select","match","mutual","swipe","like","interest","browse","message","contact","connect","screen","app"]}
    ],
    samples:{
      old:"Imagine a public book of short introductions by people seeking courtship. Each entry contains a portrait and a few words about the person; others look through the book and, when interest is mutual, the two can begin exchanging messages.",
      early:"Think of a classified personal advertisement with a photograph and description, collected in a huge catalogue. People can look through these introductions and signal interest to begin a conversation.",
      "50s":"Like the lonely-hearts column in a newspaper, but each entry has a photograph and short biography. People choose whom they would like to meet, and a reply starts a conversation.",
      "60s":"Imagine thousands of personal advertisements with portraits, sorted into a catalogue. You look through them to find someone you might date, and the other person can respond if interested.",
      "70s":"It is a personal dating advertisement with photos and a short description, displayed in a large electronic catalogue. People browse it and indicate mutual interest.",
      "80s":"Picture a computer-based dating service: people write a short biography, add photographs, and look through other people's entries. When two people are interested, they can send messages.",
      "90s":"Think of an online dating listing with a photograph and personal details, but built for a phone screen where people quickly choose whom they would like to meet."
    }
  },
  {
    id:"noise-cancelling-headphones", name:"noise-cancelling headphones", lead:"what a pair of", knownSince:2000,
    concepts:[
      {label:"worn over or in the ears", words:["ear","ears","head","headphone","headphones","wear","worn","cup","earpiece"]},
      {label:"reduces surrounding noise", words:["noise","sound","quiet","silence","cancel","block","reduce","drown","hush","background"]},
      {label:"uses a counteracting sound wave", words:["opposite","counter","reverse","wave","vibrat","microphone","signal","interference","measure","electronic","cancel"]}
    ],
    samples:{
      old:"Imagine two soft cups worn over the ears to make the world quieter. A small mechanism hears the unwanted rumble and produces an opposing vibration, so much of that rumble fades before you hear it.",
      early:"These are earphones fitted with a device that detects nearby noise and produces opposing sound waves. The two sounds partly cancel, leaving the listener in greater quiet.",
      "50s":"Imagine a pair of earphones with microphones listening to the surrounding noise. Electronics generate a matching sound wave in reverse, making a steady engine hum much quieter.",
      "60s":"They are headphones that measure background sound and play an opposing signal into the ear, cancelling much of the steady noise.",
      "70s":"Think of headphones with a small microphone and electronic circuit. It picks up outside noise and makes an opposing sound wave that reduces what you hear.",
      "80s":"These headphones use microphones and electronic processing to produce sound out of phase with surrounding noise, cancelling much of an aircraft or engine's low rumble.",
      "90s":"Like specialised aviation noise-cancelling headsets, but made for everyday listening. Small microphones detect noise and electronics produce an opposing sound wave."
    }
  },
  {
    id:"suffrage-movement", name:"women's suffrage movement", lead:"what the", knownSince:1867,
    concepts:[
      {label:"women demanding political participation", words:["women","woman","female","ladies","girls"]},
      {label:"campaign for the right to vote", words:["vote","voting","ballot","elect","suffrag","representation","choose leaders"]},
      {label:"organised protests and petitions to change the law", words:["movement","march","protest","petition","campaign","organis","organiz","rally","rights","laws","government","parliament"]}
    ],
    samples:{
      old:"It is an organised campaign by women who demand the right to choose their nation's lawmakers, a privilege often reserved for men. They gather signatures, petition those in power, speak publicly and march so that the law will recognise their votes."
    }
  },
  {
    id:"vinyl-record", name:"vinyl record", lead:"what a", knownSince:1948,
    concepts:[
      {label:"a flat round disc marked with grooves", words:["disc","disk","round","circle","flat","black","groove","spiral","record","plate"]},
      {label:"spins as a needle traces its surface", words:["spin","turn","rotat","needle","stylus","track","player","turntable","revolv"]},
      {label:"stores recorded music or voices as sound", words:["music","song","voice","sound","sing","instrument","recording","vibrat","hear","play"]}
    ],
    samples:{
      old:"Imagine a flat round plate with a very fine spiral line carved into its surface. As the plate turns, a delicate needle follows that line and makes a machine reproduce the music or voice that was captured in it.",
      early:"It works rather like a gramophone record, but is made from a different, flexible material with finer grooves. A needle follows the spinning grooves to reproduce recorded music, often for much longer on each side."
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

// Historical vocabulary guard, informed by the approach in https://ht.ac.uk/guide/.
// "Familiar by" is an approximate year when the *modern sense or reference*
// would be recognizable, not the first appearance of the spelling.
// The Historical Thesaurus dates WORD SENSES, not conversational frequency.
// Its database is copyright-protected and is not reproduced or scraped here.
// This small hand-curated list is intentionally conservative. It cannot
// validate every word or judge whether a creative metaphor is historically apt.
const HISTORICAL_TERMS = [
  // Transport, entertainment and communication.
  {label:"steam engine", familiarBy:1750, forms:["steam engine","steam engines"]},
  {label:"train", familiarBy:1830, forms:["train","trains","railway","railroads","railroad"]},
  {label:"photograph", familiarBy:1850, forms:["photograph","photographs","photography","photographic"]},
  {label:"telegraph", familiarBy:1850, forms:["telegraph","telegraphs"]},
  {label:"subway", familiarBy:1870, forms:["subway","subways","underground railway"]},
  {label:"telephone", familiarBy:1890, forms:["telephone","telephones"]},
  {label:"electric light", familiarBy:1890, forms:["electric light","electric lights","light bulb","lightbulb"]},
  {label:"gramophone", familiarBy:1900, forms:["gramophone","gramophones","phonograph","phonographs"]},
  {label:"automobile", familiarBy:1900, forms:["automobile","automobiles","motorcar","motorcars"]},
  {label:"cinema", familiarBy:1900, forms:["cinema","movie","movies","motion picture","motion pictures"]},
  {label:"airplane", familiarBy:1910, forms:["airplane","airplanes","aeroplane","aeroplanes"]},
  {label:"radio", familiarBy:1920, forms:["radio","radios","radio broadcast","radio broadcasts"]},
  {label:"robot", familiarBy:1930, forms:["robot","robots"]},
  {label:"television", familiarBy:1950, forms:["television","tv","tvs","televisions"]},
  {label:"computer", familiarBy:1950, forms:["computer","computers","electronic computer","electronic computers"], pastMeaning:"someone who performed calculations", pastMeaningFrom:1613},
  {label:"computer program", familiarBy:1960, forms:["computer program","computer programs","programming language","programming languages"]},
  {label:"video", familiarBy:1970, forms:["video","videos","videotape","videotapes"]},
  {label:"artificial intelligence", familiarBy:1960, forms:["artificial intelligence"]},
  {label:"touchscreen", familiarBy:1980, forms:["touchscreen","touchscreens","touch screen","touch screens"]},
  {label:"tablet", familiarBy:2005, forms:["tablet","tablets"], modernOnlyWith:["screen","electronic","digital","touch","computer","tap","swipe"], pastMeaning:"a small slab, often used for writing"},
  {label:"mouse", familiarBy:1980, forms:["mouse","mice"], modernOnlyWith:["cursor","click","clicking","pointer","screen","computer","keyboard"], pastMeaning:"a small rodent"},
  {label:"email", familiarBy:1990, forms:["email","e-mail","emails","electronic mail"]},
  {label:"mobile phone", familiarBy:1990, forms:["mobile phone","mobile phones","cell phone","cell phones","cellphone","cellphones"]},
  {label:"internet", familiarBy:1995, forms:["internet","world wide web"]},
  {label:"website", familiarBy:1995, forms:["website","websites","web site","web sites","webpage","webpages"]},
  {label:"QR code", familiarBy:2000, forms:["qr code","qr codes"]},
  {label:"Wi-Fi", familiarBy:2000, forms:["wi-fi","wifi","wireless internet"]},
  {label:"Bluetooth", familiarBy:2000, forms:["bluetooth"]},
  {label:"search engine", familiarBy:2000, forms:["search engine","search engines"]},
  {label:"social media", familiarBy:2005, forms:["social media","social network","social networking"]},
  {label:"streaming", familiarBy:2005, forms:["streaming","streamed","stream music","streaming music"], modernOnlyWith:["music","song","songs","video","film","movie","album","online","internet","service","radio"], pastMeaning:"flowing or moving in a continuous current"},
  {label:"podcast", familiarBy:2005, forms:["podcast","podcasts"]},
  {label:"smartphone", familiarBy:2010, forms:["smartphone","smartphones","smart phone","smart phones"]},
  {label:"app", familiarBy:2010, forms:["app","apps","mobile app","mobile apps"]},
  {label:"iPhone", familiarBy:2010, forms:["iphone","iphones"]},
  {label:"iPad", familiarBy:2010, forms:["ipad","ipads"]},
  {label:"meme", familiarBy:2000, forms:["meme","memes","internet meme"]},
  {label:"CAPTCHA", familiarBy:2000, forms:["captcha","recaptcha"]},
  {label:"Jira", familiarBy:2005, forms:["jira"]},
  {label:"Spotify", familiarBy:2010, forms:["spotify"]},
  {label:"Google", familiarBy:2000, forms:["google search","google maps","googling"]},
  {label:"YouTube", familiarBy:2007, forms:["youtube"]},
  {label:"Instagram", familiarBy:2012, forms:["instagram"]},
  {label:"MetroCard", familiarBy:1995, forms:["metrocard","metrocards"]},
  {label:"MTA", familiarBy:1970, forms:["mta"]},
  {label:"modern plastic bottle", familiarBy:1950, forms:["plastic bottle","plastic bottles"]},
  {label:"ChatGPT", familiarBy:2023, forms:["chatgpt"]},
  {label:"TikTok", familiarBy:2020, forms:["tiktok"]},
  {label:"dating app", familiarBy:2012, forms:["dating app","dating apps","dating profile","dating profiles"]},
  {label:"noise-cancelling headphones", familiarBy:2000, forms:["noise-cancelling headphones","noise canceling headphones","noise cancelling headphones"]},
  {label:"vinyl record", familiarBy:1950, forms:["vinyl record","vinyl records"]}
];

// Match whole terms and explain just the first relevant historical issue.
// For older words with multiple meanings, require digital context before
// assuming the player intended the newer technological sense.
function historicalFlags(text, era) {
  const found=[];
  for(const entry of HISTORICAL_TERMS){
    if(era.year >= entry.familiarBy)continue;
    const matched=entry.forms.find(form=>hasWholeTerm(text,form));
    if(!matched)continue;
    if(entry.modernOnlyWith && !entry.modernOnlyWith.some(word=>hasWholeTerm(text,word)))continue;
    const offset=text.toLowerCase().indexOf(matched.toLowerCase());
    found.push({entry,offset:offset<0?Number.MAX_SAFE_INTEGER:offset});
  }
  return found.sort((a,b)=>a.offset-b.offset).map(item=>item.entry);
}
function historicalNote(entry,era){
  const when=era.label.toLowerCase();
  // A computer was a person who calculated in early modern English.
  // Before the first documented "computer" sense, don't assert that
  // the word already had that meaning.
  if(entry.pastMeaning && era.year >= (entry.pastMeaningFrom||0)){
    return '"' + entry.label + '" meant ' + entry.pastMeaning + ' in the ' + when + '.';
  }
  const articles={
    "internet":"the internet",
    "steam engine":"a steam engine",
    "train":"a train",
    "photograph":"a photograph",
    "telegraph":"a telegraph",
    "subway":"a subway",
    "telephone":"a telephone",
    "electric light":"electric lighting",
    "gramophone":"a gramophone",
    "automobile":"an automobile",
    "cinema":"cinema",
    "airplane":"an airplane",
    "radio":"the radio",
    "robot":"a robot",
    "television":"television",
    "computer":"an electronic computer",
    "computer program":"a computer program",
    "video":"video recordings",
    "artificial intelligence":"artificial intelligence",
    "touchscreen":"a touchscreen",
    "email":"email",
    "mobile phone":"a mobile phone",
    "website":"a website",
    "QR code":"a QR code",
    "Wi-Fi":"Wi-Fi",
    "Bluetooth":"Bluetooth",
    "search engine":"a search engine",
    "social media":"social media",
    "streaming":"streaming media",
    "podcast":"a podcast",
    "smartphone":"a smartphone",
    "app":"an app",
    "iPhone":"an iPhone",
    "iPad":"an iPad",
    "tablet":"a touchscreen tablet",
    "mouse":"a computer mouse",
    "meme":"an internet meme",
    "CAPTCHA":"a CAPTCHA",
    "Jira":"Jira",
    "Spotify":"Spotify",
    "Google":"Google",
    "YouTube":"YouTube",
    "Instagram":"Instagram",
    "MetroCard":"a MetroCard",
    "MTA":"the MTA",
    "modern plastic bottle":"a plastic bottle",
    "ChatGPT":"ChatGPT",
    "TikTok":"TikTok",
    "dating app":"a dating app",
    "noise-cancelling headphones":"noise-cancelling headphones",
    "vinyl record":"a vinyl record"
  };
  const phrase=articles[entry.label]||entry.label;
  return "People in the " + when + " wouldn't know what " + phrase + " is.";
}

// Display original full-resolution photos in equal-size frames without cropping.
const IMAGE_PATHS = {
  "stanley":"../pictures/stanley.jpg",
  "llm":"../pictures/CHATGPT PNG.jpg",
  "six-seven":"../pictures/67.jpg",
  "ipad":"../pictures/ipad.jpg",
  "spotify":"../pictures/download spotify icon green logo.jpg",
  "matcha":"../matcha.jpg",
  "jira":"../pictures/Jira_ Project Management for the AI Era.jpg",
  "double-tape":"../pictures/Scotch® Double Sided Tape, 3ct_.jpg",
  "electricity":"../pictures/Electricity.jpg",
  "mta":"../pictures/next stop_..",
  "cinema":"../pictures/ theatre.jpg",
  "football":"../pictures/Soccer.jpg",
  "qr-code":"../pictures/QR.jpg",
  "captcha":"../CAPTCHA.jpg",
  "dating-profile":"../pictures/dating_app.jpg",
  "noise-cancelling-headphones":"../pictures/headphones.jpg",
  "suffrage-movement":"../pictures/suffrage.jpg",
  "vinyl-record":"../pictures/vinyl.jpg"
};
function renderImage(item){
  const image=document.getElementById("itemImage");
  const placeholder=document.getElementById("imagePlaceholder");
  image.hidden=true;
  placeholder.hidden=false;
  image.alt=item.name;
  image.onload=()=>{
    if(activeItem===item){
      image.hidden=false;
      placeholder.hidden=true;
    }
  };
  image.onerror=()=>{
    if(activeItem===item){
      image.hidden=true;
      placeholder.hidden=false;
    }
  };
  image.src=encodeURI(IMAGE_PATHS[item.id]||"");
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
  $("next").disabled=true;
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
  const text=answerEl.value.trim();
  const matched=activeItem.concepts.filter(concept=>
    concept.words.some(word=>hasTerm(text,word))
  ).length;
  const words=(text.match(/\b[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?\b/gu)||[]).length;
  const flags=historicalFlags(text,activeEra);
  // 1 point to start; +2 per concept (up to 6); +1 for 12+ words;
  // +1 for 28+ words; +1 when all 3 concepts are covered.
  // If modern terms are found, the maximum is 7 until corrected.
  const rawScore=Math.min(10,1+matched*2+
    (words>=12?1:0)+(words>=28?1:0)+(matched===3?1:0));
  const score=flags.length?Math.min(7,rawScore):rawScore;
  const message=score<=5?"explanation sucks. try again":
    score<=7?"mid. try again":
    score===8?"not bad":"excellent";
  feedbackEl.replaceChildren();
  feedbackEl.appendChild(node("p",score+"/10","score"));
  const note=flags.length?historicalNote(flags[0],activeEra):"";
  feedbackEl.appendChild(node("p",message,"verdict"));
  if(note) feedbackEl.appendChild(node("p",note,"verdict historical-note"));
  feedbackEl.hidden=false;
  $("next").disabled=score<8;
}
eraEl.addEventListener("change",()=>setEra(eraEl.value));
$("startGame").addEventListener("click",startGame);
$("next").addEventListener("click",nextRound);
checkEl.addEventListener("click",grade);
answerEl.addEventListener("input",()=>{
  // Any edited response needs fresh evaluation to unlock the next round.
  feedbackEl.hidden=true;
  $("next").disabled=true;
});
refreshEras();
