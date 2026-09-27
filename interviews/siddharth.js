/* Interview/profile data for siddharth. Keep presentation logic in js/, not here. */
export default { slug:"siddharth", named:true, name:"Siddharth",
    shape:"daisy", colour:17,

    /* Set this and the page comes out as a magazine spread instead: the
       script line sets it up, the red shout lands it. Use <span class="brk">
       to break the shout across lines. */
    press:{
      kicker:'&ldquo;I wish <span class="rd">AI</span> would just',
      shout :'take my job already!&rdquo;',
      plates:{ of:[
        { img:'pictures/siddharth-rooftop.jpg', ar:0.75, after:2, fx:32, fy:45, w:88,
          alt:'Siddharth leaning on the parapet of the Verci rooftop, the Met Life tower and the Empire State behind him',
          note:'siddharth peeking down<br>from verci&rsquo;s rooftop',
          nx:12, ny:32,            /* lowered so the writing meets the arrow tail */
          ax:15, ay:41,            /* the line leaves the writing here */
          tx:12, ty:57 },
        { img:'pictures/siddharth-metrograph.jpg', ar:0.9, after:8, fx:50, fy:42, w:88,
          alt:'The Sound of Things on screen at the Metrograph',
          cap:'a surprisingly empty metrograph theatre' }
      ]}
    },

    /* ------------------------------------------------------------------
       THE WRITING. Each { p:`…` } is one paragraph. Add one, delete one,
       reorder them — the page follows.

       Inside a paragraph you can use:
         <em>slanted</em>          <strong>heavy</strong>
         <br>                      a line break without a new paragraph
         <span class="red">…</span>      the red of the notes
         <span class="green">…</span>    the sage green
         <span class="quiet">…</span>    faded back
         <span style="color:#7A4E9B">…</span>   anything else

       { img:'file.jpg', note:'…', at:'52%' } floats a picture to the right
       from wherever you put it, and the writing wraps around it. `note` is
       the handwritten red caption, `at` is how far down the picture the
       arrow points.
       ------------------------------------------------------------------ */
    story:[
      { img:'pictures/siddharth-rooftop.jpg',
        alt:'Siddharth leaning on the parapet of the Verci rooftop, the Met Life tower and the Empire State behind him',
        note:'on the verci rooftop, looking down',
        side:'right', ratio:'4/5', fx:34, fy:58, zoom:1,
        nx:-34, ny:58, nrot:-4,
        tx:11, ty:65 },

      { p:`Siddharth has said this twice now. Once on Twitter, once to me on a
           rooftop in New York City. I met plenty of design engineers and product
           designers in nyc this summer and heard many such hot takes. Siddharth, however, is not limited to such corporate labels.
           <em>Designer</em> is a roomier title. I think even that&rsquo;s too small for
           someone with his appetite for life.` },

      { p:`I first met him at Verci, where he presented <em><a href="https://itsiddharth.design/calculatedcamouflage" target="_blank" rel="noopener">Calculated
           Camouflage</a></em>. Exactly a week later, I was back in Verci, at roughly
           the same time, except now we were on the rooftop and I was trying to
           pick his brain. Here's everything I learnt from him.` },

      { p:`I&rsquo;d been trying to design more myself but no two of my pieces
           seemed like they came from the same person. Siddharth&rsquo;s solution
           was to simply keep making more things. One of his recurring exercises
           is to put on a movie or show he knows well in the background, sometimes
           <em>Arrival</em>, sometimes <em>Suits</em>, while he makes a poster.
           He&rsquo;s made enough of them to maybe have his own catalogue by now.` },

      { p:`The more you create, the more data you own to notice patterns in. You
           can clearly see what works for you and how your personal style
           progresses. He challenged himself to design his <a href="https://www.timecapsule.co.in" target="_blank" rel="noopener">blog</a> within the theme
           he picked for it. He does not particularly believe in thinking outside
           the box. He would much rather define the box and sit inside it. I liked
           this a lot because it made me realize how much I was asking from myself
           by trying to create on a blank screen each time. Having constraints
           actually allows for more creative freedom. Hopefully, I let this
           philosophy bleed into all aspects of my life as I keep creating every
           day.` },

      { p:`A delightful consequence of doing the same thing every day is that it
           gives you these little skills you might not initially have expected to
           gain. Siddharth has given so much of his time to creating that now, he
           can easily tell when gaps are uneven or if something is off-center.
           Don&rsquo;t even get him started on lighting that is too orange or too
           white. His eyes are far too trained to entertain visual imbalance.
           Additionally, he might be the first designer I have met who did not
           diss Canva. He might also be the first designer I&rsquo;ve spoken to
           that didn&rsquo;t feel strongly about limiting screen time. Social media
           is rife with inspiration but only if you put in the work to make it so.
           He abuses the mute button on anything that displeases him. His feeds are
           tuned to a T and even his saved posts get checked and cleaned out
           regularly. That's quite the alternative to guilt tripping 
           yourself and quitting cold turkey.` },

      { p:`I have been obsessed with understanding what constant building
           does to the brain. The process of creating is far more thrilling than
           the final product. For Siddharth, the process is sacred. The finished
           product belongs to everyone for it is now theirs to shower with awe,
           jest, ridicule, and anything else their heart desires. But only the
           process is all his. Even letting someone else too far into the process
           can feel intrusive. Posting the finished thing, on the other hand,
           brings him closure because once it is out there, that&rsquo;s its final
           form. It saves himself any nitpicking and he can now move on to other work.` },

      { p:`What we feel in our minds and hearts may largely inspire what we create
           with our hands. Siddharth says the massiveness of huge canvases, sculptures, 
           and giant movie screens all leave him with a visceral feeling. I admitted 
           how I love feeling small in front of big buildings too. I think the primary 
           feeling evoked is wonder, which I believe to be very useful in the creative
           process. Another awesome way to create is to be so deeply immersed in
           two different fields that you start seeing connections that most others
           might overlook. Johannes Kepler was an astronomer, mathematician,
           musical theorist, and as a byproduct, a philosopher. How elegantly
           <em>Harmonices Mundi</em> ties geometry, music theory, and astronomy
           together will bring a tear to your eye. Another example is
           Siddharth&rsquo;s <a href="https://itsiddharth.design/playground-page" target="_blank" rel="noopener">medieval brat poster</a>. The Brat epidemic from 2 summers
           ago affected millions including him and he just had to get it out of his
           system by making the poster. This is only one of the many many occasions in 
           which art has proved to be cathartic for him.` },

      { p:`Now, at this point in any conversation where I&rsquo;ve related to the
           person this much, I know it&rsquo;s time to bring up Anthony Bourdain
           (he finds his way into all my conversations). And just as I suspected,
           he was also a fan and coincidentally, on his way to watch Tony that very
           night! We jumped between movies, I told him about the Metrograph, and we
           even spoke about how NYC today looks very different from the
           representations in movies (like <em>Marty Supreme</em>; early 50s) and
           television shows (<em>Seinfeld</em>; late 80s to late 90s). The spirit of
           NYC, however, is immortal. When Siddharth wore his Hot Wheels jacket in
           SF, it didn&rsquo;t receive the love that NYC would have given it. It has
           been about 2 weeks since I&rsquo;ve been itching to fly to SF just for
           the events. I have decided that I will now be flying there with a much
           lighter suitcase.` },

      { p:`We then reflected on the influence that people can have on us. His roommate
           was a sculptor who came from a privileged family but still cleaned
           toilets at Popeyes to put himself through art school! And on the other
           end of the spectrum, there are friends and acquaintances, sometimes even
           from only a couple of years ago, whom we can&rsquo;t really talk to
           anymore. I say can&rsquo;t because it feels like we cannot hold a
           conversation with them or relate to them anymore. He described some of
           them as feeling &ldquo;frozen in time&rdquo; because our rates of growth
           no longer match.` },

      { p:`One of my greatest fears is stagnation. I like people who are willing to
           be beginners, to look stupid, to change their minds, and to experience
           discomfort. There is enormous joy on the other end of that discomfort.
           Siddharth would happily let AI take his job if it meant he could make art
           full-time. Part of why I commented on his appetite for life is because it
           is huge. He studied engineering and then went to art school. He could be a 
           student for all his life (what a wonderful mindset!). He prioritizes personal 
           growth over monetary gain. He&rsquo;s open to new foods and he loves film. He 
           is fascinated by math and science. He has tasteful opinions on album art. If 
           he&rsquo;s not making posters, he&rsquo;s making rings. If he&rsquo;s not making 
           rings, he&rsquo;s experimenting with leather. Above all, he understands that a bigger 
           worldview does not come from sitting in your bedroom and living the same life every 
           day. He is not afraid to experiment and knows that beginner embarrassment is incidental
           to gaining new experiences.
           
           And because a 1167 word article cannot do justice to a life that is lived to the fullest,
           you can <a href="https://x.com/itsiddharth_" target="_blank" rel="noopener noreferrer">reach</a> out to him yourself!` }
    ]
  };
