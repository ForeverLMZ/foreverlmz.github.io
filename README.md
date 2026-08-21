# Personal site — deploy on GitHub Pages (free)

Files in this folder:

```
index.html
styles.css
script.js
cv.pdf
```

## Option A — user site (`https://<username>.github.io`)

1. On GitHub, create a new repository named **exactly** `<your-username>.github.io`
   (e.g. if your username is `mingzeli`, the repo must be named `mingzeli.github.io`).
2. Upload these four files to the root of that repository (drag-and-drop works
   on github.com, or `git add . && git commit -m "site" && git push`).
3. Go to **Settings → Pages** in the repo. Under "Build and deployment," source
   should already default to "Deploy from a branch" → `main` → `/ (root)`.
4. Wait 1–2 minutes. Your site is live at `https://<your-username>.github.io`.

## Option B — project site (any repo name, free subpath URL)

1. Push these files to any repository, e.g. `mingzeli/homepage`.
2. Settings → Pages → Source: `main` branch, `/ (root)`.
3. Site is live at `https://<your-username>.github.io/homepage/`.

Option A gives the cleaner URL — use it if this is meant to be your main
personal site.

## Before you push

- Swap `cv.pdf` for your latest CV export (keep the filename, or update the
  two `href="cv.pdf"` links in `index.html` if you rename it).
- The bioRxiv link is built from the preprint ID in your CV
  (`2026.04.10.717847`) — double check it resolves once the paper's preprint
  page is live.
- If you want a custom domain later, add a `CNAME` file with just the domain
  name in it, and point your domain's DNS at GitHub's Pages IPs (GitHub's
  docs walk through this under Settings → Pages → Custom domain).
- No build step, no dependencies — it's plain HTML/CSS/JS, so any static host
  works if you ever want to move off GitHub Pages.
