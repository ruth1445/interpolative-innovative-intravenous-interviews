from pathlib import Path

path = Path("index.html")
s = path.read_text(encoding="utf-8")

# Add a two-photo strip for Anita's subway / Seinfeld pair.
css_anchor = """.press .cols .plate.wide{
  column-span:all;margin:.4em 0 1.1em;
}
"""
pair_css = """.press .cols .plate-pair{
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
}
"""
if ".press .cols .plate-pair{" not in s:
    if css_anchor not in s:
        raise SystemExit("photo CSS anchor not found")
    s = s.replace(css_anchor, css_anchor + pair_css, 1)

pair_fn_anchor = "/* Centre Siddharth's photo plates"
pair_fn = '''function platePairHTML(p){
  const shots = (p.pair || []).map(x => `
    <span class="pairshot">
      <img src="${esc(x.img)}" alt="${esc(x.alt||'')}" loading="lazy">
    </span>`).join('');
  return `<figure class="plate-pair">${shots}</figure>`;
}

'''
if "function platePairHTML(p)" not in s:
    if pair_fn_anchor not in s:
        raise SystemExit("plate function anchor not found")
    s = s.replace(pair_fn_anchor, pair_fn + pair_fn_anchor, 1)

old_insert = "0, plateHTML(p)));"
new_insert = "0, p.pair ? platePairHTML(p) : plateHTML(p)));"
if new_insert not in s:
    if old_insert not in s:
        raise SystemExit("press plate insertion anchor not found")
    s = s.replace(old_insert, new_insert, 1)

index_anchor = '''      <nav class="name-index" aria-label="people">
                <span class="name-oval soon" aria-disabled="true">ashley</span>'''
index_with_anita = '''      <nav class="name-index" aria-label="people">
                <a class="name-oval" href="#/p/anita-wong">anita wong</a>
                <span class="name-oval soon" aria-disabled="true">ashley</span>'''
if '#/p/anita-wong' not in s:
    if index_anchor not in s:
        raise SystemExit("index anchor not found")
    s = s.replace(index_anchor, index_with_anita, 1)

anita = r'''  { slug:"anita-wong", named:true, name:"Anita Wong",
    shape:"cosmos", colour:8,
    press:{
      kicker:'',
      shout:'Anita Wong',
      plates:{ of:[
        { img:'anita-portrait.jpg', ar:1.507, after:1, fx:50, fy:50, w:76, wide:true,
          alt:'Anita Wong with a friend' },
        { pair:[
            { img:'anita-subway.jpg', alt:'New York City subway interior' },
            { img:'anita-seinfeld.jpg', alt:'Seinfeld subway scene' }
          ], after:4 }
      ]}
    },
    story:[
      { p:`A day before I interviewed Anita, I read a note on Substack that said the best souvenir is probably realizing you want something different from your life once you get home. This was a delightful coincidence considering the very thing that had pulled me toward Anita was her attitude towards travel. I met her on a very hot day in Manhattan. Walking in the heat amidst the huge crowds had sapped my strength and maybe because of that, I was craving a good conversation. One sign of a really good one is how it uplifts you afterward, especially if you were feeling drained before. Striking up a conversation with Anita had precisely that effect on me.` },

      { p:`A lot of the people I meet in NYC are actually from SF. So when Anita said she was just visiting, I assumed she too, was from California. Turns out she wasn&rsquo;t even from America. She was visiting from Toronto, Canada and she was in NYC &ldquo;for the vibes&rdquo;. I instantly knew that I was in the presence of someone who is very aware of her free will and will use it however and whenever she can. So two nights ago, we were in a Zoom meeting; just two girls in their PJs on either side of the screen yapping away.` },

      { p:`<strong>&ldquo;I went to New York because I needed to actually know who I am as a person.&rdquo;</strong>` },

      { p:`I told her about the Substack note to learn what she&rsquo;d taken from her own trips. She said travel reminds her of who she really is. So much of how we act and react depends on who&rsquo;s around us and we spend so much time around other people that we might forget who we truly are. Thankfully, there are a lot of ways to find that out. For Anita it was a solo trip to New York. On these trips she remembers that she can take care of herself first, be attuned to what she needs, what she actually wants to do, what she likes and doesn&rsquo;t like. Her first trip to NYC was when she was 19 and it truly changed her life. She realized how much she loves people and connections. She grew up in Toronto and I grew up in Riyadh, both busy and beautiful cities. But we agreed that New York has a soul unlike other cities, and that it&rsquo;s a great place to watch people. I rode the L for the first time last week and every third person had a book which they promptly put down one station before their stop. One woman balanced her groceries in a worn out LEGO bag in one hand and a big brown suitcase in the other. She then plopped into the seat beside a man holding nothing but a book and his phone. People watching can be fun, but talking to them can be even more entertaining.` },

      { p:`<strong>&ldquo;Meeting certain people just makes you realize, my god, I love people.&rdquo;</strong>` },

      { p:`Anita met a girl at the Aloe Run Club who told her to come to Brooklyn the next day for yoga. Anita just up and went. The girl introduced her to two younger sisters, and afterward they took her out for coffee and donuts. They felt like older siblings she&rsquo;d known them for years. I could list similar experiences of my own involving the loveliest people and the most stimulating conversations.` },

      { p:`She told me her taste in music is very basic. She is not basic. She&rsquo;s an Asian woman in Canada who loves country music, a certified Bollywood dance instructor, a sports instructor, and she has the personality of a grand national park. She also runs headfirst at things that scare her. For her twentieth birthday, she ran twenty kilometers. For her nineteenth, she took herself to a restaurant alone and sat through the waiters&rsquo; stares. If she has something nice to say about someone, you better believe she will find a way to say it. Not surprisingly, people that get her attention are the genuinely passionate kind. about something outside the mainstream &mdash; planets, music, whatever it is. You can tell within the first few seconds of talking to someone. Conversation is an art, and not many people can do it. She goes to an engineering school where most people are shy, and the ones who aren&rsquo;t shy are incredibly talkative but don&rsquo;t know how to share a conversation. I&rsquo;ve become monomaniacal about what I consume. I&rsquo;m scared of the wrong food, literature, media, and conversation getting into my system. While I cannot control every single conversation I have, I can certainly curate who I talk to.` },

      { p:`So I&rsquo;m drawn to people who go looking for things and let those things change how they think. Anita can talk about everything she&rsquo;s done and still listen closely to yours. She asks good questions. She makes people feel heard.` },

      { p:`<strong>&ldquo;I think my biggest passion project right now is myself.&rdquo;</strong>` },

      { p:`What a wonderful way to look at it. Working on yourself is truly underrated.` },

      { p:`She is also very passionate about waste management. She could talk about it for hours. got into it around grade eleven and never got out. How different countries handle it, why North American practice is so bad, and how quickly that becomes a question about race &mdash; which neighborhoods get chosen as landfills, whose communities end up next to the places that burn things.` },

      { p:`I&rsquo;ll leave you with some of the life hacks she swears by:` },

      { p:`She sets a weekly running goal, usually twenty to thirty kilometers, and it&rsquo;s hard, but she knows she&rsquo;ll feel better once she&rsquo;s out. Intentional movement in the morning is one of her cheat codes.` },

      { p:`She has to read before bed, something that makes her happy or calm &mdash; self-help, or a romance novel, because those always end well.` },

      { p:`Fridays are for self-care.` },

      { p:`She loves journaling and writing music.` }
    ]
  },
'''
siddharth_anchor = '  { slug:"siddharth", named:true, name:"Siddharth",'
if 'slug:"anita-wong"' not in s:
    if siddharth_anchor not in s:
        raise SystemExit("Siddharth anchor not found")
    s = s.replace(siddharth_anchor, anita + siddharth_anchor, 1)

path.write_text(s, encoding="utf-8")
print("Anita Wong draft patched into index.html")
