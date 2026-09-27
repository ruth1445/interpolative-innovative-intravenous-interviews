/* Interview/profile data for ashley. Keep presentation logic in js/, not here. */
export default { slug:"ashley", named:true, name:"Ashley",
    shape:"cosmos", colour:13,
    press:{
      kicker:'looking for',
      shout:'wildly new sources',
      plates:{ of:[
        /* Same insertion point + reverse declaration order lets the two
           render strips land in natural 1→4 order after the paragraph. */
        { pair:[
            { img:'pictures/render3.jpg', ar:1.250, alt:'Accidental mathematical rendering made by a friend' },
            { img:'pictures/render4.jpg', ar:1.256, alt:'Accidental mathematical rendering made by a friend' }
          ], after:7,
          cap:'renderings made by a friend, by accident' },
        { pair:[
            { img:'pictures/render1.jpg', ar:1.031, alt:'Accidental mathematical rendering made by a friend' },
            { img:'pictures/render2.jpg', ar:1.272, alt:'Accidental mathematical rendering made by a friend' }
          ], after:7 },

        /* Puja's noticing collection, followed by one of her paintings.
           These share an insertion point so they stay together as a little
           visual field note inside the Zach Lieberman paragraph. */
        /* One compact strip. Add more of Puja's found images here. */
        { pair:[
            { img:'pictures/puja_idol.jpg', ar:1.014, alt:'An idol photographed by Puja' },
            { img:'pictures/puja_ramen.jpg', ar:0.632, alt:'A bowl of ramen photographed by Puja' },
            { img:'pictures/puja_maps.jpg', ar:0.986, alt:'A map detail photographed by Puja' },
            { img:'pictures/manhole_cov.jpg', ar:1.266, alt:'A manhole cover photographed by Puja' }
          ], after:3, w:92, zoom:true, class:'puja-collection',
          cap:'puja&rsquo;s collection of images' },

        /* Puja's art stays a small gallery as it grows. Add future pieces to
           this pair array rather than making separate full-size plates. */
        { pair:[
            { img:'pictures/puja_paint.jpg', ar:0.824, alt:'A colorful painting by Puja' }
          ], after:3, w:56, zoom:true, class:'puja-art',
          cap:'some of puja&rsquo;s art' }
      ]}
    },
    story:[
      { p:`Last week, I told my friend Ashley how unhappy I was with the prevalence of <em><a href="https://www.urbandictionary.com/define.php?term=Turboslop" target="_blank" rel="noopener">turboslop</a></em>. Ashley who is a neuroscientist said it carries a sort of dystopian aspect that seems to increase the more of it you see. I realized how I feel the same way about my work. As a data scientist/statistician/technologist (I don’t quite know what to call myself), I admit that one technology-equipped-human today does the work of tens of thousands of <a href="https://www.deweybstrategic.com/2012/09/a-computer-was-originally-job-title.html" target="_blank" rel="noopener">clerks</a> from 100 years ago. However, I can’t help but feel a bit jaded about data collection, analysis, and visualization. It all happens so passively and I feel removed from the process.` },

      { p:`It caught up with me recently. I hit a drain of inspiration so massive, I couldn’t create anything, even a to-do list. Not even my daily ritual of force feeding myself Substack articles could help me. I realized it might be time for me to look for wildly new sources of inspiration and wilder still, means of acquiring them. As a data scientist, I practice my craft religiously with the pattern that we are all given: data collection, data analysis, data visualization. After many such projects, I started to get fatigued; especially with the first step. Data collection is where you gather rows of numbers and letters and clean them. At the end of it, you have a bunch of squeaky clean CSV files at your disposal, ready to be worked on as you’d like. This is not a hard task. It is definitely a chore; but it is not a hard task. The easier digital data collection got, the more fed up I was with it. Perhaps I was craving a more traditional method of collecting data that would allow me to get my hands dirty.` },

      { p:`I recently attended a demo that MIT professor <a href="http://zach.li/" target="_blank" rel="noopener">Zach Lieberman</a> gave, where he revealed he starts his classes by asking his students what they noticed around them that week. I thought of my friend Puja who would definitely be able to answer that question every week. <!-- photo-slot:puja-observations ramen/manhole/etc --> Puja will never admit it, but she is a wonderful artist whose paintings are creative, full of color and life. <!-- photo-slot:puja-paintings --> The only explanation for that kind of final product (besides practice) is the kind of things she stops to notice and fill her mind with. After all, the creative process does not begin from the moment you <a href="https://ardenyum.substack.com/i/194701210/1-idea-generation" target="_blank" rel="noopener">literally sit down to create</a>.` },

      { p:`As far as I can remember, I have always been something of an eclectic data scientist. I always stopped to take pictures, read labels, talk to people, ask them about their names and languages so I could either store it in my diary or just my mind, go to cultural grocery stores, and even listen to global rock and roll (my top 3 are German, Cambodian, and Egyptian). With all this information, I could not immediately do analysis in a traditional sense. But it did marinate in my mind and give me newer ideas and cultivate a sense of appreciation for everything around me.` },

      { p:`This is why I enjoy so much to just sit with people for an hour at least and pick their brains, learn about their journeys. I told Ashley how I’ve participated in a lot of “interviews” that were just questions I had to fill in a google form. She reminded me of how the conversation would never go off tangent and hit new gold mines of thought just over a google form. I would soon come to realize that wildly new simply meant more physical/real life sources.` },

      { p:`As I sat down with Ashley, I remembered how she has always been among the first of my followers on Twitter, Substack, Instagram, Wattpad, and any other platform I ever had a digital presence on. We grew up in the digital age and now we’re trying to detach ourselves from it. Ashley recently saw a video of a girl walk down the aisle in a beautiful white dress on Instagram after having only ever seen her walk down the hallways of her college one time. She remarked on how pointless it felt to follow updates of people she quite frankly, doesn’t even care about. “Why do I need to know everyone’s life updates? And recently, everyone and their mother has been creating 80s pictures of themselves. Why do I need to subject myself to that?” She correctly commented on how in an effort to bring people closer, we’ve actually isolated ourselves so much to the point that we might be very disconnected from reality. Ashley, who holds degrees in neuroscience and cognitive science, believes that this is what prompts people to partake in mindless trends and make themselves feel better. Then, I brought up how I am also trying to detach myself from the digital aspects of my career, which sounded silly to me until I met several other people who also felt the same way about careers in tech. Especially if you’re a creative, it sometimes feels like your soul is being sucked out of your body.` },

      { p:`In statistics, we are so used to accounting for the typical population and ignoring outliers. Ashley told me how in her work, they tend to focus on outliers and understand their story. This struck me as yet another soulless aspect of my work. I love mathematics very much and I dislike how it is marketed to students as mechanical and soulless. It is very much a form of art, like Paul Lockhart says in <em>A Mathematician’s Lament</em>. Apart from the way we analyze data, Ashley also had a ton of fun visualization ideas that were very art-forward. <!-- photo-slot:brain-visualization --> I have always been fascinated between blurring the line between art and math. Here’s some renderings one of my dear friends made, by accident. <!-- photo-slot:friend-renderings -->` },

      { p:`If she had one word of advice to anyone that feels jaded in this manner, it was to have hobbies that don’t necessarily bring you money or the worries of what the final product would look like. You could color, pick strawberries, and knit just because you enjoy it. It could be as simple as walking outside just so long as it’s a physical activity.` }
    ]
  };
