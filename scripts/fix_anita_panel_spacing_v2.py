from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

old = '''/* Anita's final tips box keeps the frame, but not the red subheading/rule. */
.anita-press .cols .panel h4{display:none}
.anita-press .cols .panel{padding-top:12px}
'''
new = '''/* Anita's final tips box keeps the frame, but not the red subheading/rule.
   Keep the intro line attached to the box and override the generic panel
   margins that appear earlier in the stylesheet. */
.anita-press .cols .panel h4{display:none}
.anita-press .cols p:has(+ .panel){
  margin-bottom:.10em;
  break-after:avoid-column;
}
.anita-press .cols .panel{
  position:static;
  margin:.05em 0 0 !important;
  padding-top:12px;
}
.anita-press .colophon{margin-top:6px !important}
'''

if old not in s:
    raise SystemExit('Anita final panel block not found')
s = s.replace(old, new, 1)

p.write_text(s, encoding='utf-8')
