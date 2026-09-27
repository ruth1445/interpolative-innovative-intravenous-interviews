# Interviews

Each named person gets one JavaScript module in this folder. The homepage and
rendering code should never contain interview prose.

## Add a new interview

1. Copy `template.js` to `<slug>.js`.
2. Fill in the person's metadata, press headline, and `story` blocks.
3. Import the module in `index.js`.
4. Add it to the exported `PEOPLE` array in the bouquet order you want.
5. Put photographs in `/pictures/` and reference them as
   `pictures/<filename>`.
6. Remove `soon:true` when the page is ready to publish. The homepage name
   index is generated from these modules, so the name becomes clickable
   automatically.

The hidden Cmd-E editor now saves the current interview as `<slug>.js`, so an
edited interview can replace only its matching module instead of replacing the
whole site.

## Story blocks

A normal paragraph is:

```js
{ p: `Paragraph text here.` }
```

Existing interviews also demonstrate image blocks, paired plates, captions,
lists, image notes, crop positions, and press-specific plate placement. Keep
those presentation details with the interview when they are unique to that
person; keep reusable rendering behavior in `/js/`.
