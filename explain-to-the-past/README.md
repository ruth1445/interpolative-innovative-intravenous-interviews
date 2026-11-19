# Explain to someone from the past

A tiny, static Public Yuzu game at `/explain-to-the-past/`.

Visitors choose an era, receive a modern prompt, try to explain it in
period-appropriate language, and compare their answer with a curated
example. No API, backend, sign-in, analytics, or paid domain is required.

## Where to edit

- `index.html` is the minimalist page and layout, adapted from the uploaded prototype.
- `game.js` contains the **six eras**, **eleven prompts**, concept checklists,
  era-specific **answer sheets**, eligibility rules, and offline feedback.
- `images/<item-id>.png` is where future illustrations belong. Missing images
  intentionally display a placeholder. The item IDs are in `game.js`.

## The historical rule

The date assigned to each era represents the **actual year of the listener**.
This keeps "16th–19th centuries" from ambiguously covering four centuries at
once. The listener for that broad option is **1750**. The remaining years are
1920, 1955, 1965, 1975, and 1985.

An item is eligible only when `knownSince > listener.year` **and** an
era-specific sample explanation has been authored. "Known since" uses a
practical milestone, not the first time anyone imagined a related idea.
The first edition uses these approximate thresholds:

| Item | Milestone used for filtering |
| --- | --- |
| Stanley **Quencher** cup | 2016 release; not the older Stanley brand |
| Modern LLM | 2018-era large neural language models; not older NLP |
| “6–7” | 2025 online catchphrase (not the numbers themselves) |
| iPad | 2010 |
| Spotify | 2008 |
| Iced salted maple oat milk matcha latte | Contemporary 2020s *specific drink combination*, not tea or oat milk |
| Jira | 2002 |
| Double-sided tape | 1956 commercial double-sided tapes; 3M Scotch double-coated was 1957 |
| Electricity | **Household electrical service**, circa 1882; electricity as a physical phenomenon was known long before |
| MTA subway system | NYC subway opened 1904; the MTA organization itself came later in 1968 |
| Movie theatre | Commercial projected films from 1895; dedicated cinemas developed by 1905 |

Historical reference links:
- [Stanley Quencher release](https://www.invent.org/blog/inventors/stanley-cups)
- [3M double-coated tape](https://www.3m.com/3M/en_US/about-3m/history/)
- [Home electric power](https://www.nps.gov/edis/learn/historyculture/edison-biography.htm)
- [NYC subway 1904](https://www.loc.gov/item/today-in-history/october-27/)
- [Early cinema](https://cinemaunited.org/our-history/)
- [Spotify history](https://newsroom.spotify.com/spotify-timeline/)
- [6–7 meme](https://knowyourmeme.com/memes/67-meme-six-seven)

These represent pragmatic gameplay choices, not a comprehensive history of
each invention. In particular, local adoption varied substantially.

## What "grading" means without an API

`ITEMS[].concepts` is a three-point **keyword cue sheet**.
After submission, the game displays which concepts its keyword matching saw,
what it may have missed, a few potential anachronistic words, and the
example answer for the selected era.

This **does not** objectively measure the correctness or historical
appropriateness of free-form explanations. Synonyms, creative metaphors,
negations, and nuance can fool it. Players should read the example and use
their judgment. All scoring happens locally in the browser.

## More prompts to add in future

These are suggestions **only**, not yet in the playable pool; research the
historical cutoff and write samples before enabling one.

- A QR code
- AirPods with noise cancellation
- Google Maps live traffic
- A group chat
- An algorithmic social-media feed
- A CAPTCHA
- A screenshot
- A viral meme
- Contactless payment
- A self-checkout machine
- A rideshare app
- Cloud storage
- A video call
- A 3D printer
- A smart doorbell
- A virtual reality headset
- A recommendation algorithm
- A dating app
- Cryptocurrency
- A robot vacuum cleaner

## Adding a prompt

Add an `ITEMS` entry in `game.js` with a stable `id`, title, article
(`lead`: "what a", "what an", "what", or "what the"),
`knownSince`, three checkable `concepts`, and samples for each eligible era.
The list is filtered from the date and the presence of a corresponding sample;
this prevents unprepared rounds from showing up.
