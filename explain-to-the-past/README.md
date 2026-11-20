# Explain to someone from the past

A tiny static word-game inside [Public Yuzu](https://publicyuzu.org/explain-to-the-past/).
The archive homepage has a small black-dot link to the game. No API,
backend, account, or additional domain is needed.

## Playing

1. The entry page defaults to the **17th century** (a listener in 1650).
2. Press **START GAME** to see a randomly selected item and its picture.
3. Explain that item to someone living in the selected year.
4. Press **Check my explanation** for a local checklist and an example
   answer; this is **not AI grading**.
5. Press **Another item** to get a different random prompt.
6. Change the era from the dropdown **at any time**. During a round, any
   era in which the displayed item was already known is greyed out and
   cannot be selected. Changing to an available era keeps the same
   prompt but resets the written answer.

There is intentionally **no back button inside the game**. To replay from
the start screen, reload the game page.

## Files

- `index.html`: standalone game page and styles, adapted from the original
  minimal prototype
- `game.js`: era list, prompt collection, dates, curated explanations,
  random-round logic, disabled eras, and offline feedback
- `images/atlas.webp`: one sprite of all **14 supplied prompt pictures**,
  arranged as four columns of equally padded 1:1 square tiles
- `../js/app.js`: the black-dot link from the interview archive homepage

The image atlas contains 16 slots in a 4×4 grid. The first 14 slots map
to `IMAGE_ORDER` in `game.js`, in order. It uses **64×64 source tiles**,
drawn to 280×280 display canvases, preserving the full images but using
compact source-resolution for a small static site. Future replacements
can use larger atlas images by updating the tile size in `renderImage`.

The supplied MTA image depicts a **MetroCard** as a visual stand-in for the
subway system prompt. The Pepsi-cat image was not included because there is
no corresponding active prompt.

## Historical rules

An item is offered only if `item.knownSince > era.year` and there is
a usable reference explanation for that era. For the 17th-century option,
the older curated `old` sample is used. For the 1990s option, a specific
`90s` explanation is preferred, with the `80s` explanation as a fallback.

| Era label | Fixed listener year |
|---|---:|
| 17th century (default) | 1650 |
| Early 20th century | 1920 |
| 1950s | 1955 |
| 1960s | 1965 |
| 1970s | 1975 |
| 1980s | 1985 |
| 1990s | 1995 |

The 14 prompts and approximate cutoff years:

| Prompt | Known-since rule |
|---|---:|
| Modern Stanley Quencher tumbler | 2016 |
| Modern large language model (LLM) | 2018 |
| “6–7” meme | 2025 |
| iPad | 2010 |
| Spotify | 2008 |
| Contemporary iced salted maple oat milk matcha latte combination | 2020 |
| Jira | 2002 |
| Modern double-sided tape | 1956 |
| Household electrical power (not the phenomenon electricity) | 1882 |
| NYC subway system (MetroCard visual) | 1904 |
| Projected commercial movie theatre | 1895 |
| Iconic black-and-white football panel design (not football itself) | 1970 |
| QR code | 1994 |
| CAPTCHA | 2000 |

These are pragmatic dates for the **specific versions depicted**, not
claims that every related concept was unknown before that year. For
example, soccer balls and football games already existed long before
1970; the 1970 date refers only to the pictured black-and-white panel
design.

## Offline evaluation and vocabulary checks

The game uses an offline 1–10 score for each explanation. Three concept
checklists reward coverage; modest word-count points reward elaboration.
The next round only unlocks at 8/10. An answer containing a recognised
anachronistic expression is capped at 7/10 until revised.

`HISTORICAL_TERMS` contains a small conservative set of historical
vocabulary/reference checks. Each `familiarBy` year is an approximate
*period of general familiarity of the modern sense*, not the precise
date a spelling first appeared. For example, **computer** also described
a human calculator long before electronic computers existed.

We consulted the approach described in the University of Glasgow's
[Historical Thesaurus of English](https://ht.ac.uk/guide/). It dates
particular **word senses** and their recorded usage, but does not by
itself measure how prominent a word was in everyday conversation.
The dataset is copyright-protected and not openly redistributable, so
the game does not contain, download, or query the Historical Thesaurus
database. This is **not** comprehensive word-level historical validation.

The feedback deliberately shows only the score, the requested verdict,
and, where applicable, a short list of potentially too-modern terms.
No example answers are shown in the game UI.

## Ideas for later prompts

AirPods, a group chat, live traffic maps, a video call, self-checkout,
algorithmic feeds, a screenshot, a 3D printer, a robot vacuum cleaner,
a dating app, a smart doorbell, contactless payment, and cloud storage.

Before enabling each new prompt, add a defensible cutoff date, a 1:1
picture tile, three checkable ideas, and sample explanations for eligible
eras.
