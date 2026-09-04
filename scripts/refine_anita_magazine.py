from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

# Give Anita's article its own hook so its newspaper treatment can be tuned
# without changing Siddharth or the other press pages.
old_article = 'return `<article class="press">'
new_article = 'return `<article class="press${p.slug===\'anita-wong\' ? \' anita-press\' : \'\'}">'
if old_article in s and 'anita-press' not in s:
    s = s.replace(old_article, new_article, 1)

# The portrait should read as a small printed inset, not a hero spread.
s = s.replace("{ img:'anita-portrait.jpg?v=4', ar:1.508, after:1, fx:50, fy:50, w:92, wide:true,",
              "{ img:'anita-portrait.jpg?v=5', ar:1.508, after:1, fx:50, fy:50, w:88,", 1)
s = s.replace("{ img:'anita-portrait.jpg?v=3', ar:1.508, after:1, fx:50, fy:50, w:92, wide:true,",
              "{ img:'anita-portrait.jpg?v=5', ar:1.508, after:1, fx:50, fy:50, w:88,", 1)

# Fresh image URLs for the restored originals.
s = s.replace("anita-subway.jpg?v=4", "anita-subway.jpg?v=5")
s = s.replace("anita-subway.jpg?v=3", "anita-subway.jpg?v=5")
s = s.replace("anita-seinfeld.jpg?v=4", "anita-seinfeld.jpg?v=5")
s = s.replace("anita-seinfeld.jpg?v=3", "anita-seinfeld.jpg?v=5")

anchor = '''@media(max-width:900px){
  .press .cols .plate{margin-left:auto;margin-right:auto}
  .press .cols .plate.wide{column-span:none}
  .press .cols .bub{font-size:11px}
}
'''
css = '''
/* Anita: denser illustrated-newspaper composition. The writing remains the
   page; photographs are small printed insets with measured white space. */
.anita-press .top{
  margin-bottom:10px;
  padding-bottom:8px;
  border-bottom:3px double rgba(18,17,12,.82);
}
.anita-press .shout{
  color:#171611;
  font-size:clamp(38px,5.4vw,72px);
  line-height:.9;
  letter-spacing:-.025em;
}
.anita-press .story.cols{
  column-gap:clamp(16px,1.9vw,25px);
  column-rule:1px solid rgba(92,74,44,.42);
  padding-top:8px;
}
.anita-press .cols .plate{
  width:min(88%,230px) !important;
  max-width:230px;
  margin:.35em auto .9em;
  padding:4px;
  box-sizing:border-box;
  border:1px solid rgba(18,17,12,.72);
  background:#eadfc4;
}
.anita-press .cols .plate .shot{
  border:1px solid rgba(18,17,12,.92);
}
.anita-press .plate-pair{
  width:56%;
  max-width:510px;
  grid-template-columns:minmax(0,.72fr) minmax(0,1.36fr);
  gap:8px;
  align-items:start;
  margin:.95em auto 1.05em;
  padding:5px;
  box-sizing:border-box;
  border:1px solid rgba(18,17,12,.76);
  background:#eadfc4;
}
.anita-press .plate-pair .pairshot{
  border:1px solid rgba(18,17,12,.92);
  background:#d8ceb7;
}
.anita-press .plate-pair .pairshot img{
  filter:saturate(.84) contrast(.98);
}
/* Splitting the columns around the photo pair must not create a second
   decorative drop cap when the prose resumes. */
.anita-press .plate-pair + .story.cols p:first-of-type::first-letter{
  float:none;
  font-family:inherit;
  font-weight:inherit;
  font-size:inherit;
  line-height:inherit;
  margin:0;
  color:inherit;
}
@media(max-width:900px){
  .anita-press .cols .plate{
    width:min(72%,220px) !important;
    max-width:220px;
  }
  .anita-press .plate-pair{
    width:min(88%,500px);
    grid-template-columns:minmax(0,.72fr) minmax(0,1.36fr);
    gap:7px;
  }
}
@media(max-width:560px){
  .anita-press .plate-pair{
    width:94%;
    padding:4px;
    gap:5px;
  }
  .anita-press .cols .plate{
    width:min(78%,210px) !important;
  }
}
'''
if '.anita-press .plate-pair{' not in s:
    if anchor not in s:
        raise SystemExit('responsive plate anchor not found')
    s = s.replace(anchor, anchor + css, 1)

p.write_text(s, encoding='utf-8')
print('Refined Anita layout toward compact vintage newspaper composition')
