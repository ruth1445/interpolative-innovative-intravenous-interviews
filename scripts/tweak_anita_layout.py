from pathlib import Path
import re

p=Path('index.html')
s=p.read_text(encoding='utf-8')

# Tighten the two-photo gutter without changing the image proportions.
s,n=re.subn(r"const gap\s*=\s*\(list\.length - 1\) \* 2\.2;", "const gap  = (list.length - 1) * 0.7;", s, count=1)
if n != 1:
    raise SystemExit('photo pair gap anchor not found')

cow='''/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8k