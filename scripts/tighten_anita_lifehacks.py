from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

old = '''/* Visually lower only the final tips panel so its foot meets the column-rule ending. */
@media(min-width:901px){
  .anita-press .cols .panel{position:relative;top:22px}
}
'''
new = '''/* Keep Anita's final tips box in the actual column flow so it sits snugly
   against the sentence before it and the page ending after it. */
.anita-press .cols p:has(+ .panel){margin-bottom:.16em}
.anita-press .cols .panel{
  position:static;
  margin:.08em 0 0;
}
.anita-press .colophon{margin-top:10px}
'''
if old not in s:
    raise SystemExit('old Anita panel offset block not found')
s = s.replace(old, new, 1)

# The later Anita-specific panel rule only needs to keep the heading hidden
# and top padding. Leave those intact.
p.write_text(s, encoding='utf-8')
