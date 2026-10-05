# Muhafız Playz — beginner guide

## Folder structure
```
index.html, about.html, contact.html, privacy-policy.html, terms.html
robots.txt, sitemap.xml
pages/   drama.html, episode.html, download.html
css/     style.css
js/      data.js (YOU EDIT THIS), app.js, search.js
assets/  logo/ (logo.png, logo-icon.png)   images/ (your posters)
```

## Publish on GitHub Pages (free)
1. Create a GitHub account, then click New repository. Name it `muhafiz-playz`, set it to Public.
2. Click "uploading an existing file", drag in EVERYTHING from inside this folder (keep the folders), then Commit.
3. Go to Settings > Pages. Under Source choose "Deploy from a branch", branch `main`, folder `/ (root)`, Save.
4. After 1-2 minutes your site is live at https://muhafizplayz.github.io/muhafizplayz/
5. The site address (https://muhafizplayz.github.io/muhafizplayz) is already set in js/data.js, sitemap.xml, robots.txt and the canonical links. If you add a custom domain later, replace it in those places.

## How the site works
Every page loads js/data.js, which holds all dramas and episodes. app.js builds the header, footer and cards from that data. Drama, episode and download pages are ONE template each; the link (`drama.html?id=haysiyet`) tells it which drama to show. search.js filters the same data live.

## How to change things (all in js/data.js unless noted)
- Logo: replace assets/logo/logo.png and assets/logo/logo-icon.png (same names).
- Poster: upload the image to assets/images/, then set `poster: "assets/images/haysiyet.jpg"`.
- Title / description / release date: edit `title`, `description`, `releaseDate`.
- Episodes: add or remove lines in `episodes`. `available: false` shows "Coming Soon".
- Download links: change each `url`. Links containing REPLACE_ME show a "PLACEHOLDER LINK" tag until you replace them.
- New drama: copy one whole `{ ... }` block, give it a new unique `id`, and add it to sitemap.xml.
- Social links and email: SITE section at the top of data.js.

## Ads
Empty `<div class="ad-slot">` boxes are in the pages and stay hidden. After AdSense approval, paste the ad code inside one.

## Custom domain later
Buy a domain, then Settings > Pages > Custom domain. At your registrar add the DNS records GitHub shows. Tick Enforce HTTPS. Then replace the web address in data.js, sitemap.xml, robots.txt and the canonical tags.

## Supabase admin later
data.js is already split into SITE, CATEGORIES and DRAMAS, the same shape as database tables (settings, categories, dramas, episodes, download_links). Later: create those tables in Supabase, build /admin/ with Supabase Auth, and make app.js load the lists from Supabase instead of data.js. Public pages stay the same.
