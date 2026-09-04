from pathlib import Path

path = Path('index.html')
src = path.read_text(encoding='utf-8')

start = src.index('  { slug:"anita-wong", named:true, name:"Anita Wong",')
end = src.index('  { slug:"siddharth", named:true, name:"Siddharth",', start)

new_anita = r'''  { slug:"anita-wong", named:true, name:"Anita Wong",
    shape:"cosmos", colour:8,
    press:{
      /* her own sentence, split the way the page splits: the set-up small,
         the landing big. */
      kicker:'the medicine that is',
      shout :'human connection',
      plates:{ of:[
        { img:'anita-portrait.jpg?v=5', ar:1.508, after:2, fx:50, fy:50,
          alt:'Two women seated together at an indoor event' },
        /* directly under the paragraph that ends on the LEGO bag and the
           brown suitcase */
        { pair:[
            { img:'anita-subway.jpg?v=5', ar:0.663, alt:'New York City subway interior' },
            { img:'anita-seinfeld.jpg?v=5', ar:1.253, alt:'Seinfeld subway scene' }
          ], after:4,
          cap:'<b>Left</b>: The 1 train <b>Right</b>: The Subway (Seinfeld, 1992) My favourite Seinfeld scenes are the ones involving subway travel!' }
      ]}
    },
    story:[
      { p:`A day before I interviewed Anita, I read a note on Substack that said the best souvenir is probably realizing you want something different from your life once you get home. This was a delightful coincidence considering the very thing that had pulled me toward Anita was her attitude towards travel. I met her on a very hot day in Manhattan where I had walked many miles under the scorching sun. It sapped all my strength and yet, I was craving a good conversation. One sign of a really good one is how it uplifts you afterward, especially if you were feeling drained before. Striking up a conversation with Anita had precisely that effect on me.` },

      { p:`A lot of the people I meet in NYC are actually from SF. So when Anita said she was just visiting, I assumed she too, was from California. Turns out she wasn&rsquo;t even from America. She was visiting from Toronto, Canada and she was in NYC &ldquo;for the vibes&rdquo;. I instantly knew that I was in the presence of someone who was very aware of her free will and would use it however and whenever she can. So two nights ago, we set up a virtual meeting; just two girls in their PJs on either side of the screen yapping away.` },

      { class:'pull', p:`&ldquo;I went to New York because I needed to actually know who I am as a person.&rdquo;` },

      { p:`I told her about the Substack note to learn what she&rsquo;d taken from her own trips. She said traveling, especially solo, reminds her of who she really is. So much of how we act and react depends on who is watching. Spend next to no time by ourselves and we might forget who we truly are. Thankfully, there are a lot of ways to find that out. For Anita it was a solo trip to New York. On these trips she remembers that she can take care of herself first, be attuned to what she needs, what she likes, and doesn&rsquo;t like. Her first trip to NYC was when she was 19 and it truly changed her life. She realized how much she loves people and connections. She grew up in Toronto and I grew up in Riyadh, both busy and beautiful cities. But we agreed that New York has a soul unlike other cities, and that it&rsquo;s a great place to people watch. I rode the L for the first time last week and every third person had a book which they promptly put down one station before their stop. One woman balanced a worn out LEGO bag bursting at the seams in one hand and a big brown suitcase in the other. She then plopped into the seat beside a man holding nothing but a book and his phone. People watching can be fun, but talking to them can be even more entertaining.` },

      { class:'pull', p:`&ldquo;Meeting certain people just makes you realize, my god, I love people.&rdquo;` },

      { p:`Anita met a girl at the Aloe Run Club who invited her to Brooklyn the next day for yoga. She was also introduced to her two younger sisters, and afterward they took her out for coffee and donuts. They felt like older siblings she&rsquo;d known for years. I realized I too, could list many such experiences of my own involving the loveliest people and the most stimulating conversations.` },

      { p:`When asked about her taste in music, she called herself basic. Far from it. She&rsquo;s an Asian woman from Canada who loves country music, a certified Bollywood dance instructor, a fitness instructor, and she has the personality of a bright celestial body. She also runs headfirst at things that scare her. For her twentieth birthday, she ran twenty kilometers. For her nineteenth, she took herself to a restaurant alone and sat through the waiters&rsquo; stares. If she has something nice to say about someone, you better believe she will find a way to say it. Not surprisingly, people that get her attention are the genuinely passionate kind. She also appreciates a good conversationalist; someone who can listen just as much as they talk. How poetic that she is the very embodiment of the kind of people she admires. I also have become monomaniacal about who I spend time with and what I consume. I am terrified at the thought of the wrong food, literature, media, and conversations getting into my system. While I cannot control every single conversation I have, I can certainly curate who I talk to. I enjoy conversing with people who are open to learn and experience all they can and let it change how they think.` },

      { class:'pull', p:`&ldquo;I think my biggest passion project right now is myself.&rdquo;` },

      { p:`I am drawn like a moth to a flame to people who understand that we do not control what we are born into but are largely responsible for the person we become. The most intense people I know are constantly reinventing themselves and tinkering with ideas till they&rsquo;re bored of it. They dare to go knee deep, especially when there&rsquo;s no gain, monetary or otherwise, involved, seeking only to learn. This week, one of my very wise friends texted me thus: &ldquo;The pleasure of learning without objective or timeline is unparalleled.&rdquo; I could not have summed it better myself. Anita is extremely passionate about waste management and could talk about it for hours. She told me about how different countries handle it, why the North American practice is so bad, which neighborhoods get chosen as landfills, and whose communities end up next to the places that burn things. It didn&rsquo;t matter that I know next to nothing about waste management. Passion is contagious and will infect you too. You must simply allow it to.` },

      { p:`I&rsquo;ll leave you with some of the life hacks/advice she swears by:` },

      { list:{ title:'Life hacks / advice', items:[
        `She sets a weekly running goal, usually twenty to thirty kilometers, and it&rsquo;s hard, but she knows she&rsquo;ll feel better once she&rsquo;s out. Intentional movement is one of her cheat codes.`,
        `She has to read before bed. Bonus points if it is something that makes her happy or calm.`,
        `Fridays are dedicated to self-care. For her, that could look like going outside and journaling or writing music or even going to a cafe.`,
        `And finally, she reminded me that we are not guaranteed tomorrow. Time is a luxury that we must make the most of (I write this line 3 hours into staring at this article draft as the fifteenth <em>The Groovy Nobody</em> track (for inspiration!) drones on in the background).`
      ]}}
    ]
  },
'''

src = src[:start] + new_anita + src[end:]

quote_anchor = '.press .cols p.pull strong{font-weight:inherit}\n'
mobile_quotes = '''.press .cols p.pull strong{font-weight:inherit}\n@media(max-width:560px){\n  .press .cols p.pull{\n    font-size:clamp(20px,5.4vw,24px);\n    line-height:1.12;\n  }\n}\n'''
if quote_anchor not in src:
    raise SystemExit('pull quote CSS anchor not found')
src = src.replace(quote_anchor, mobile_quotes, 1)

# If this browser has an older locally-saved Anita draft, prefer the newly
# published final story once. Future edits will then save normally again.
load_anchor = "      if(p.slug === 'siddharth'){\n"
if load_anchor in src and "FINAL_ANITA_MARKER" not in src:
    migration = '''      if(p.slug === 'anita-wong'){
        const FINAL_ANITA_MARKER = 'The pleasure of learning without objective or timeline is unparalleled.';
        if(!JSON.stringify(saved).includes(FINAL_ANITA_MARKER)){
          try{ localStorage.removeItem(keyFor(p)); }catch(e){}
          return JSON.parse(JSON.stringify(p.story || []));
        }
      }
'''
    src = src.replace(load_anchor, migration + load_anchor, 1)

path.write_text(src, encoding='utf-8')
