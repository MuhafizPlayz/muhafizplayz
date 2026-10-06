/* ==========================================================
   Muhafız Playz — DATA LOADER (Supabase)
   Ab dramas, episodes, categories, social links aur settings
   Supabase se aate hain. Is file ko edit karne ki zarurat nahi.
   Admin dashboard se jo bhi change karenge, website par dikhega.
   ========================================================== */

/* Default values (agar Supabase se kuch na mile to ye use hongi) */
var SITE = {
  name: "Muhafız Playz",
  tagline: "Turkish Dramas & Entertainment",
  url: "https://muhafizplayz.github.io/muhafizplayz",
  logoIcon: "assets/logo/logo-icon.png",
  logoFull: "assets/logo/logo.png",
  contactEmail: "contact@example.com",
  footerText: "",
  seoTitle: "",
  seoDescription: "",
  social: { facebook: "", whatsapp: "", instagram: "", tiktok: "", telegram: "", youtube: "" }
};

var CATEGORIES = [];
var DRAMAS = [];
var DATA_ERROR = null;

function dataSlug(s) {
  return String(s || "").toLowerCase().replace(/ı/g, "i").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function loadData() {
  var db = window.supabaseClient || (typeof supabaseClient !== "undefined" ? supabaseClient : null);
  if (!db) {
    DATA_ERROR = "Supabase did not load.";
    return Promise.resolve();
  }

  function one(table) {
    return db.from(table).select("*").limit(1).maybeSingle().then(function (r) { return r.data || null; }, function () { return null; });
  }

  return Promise.all([
    db.from("categories").select("*").order("sort_order"),
    db.from("dramas").select("*").eq("published", true).order("sort_order").order("created_at", { ascending: false }),
    db.from("episodes").select("*").eq("published", true).order("episode_number"),
    one("site_settings"),
    one("social_links"),
    one("contact_settings")
  ]).then(function (res) {
    var catRes = res[0], dramaRes = res[1], epRes = res[2];
    var settings = res[3], social = res[4], contact = res[5];

    if (dramaRes.error) { DATA_ERROR = dramaRes.error.message; }

    /* ----- site settings ----- */
    if (settings) {
      if (settings.site_name) SITE.name = settings.site_name;
      if (settings.site_url) SITE.url = String(settings.site_url).replace(/\/+$/, "");
      if (settings.logo_url) { SITE.logoIcon = settings.logo_url; SITE.logoFull = settings.logo_url; }
      if (settings.footer_text) SITE.footerText = settings.footer_text;
      if (settings.seo_title) SITE.seoTitle = settings.seo_title;
      if (settings.seo_description) SITE.seoDescription = settings.seo_description;
      else if (settings.description) SITE.seoDescription = settings.description;
    }
    if (social) {
      ["facebook", "whatsapp", "instagram", "tiktok", "telegram", "youtube"].forEach(function (k) {
        if (social[k + "_url"]) SITE.social[k] = social[k + "_url"];
      });
    }
    if (contact && contact.contact_email) SITE.contactEmail = contact.contact_email;

    /* ----- categories ----- */
    CATEGORIES = (catRes.data || []).map(function (c) { return { id: c.slug, name: c.name }; });

    function catIdFor(name) {
      if (!name) return null;
      var low = String(name).toLowerCase();
      var found = CATEGORIES.filter(function (c) { return c.name.toLowerCase() === low; })[0];
      if (found) return found.id;
      var id = dataSlug(name);
      CATEGORIES.push({ id: id, name: name });
      return id;
    }

    /* ----- episodes grouped by drama ----- */
    var byDrama = {};
    (epRes.data || []).forEach(function (e) {
      var links = [];
      if (e.server1_url) links.push({ quality: "Server 1 (Watch)", url: e.server1_url });
      if (e.download_480_url) links.push({ quality: "480p", url: e.download_480_url });
      if (e.download_720_url) links.push({ quality: "720p", url: e.download_720_url });
      if (e.download_1080_url) links.push({ quality: "1080p", url: e.download_1080_url });
      (byDrama[e.drama_id] = byDrama[e.drama_id] || []).push({
        number: e.episode_number,
        title: e.title || "",
        available: links.length > 0,
        added: e.release_date || String(e.created_at || "").slice(0, 10),
        downloadLinks: links
      });
    });

    /* ----- dramas ----- */
    DRAMAS = (dramaRes.data || []).map(function (r) {
      var cid = catIdFor(r.category);
      return {
        id: r.slug,
        title: r.title,
        urduTitle: r.urdu_title || "",
        categories: cid ? [cid] : [],
        poster: r.poster_url || "",
        description: r.description || "",
        releaseDate: r.year ? String(r.year) : "",
        status: r.coming_soon ? "Coming Soon" : (r.status || ""),
        featured: !!r.featured,
        comingSoon: !!r.coming_soon,
        previousShow: !!r.previous_show,
        popular: false,
        episodes: byDrama[r.id] || []
      };
    });

    /* Popular = sab se zyada available episodes wale (max 6) */
    DRAMAS.slice().filter(function (d) { return !d.comingSoon && !d.previousShow; })
      .map(function (d) { return { d: d, n: d.episodes.filter(function (e) { return e.available; }).length }; })
      .filter(function (x) { return x.n > 0; })
      .sort(function (a, b) { return b.n - a.n; })
      .slice(0, 6)
      .forEach(function (x) { x.d.popular = true; });
  }).catch(function (err) {
    DATA_ERROR = (err && err.message) || "Could not load data.";
  });
}
