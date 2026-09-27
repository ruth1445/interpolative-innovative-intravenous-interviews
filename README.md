# Trying to learn from people

A static interview archive built as a small client-side application and hosted
with GitHub Pages.

## Structure

```text
index.html              tiny page shell
css/
  fonts.css             embedded font payloads
  site.css              editable site styling
js/
  app.js                homepage, bouquet, search, routing
  editor.js             interview view + Cmd-E editing tools
  press.js              magazine/newspaper renderer
interviews/
  index.js              assembles people in bouquet order
  template.js           starting point for a new person
  <slug>.js             one named person per file
  placeholders.js       anonymous future bouquet slots
pictures/               all image assets
scripts/archive/         historical one-off migration scripts
```

The interview prose deliberately lives outside the application code. Adding or
editing one conversation should normally touch only that person's module and
its pictures.

See `interviews/README.md` for the new-interview workflow.

## Publishing

GitHub Pages serves the repository from `main`. The custom domain is defined
by `CNAME`.
