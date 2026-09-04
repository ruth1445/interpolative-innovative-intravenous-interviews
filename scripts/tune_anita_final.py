from pathlib import Path

path = Path('index.html')
src = path.read_text(encoding='utf-8')

old_travel = "So much of how we act and react depends on who is watching. Spend next to no time by ourselves and we might forget who we truly are. Thankfully, there are a lot of ways to find that out. For Anita it was a solo trip to New York. On these trips she remembers"
new_travel = "So much of how we act and react depends on who is watching. When we are truly all alone feeling small in a huge world, we might just find out who we truly are. For Anita, this was when she first travelled solo to New York City. On these trips she remembers"
if old_travel not in src:
    raise SystemExit('travel wording anchor not found')
src = src.replace(old_travel, new_travel, 1)

old_passion = "Passion is contagious and will infect you too. You must simply allow it to."
new_passion = "Passion is contagious and will infect you too if you simply allow it to."
if old_passion not in src:
    raise SystemExit('passion wording anchor not found')
src = src.replace(old_passion, new_passion, 1)

old_break = "I could not have summed it better myself. Anita is extremely passionate about waste management"
new_break = "I could not have summed it better myself.` },\n\n      { p:`Anita is extremely passionate about waste management"
if old_break not in src:
    raise SystemExit('paragraph break anchor not found')
src = src.replace(old_break, new_break, 1)

css_anchor = "/* ---- the body, in columns ---- */"
css_insert = """/* Anita's final tips box keeps the frame, but not the red subheading/rule. */
.anita-press .cols .panel h4{display:none}
.anita-press .cols .panel{padding-top:12px}

/* ---- the body, in columns ---- */"""
if css_anchor not in src:
    raise SystemExit('panel CSS anchor not found')
src = src.replace(css_anchor, css_insert, 1)

old_marker = "const FINAL_ANITA_MARKER = 'The pleasure of learning without objective or timeline is unparalleled.';"
new_marker = "const FINAL_ANITA_MARKER = 'Passion is contagious and will infect you too if you simply allow it to.';"
if old_marker in src:
    src = src.replace(old_marker, new_marker, 1)
elif new_marker not in src:
    raise SystemExit('Anita local-storage marker not found')

path.write_text(src, encoding='utf-8')
