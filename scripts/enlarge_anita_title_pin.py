from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

old = '''  grid-template-columns:minmax(0,1fr) 1.2in;'''
new = '''  grid-template-columns:minmax(0,1fr) 2.3in;'''
if old not in s:
    raise SystemExit('desktop title grid size anchor not found')
s = s.replace(old, new, 1)

old = '''  display:block;width:1.2in;max-width:1.2in;height:auto;'''
new = '''  display:block;width:2.3in;max-width:2.3in;height:auto;'''
if old not in s:
    raise SystemExit('desktop title image size anchor not found')
s = s.replace(old, new, 1)

p.write_text(s, encoding='utf-8')
