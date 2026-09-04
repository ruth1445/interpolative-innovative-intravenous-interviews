from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')

# tab title + favicon made from the user-provided cow image
icon='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCABAAEADASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAAgFBgcEAQL/xAAxEAABAwMCBQMEAQMFAAAAAAABAgMEAAURBiEHEhMxQQgUIjJRcYHRFRZSYXKCkbH/xAAXAQEBAQEAAAAAAAAAAAAAAAABAAID/8QAGhEBAQEAAwEAAAAAAAAAAAAAAAERAiFBMf/aAAwDAQACEQMRAD8AZGo693pmxW1yY8w8+ltJWpDABWEpGVKwSNgNz/NSNYH6mL5LhWyHDjSVNNSeZDqQcc2AFdx/qUbeajEtD9Sml1PXRc9iTHjMuhMEIbKnJKMbqIOAjfwT2IqBe9UyffrEfSi3IafpWqYErUPvgJIH4yaX5yxzZNmYlo5XHlBbqmArLvTykBePIJJ277Z7VyNQnGJSmpCFsLA3S4OUj9GqdnDf6W4/6P1C+1FmPOWWW7jlTLx0yT4Dg2/7xWog5GRSY2zhTMudkhrducONIuUf3EBgkrW42FfJSgB8RjGPvmmM4S3UtWmRo+bOcmXXTgbZfdcGCtC08yMecAfH/jRvis9aFRRRSyKzTX3DmbqRuU49dXHoAeEn2bUZJeUMAKbSvOcEA9hk7DNaXRRhlxkumdKadh8OUxIMOM5OU+Hg+y18g51MjCjkgIHxwdwAQe9ZPqDh5ppDt/Kbs2i8TpRTBZU91S0nnHfA3UrfPhIOPuatOpH7vqHX9za0pGW2Xm2v6gsvFlhlZOUOA8wy5gHOPq8iu+0cLGGrs+qU5CESSzySVc3VkSFEkqOeyc5we9c7cdZFPk36BY+LGnf7dnC5w4EJm3Ot25tUl5bbeSsYAxlStvj4BOaj+F+vfb+oVy5Oj20XUDy4zzZWT01LOUZKt884SP2cbVp2p+ENkukHNmxZpSDkOQkhorG/xJHjNUPT/CGRFlv3PVnTnSVE8rDCygJVkYWVjGTtsB+c0zlBZfhqKK47O6t6ywnXSS4tlBUScknArsro5CiiipMt1FoNnSlunXOwofLT5601rmK1KI5j1PuQAoggeACOxrIbcnWc925uWK5R5i4KEyDGecCHFtKJGUrPxOCAMEjORjNNgdxSjccdODT1+urFtUWobym3eik4AQvCin/aFjIHjNYvGbrctzHkPjfdbL1Y9xhOGYjIKF/EAjwf5qJuXHvU01Tft48GElJyoJb6hWMdjzdh37b1XY7UJmAzllku8o35Rncb96+zHhqBSthop7/FI5j+6pxh2nO0Je4WoND2qbCnMzR7ZtDq2lZw4EDmBHgg+DVhpavTk85a7pcW2iTGefZYWntutC1JP5BQR+FUytbYooooqANJpxS1o/qbiDfW0PJVag/0G+UZ5g2OXP7IJpuNR2p2+6auFrYmuwHZjC2UyWvqaJGOYdv/AGl7T6ZNRso6beobUtI2BWw4Dj9GimXGOSnQ8WxhAKR9KBsD/NeIdcUpKVEkk8oT3USewAHetnHpo1IUjOobUgj/ABjub/vNdkb003ZsICtTwWj5WiCpSk/fBKxWcp19+n+1xxqm5IW51ZMBpDrwScoQ4oqSlP2KkpCsn7qwO27C1ROGHC6Fw1gzkNTnLhLnLSp19bYbHKnPKkJBOMZUe++avdanQr//2Q=='
if '<title>Interpolations</title>' in s:
    s=s.replace('<title>Interpolations</title>', f'<title>lessons</title>\n<link rel="icon" type="image/jpeg" href="{icon}">\n<link rel="apple-touch-icon" href="{icon}">', 1)
elif '<title>lessons</title>' in s and 'rel="icon"' not in s:
    s=s.replace('<title>lessons</title>', f'<title>lessons</title>\n<link rel="icon" type="image/jpeg" href="{icon}">\n<link rel="apple-touch-icon" href="{icon}">', 1)

old='''  font-size:clamp(15px,1.5vw,21px);line-height:1.16;\n  letter-spacing:-.012em;\n  color:var(--press-red);\n  text-align:left;hyphens:manual;'''
new='''  font-size:clamp(18px,1.9vw,27px);line-height:1.08;\n  letter-spacing:-.018em;\n  color:var(--press-red);\n  text-align:center;hyphens:manual;\n  text-wrap:balance;'''
if old not in s:
    raise SystemExit('pull quote desktop CSS anchor not found')
s=s.replace(old,new,1)

oldm='''    font-size:clamp(20px,5.4vw,24px);\n    line-height:1.12;'''
newm='''    font-size:clamp(23px,6.2vw,29px);\n    line-height:1.08;\n    text-align:center;\n    text-wrap:balance;'''
if oldm not in s:
    raise SystemExit('pull quote mobile CSS anchor not found')
s=s.replace(oldm,newm,1)

p.write_text(s,encoding='utf-8')
