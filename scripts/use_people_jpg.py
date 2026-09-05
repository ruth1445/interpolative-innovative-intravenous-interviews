from pathlib import Path
import re

p = Path('index.html')
s = p.read_text(encoding='utf-8')

pattern = r'(<img class="anita-title-pin" src=")data:image/jpeg;base64,[^"]+("[^>]*>)'
s2, n = re.subn(pattern, r'\1people.jpg\2', s, count=1)
if n != 1:
    raise SystemExit('Anita title image anchor not found')

p.write_text(s2, encoding='utf-8')
