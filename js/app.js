/* Muhafız Playz — shared code: header, footer, and page rendering.
   You normally do NOT need to edit this file. Data comes from Supabase via js/data.js (loadData). */
(function () {
  "use strict";
  var ROOT = document.body.dataset.root || "";   // "" on main pages, "../" inside /pages/
  var PAGE = document.body.dataset.page || "static";
  var params = new URLSearchParams(location.search);

  /* ---------- helpers ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function findDrama(id) { return DRAMAS.filter(function (d) { return d.id === id; })[0]; }
  function catName(id) {
    var c = CATEGORIES.filter(function (x) { return x.id === id; })[0];
    return c ? c.name : id;
  }
  function posterUrl(d) {
    if (d.poster) return /^https?:/.test(d.poster) ? d.poster : ROOT + d.poster;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#242427"/>' +
      '<text x="200" y="175" font-family="Arial" font-size="110" font-weight="700" fill="#ffb400" text-anchor="middle">' +
      esc(d.title.charAt(0)) + '</text><text x="200" y="260" font-family="Arial" font-size="16" fill="#8d8981" text-anchor="middle">POSTER PLACEHOLDER</text></svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  function dramaUrl(d) { return ROOT + "pages/drama.html?id=" + encodeURIComponent(d.id); }
  function epUrl(d, n) { return ROOT + "pages/episode.html?id=" + encodeURIComponent(d.id) + "&ep=" + n; }
  function dlUrl(d, n) { return ROOT + "pages/download.html?id=" + encodeURIComponent(d.id) + "&ep=" + n; }
  function catLabel(d) { return d.categories.map(catName).join(", "); }
  function findEp(d, n) { return d.episodes.filter(function (e) { return String(e.number) === String(n); })[0]; }

  function setMeta(title, desc, path, image) {
    document.title = title;
    var url = SITE.url + "/" + path;
    function set(sel, attr, val) { var el = $(sel); if (el) el.setAttribute(attr, val); }
    set('meta[name="description"]', "content", desc);
    set('link[rel="canonical"]', "href", url);
    set('meta[property="og:title"]', "content", title);
    set('meta[property="og:description"]', "content", desc);
    set('meta[property="og:url"]', "content", url);
    if (image) set('meta[property="og:image"]', "content", image);
  }

  /* ---------- header + footer ---------- */
  var ICON_SEARCH = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
  var ICON_MENU = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';

  function navHtml() {
    var cat = params.get("category");
    var items = [["Home", ROOT + "index.html", PAGE === "home" && !cat]];
    CATEGORIES.forEach(function (c) {
      items.push([c.name, ROOT + "index.html?category=" + encodeURIComponent(c.id), cat === c.id]);
    });
    items.push(["About", ROOT + "about.html", /about\.html$/.test(location.pathname)]);
    items.push(["Contact", ROOT + "contact.html", /contact\.html$/.test(location.pathname)]);
    return items.map(function (i) {
      return '<a href="' + i[1] + '"' + (i[2] ? ' aria-current="page"' : "") + ">" + esc(i[0]) + "</a>";
    }).join("");
  }

  function renderHeader() {
    var nav = navHtml();
    var h = document.createElement("header");
    h.className = "site-header";
    h.innerHTML =
      '<div class="wrap header-in">' +
      '<a class="logo" href="' + ROOT + 'index.html" aria-label="' + esc(SITE.name) + ' home">' +
      '<img src="' + ROOT + SITE.logoIcon + '" alt="" width="36" height="38" onerror="this.remove()">' +
      '<span>Muhafız <b>Playz</b></span></a>' +
      '<nav class="nav" id="main-nav" aria-label="Main navigation">' + nav + "</nav>" +
      '<button class="icon-btn" id="search-open" type="button" aria-label="Open search">' + ICON_SEARCH + "</button>" +
      '<button class="icon-btn menu-btn" id="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav">' + ICON_MENU + "</button>" +
      "</div>";
    document.body.insertBefore(h, document.body.firstChild);

    var skip = document.createElement("a");
    skip.className = "skip"; skip.href = "#main"; skip.textContent = "Skip to content";
    document.body.insertBefore(skip, document.body.firstChild);

    var btn = $("#menu-btn"), navEl = $("#main-nav");
    btn.addEventListener("click", function () {
      var open = navEl.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Search overlay (behaviour is in search.js)
    var s = document.createElement("div");
    s.className = "search-overlay"; s.id = "search-overlay";
    s.setAttribute("role", "dialog"); s.setAttribute("aria-modal", "true"); s.setAttribute("aria-label", "Search");
    s.innerHTML =
      '<div class="search-box"><div class="search-top">' +
      '<input id="search-input" type="search" placeholder="Search dramas and movies" autocomplete="off" aria-label="Search dramas and movies">' +
      '<button class="btn btn-ghost btn-sm" id="search-close" type="button">Close</button></div>' +
      '<div class="search-results" id="search-results" aria-live="polite"></div></div>';
    document.body.appendChild(s);
  }

  function renderFooter() {
    var old = $(".site-footer");
    if (old) old.remove();
    var so = SITE.social;
    var social = [["Facebook", so.facebook], ["WhatsApp Channel", so.whatsapp], ["Instagram", so.instagram], ["TikTok", so.tiktok], ["Telegram", so.telegram], ["YouTube", so.youtube]]
      .filter(function (x) { return x[1] && x[1] !== "#"; })
      .map(function (x) {
        return '<li><a href="' + esc(x[1]) + '" target="_blank" rel="noopener noreferrer">' + x[0] + "</a></li>";
      }).join("");
    var about = SITE.footerText ? esc(SITE.footerText) : esc(SITE.tagline) + ". Download links are shared only for content we have permission to distribute.";
    var f = document.createElement("footer");
    f.className = "site-footer";
    f.innerHTML =
      '<div class="wrap"><div class="foot-grid">' +
      "<div><h2>" + esc(SITE.name) + "</h2><p>" + about + "</p></div>" +
      '<div><h2>Explore</h2><ul><li><a href="' + ROOT + 'index.html">Home</a></li>' +
      '<li><a href="' + ROOT + 'about.html">About</a></li><li><a href="' + ROOT + 'contact.html">Contact</a></li>' +
      '<li><a href="' + ROOT + 'privacy-policy.html">Privacy Policy</a></li><li><a href="' + ROOT + 'terms.html">Terms</a></li></ul></div>' +
      (social ? "<div><h2>Follow us</h2><ul>" + social + "</ul></div>" : "") + "</div>" +
      '<p class="copy">&copy; ' + new Date().getFullYear() + " " + esc(SITE.name) + ". All rights reserved.</p></div>";
    document.body.appendChild(f);
  }

  /* ---------- reusable pieces ---------- */
  function card(d) {
    return '<a class="card" href="' + dramaUrl(d) + '">' +
      '<div class="thumb"><img src="' + posterUrl(d) + '" alt="' + esc(d.title) + ' poster" loading="lazy" width="400" height="300">' +
      (d.status ? '<span class="badge">' + esc(d.status) + "</span>" : "") + "</div>" +
      "<h3>" + esc(d.title) + '</h3><p class="meta">' + esc(catLabel(d)) + "</p></a>";
  }
  function cards(list) {
    return list.length ? list.map(card).join("") : '<p class="empty">Nothing here yet. Check back soon.</p>';
  }

  /* ---------- HOME ---------- */
  function renderHome() {
    var cat = params.get("category");
    var chips = '<a class="chip' + (!cat ? " active" : "") + '" href="' + ROOT + 'index.html">All</a>' +
      CATEGORIES.map(function (c) {
        return '<a class="chip' + (cat === c.id ? " active" : "") + '" href="' + ROOT + "index.html?category=" + encodeURIComponent(c.id) + '">' + esc(c.name) + "</a>";
      }).join("");
    $("#chips").innerHTML = chips;

    var feat = DRAMAS.filter(function (d) { return d.featured; })[0] || DRAMAS[0];
    if (feat) {
      $("#hero-feature").innerHTML =
        '<a class="hero-feature" href="' + dramaUrl(feat) + '" aria-label="Open ' + esc(feat.title) + '">' +
        '<img src="' + posterUrl(feat) + '" alt="' + esc(feat.title) + ' poster" width="400" height="300">' +
        '<div class="cap"><span>Featured</span><strong>' + esc(feat.title) + "</strong></div></a>";
    } else {
      $("#hero-feature").innerHTML = "";
    }

    if (DATA_ERROR && !DRAMAS.length) {
      $("#grid").innerHTML = '<p class="empty">Could not load content right now. Please refresh in a moment.</p>';
      $("#latest-section").hidden = true; $("#popular-section").hidden = true;
      return;
    }

    var list, title = "Turkish Dramas &amp; Movies";
    if (cat) {
      list = DRAMAS.filter(function (d) { return d.categories.indexOf(cat) > -1; });
      title = esc(catName(cat));
      document.title = catName(cat) + " | " + SITE.name;
      $("#hero").hidden = true;
    } else {
      list = DRAMAS.filter(function (d) { return !d.previousShow; });
      if (SITE.seoTitle) document.title = SITE.seoTitle;
      var md = $('meta[name="description"]');
      if (md && SITE.seoDescription) md.setAttribute("content", SITE.seoDescription);
    }
    $("#grid-title").innerHTML = title;
    $("#grid").innerHTML = cards(list);

    if (cat) {
      $("#latest-section").hidden = true; $("#popular-section").hidden = true;
      var ps0 = $("#previous-section"); if (ps0) ps0.hidden = true;
      return;
    }

    var eps = [];
    DRAMAS.forEach(function (d) {
      d.episodes.forEach(function (e) { if (e.available) eps.push({ d: d, e: e }); });
    });
    eps.sort(function (a, b) { return String(b.e.added || "").localeCompare(String(a.e.added || "")); });
    $("#latest").innerHTML = eps.slice(0, 8).map(function (x) {
      return '<a class="latest-item" href="' + epUrl(x.d, x.e.number) + '">' +
        '<img src="' + posterUrl(x.d) + '" alt="" loading="lazy" width="104" height="78"><div>' +
        "<strong>" + esc(x.d.title) + "</strong><span>Episode " + x.e.number + "</span></div></a>";
    }).join("") || '<p class="empty">No episodes yet.</p>';

    var pop = DRAMAS.filter(function (d) { return d.popular; });
    $("#popular").innerHTML = cards(pop);
    $("#popular-section").hidden = !pop.length;

    var prev = DRAMAS.filter(function (d) { return d.previousShow; });
    var ps = $("#previous-section");
    if (ps) {
      ps.hidden = !prev.length;
      $("#previous").innerHTML = cards(prev);
    }
  }

  /* ---------- DRAMA DETAIL ---------- */
  function notFound(msg) {
    $("#content").innerHTML = '<div class="prose"><h1>Not found</h1><p>' + esc(msg) +
      '</p><p><a href="' + ROOT + 'index.html">Back to home</a></p></div>';
    document.title = "Not found | Muhafız Playz";
  }

  function renderDrama() {
    var d = findDrama(params.get("id"));
    if (!d) return notFound("We could not find that title.");
    setMeta(d.title + " | Muhafız Playz", d.description, "pages/drama.html?id=" + d.id, posterUrl(d));
    var rows = d.episodes.map(function (e) {
      return '<li class="ep-row"><strong>Episode ' + e.number + "</strong>" +
        (e.available
          ? '<a class="btn btn-sm" href="' + epUrl(d, e.number) + '">Watch / Download</a>'
          : '<span class="soon">Coming Soon</span>') + "</li>";
    }).join("");
    $("#content").innerHTML =
      '<nav class="crumbs wrap" aria-label="Breadcrumb"><a href="' + ROOT + 'index.html">Home</a> / ' + esc(d.title) + "</nav>" +
      '<div class="wrap"><div class="detail"><div class="thumb"><img src="' + posterUrl(d) + '" alt="' + esc(d.title) + ' poster" width="400" height="300"></div>' +
      "<div><p class=\"eyebrow\">" + esc(catLabel(d)) + "</p><h1>" + esc(d.title) + "</h1>" +
      (d.status ? '<div class="tags"><span class="tag">' + esc(d.status) + "</span></div>" : "") +
      '<p class="desc">' + esc(d.description) + "</p>" +
      (d.releaseDate ? '<p class="facts">Release: ' + esc(d.releaseDate) + "</p>" : "") + "</div></div>" +
      '<div class="ad-slot" data-slot="drama-top"></div>' +
      '<section class="section"><h2 class="title">Episodes</h2><ul class="ep-list">' + rows + "</ul></section></div>";
  }

  /* ---------- EPISODE ---------- */
  function renderEpisode() {
    var d = findDrama(params.get("id")), e = d && findEp(d, params.get("ep"));
    if (!d || !e) return notFound("We could not find that episode.");
    var n = e.number;
    setMeta(d.title + " Episode " + n + " | Muhafız Playz", "Episode " + n + " of " + d.title + ". Watch / download page.", "pages/episode.html?id=" + d.id + "&ep=" + n, posterUrl(d));
    var prev = findEp(d, n - 1), next = findEp(d, n + 1);
    $("#content").innerHTML =
      '<nav class="crumbs wrap" aria-label="Breadcrumb"><a href="' + ROOT + 'index.html">Home</a> / <a href="' + dramaUrl(d) + '">' + esc(d.title) + "</a> / Episode " + n + "</nav>" +
      '<div class="wrap"><div class="detail"><div class="thumb"><img src="' + posterUrl(d) + '" alt="' + esc(d.title) + ' poster" width="400" height="300"></div>' +
      '<div><p class="eyebrow">' + esc(d.title) + "</p><h1>Episode " + n + "</h1>" +
      (e.available
        ? '<p class="desc">This episode is available. Choose a quality on the next page.</p><p style="margin-top:18px"><a class="btn" href="' + dlUrl(d, n) + '">Watch / Download</a></p>'
        : '<p class="soon">Coming Soon</p>') +
      '<div class="pager">' +
      (prev && prev.available ? '<a class="btn btn-ghost btn-sm" href="' + epUrl(d, prev.number) + '">&larr; Episode ' + prev.number + "</a>" : "") +
      '<a class="btn btn-ghost btn-sm" href="' + dramaUrl(d) + '">All episodes</a>' +
      (next && next.available ? '<a class="btn btn-ghost btn-sm" href="' + epUrl(d, next.number) + '">Episode ' + next.number + " &rarr;</a>" : "") +
      "</div></div></div>" +
      '<div class="ad-slot" data-slot="episode-bottom"></div></div>';
  }

  /* ---------- DOWNLOAD ---------- */
  function renderDownload() {
    var d = findDrama(params.get("id")), e = d && findEp(d, params.get("ep"));
    if (!d || !e) return notFound("We could not find that download.");
    var n = e.number;
    setMeta(d.title + " Episode " + n + " Download | Muhafız Playz", "Download " + d.title + " Episode " + n + " in available qualities.", "pages/download.html?id=" + d.id + "&ep=" + n, posterUrl(d));
    var rows = (e.available && e.downloadLinks.length)
      ? e.downloadLinks.map(function (l) {
          var placeholder = /REPLACE_ME/.test(l.url);
          return '<div class="q-row"><span class="q-name">' + esc(l.quality) +
            (placeholder ? '<span class="warn">PLACEHOLDER LINK</span>' : "") + "</span>" +
            '<a class="btn btn-sm" href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer nofollow" aria-label="Download ' +
            esc(d.title) + " episode " + n + " in " + esc(l.quality) + '">DOWNLOAD</a></div>';
        }).join("")
      : '<p class="soon">Coming Soon</p>';
    $("#content").innerHTML =
      '<nav class="crumbs wrap" aria-label="Breadcrumb"><a href="' + ROOT + 'index.html">Home</a> / <a href="' + dramaUrl(d) + '">' + esc(d.title) + "</a> / Download</nav>" +
      '<div class="wrap" style="padding-top:22px"><div class="panel"><h1>' + esc(d.title) + '</h1><p class="sub">Episode ' + n + "</p>" +
      '<h2 class="title" style="font-size:1.05rem;margin-bottom:8px">Available Qualities</h2>' + rows +
      '<p class="note">Links open on an external site. Content is shared only where we have permission to distribute it.</p></div>' +
      '<div class="pager"><a class="btn btn-ghost btn-sm" href="' + epUrl(d, n) + '">&larr; Back to episode</a></div>' +
      '<div class="ad-slot" data-slot="download-bottom"></div></div>';
  }

  /* ---------- start ---------- */
  renderHeader();
  renderFooter();

  // shared with search.js
  window.MP = { posterUrl: posterUrl, dramaUrl: dramaUrl, catLabel: catLabel, esc: esc };

  // loading placeholder while Supabase data arrives
  if (PAGE === "home") { $("#grid").innerHTML = '<p class="empty">Loading...</p>'; }
  else if (PAGE !== "static" && $("#content")) { $("#content").innerHTML = '<div class="wrap"><p class="empty" style="padding:30px 0">Loading...</p></div>'; }

  function start() {
    var navEl = $("#main-nav");
    if (navEl) navEl.innerHTML = navHtml();
    renderFooter();
    if (PAGE === "home") renderHome();
    else if (PAGE === "drama") renderDrama();
    else if (PAGE === "episode") renderEpisode();
    else if (PAGE === "download") renderDownload();
    document.dispatchEvent(new Event("mp:data"));
  }

  loadData().then(start, start);
})();
