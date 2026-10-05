/* ==========================================================
   Muhafız Playz — DATA FILE
   This is the only file you need to edit to change content.
   Rules: keep every comma, quote and bracket in place.
   ========================================================== */

/* ---------- SITE SETTINGS ---------- */
const SITE = {
  name: "Muhafız Playz",
  tagline: "Turkish Dramas & Entertainment",
  // Your real website address (no slash at the end). Change after publishing.
  url: "https://muhafizplayz.github.io/muhafizplayz",
  // Logo files live in assets/logo/. Replace the files, keep the names.
  logoIcon: "assets/logo/logo-icon.png",
  logoFull: "assets/logo/logo.png",
  contactEmail: "contact@example.com", // REPLACE
  // Social links: replace each "#" with your real link.
  social: {
    facebook: "#",   // REPLACE
    whatsapp: "#",   // REPLACE (WhatsApp Channel link)
    instagram: "#",  // REPLACE
    tiktok: "#",     // REPLACE
    telegram: "#"    // REPLACE
  }
};

/* ---------- CATEGORIES ----------
   To add a category, add one line. Use its "id" inside a drama's
   category list below. */
const CATEGORIES = [
  { id: "turkish-dramas", name: "Turkish Dramas" },
  { id: "urdu-dubbed",    name: "Urdu Dubbed" },
  { id: "movies",         name: "Movies" }
];

/* ---------- DRAMAS / MOVIES ----------
   poster: ""  -> shows a placeholder.
           "assets/images/my-poster.jpg" -> file you uploaded to GitHub
           "https://..." -> a full image link
   categories: one or more category ids
   featured: true  -> shown in the top section of the home page
   popular: true   -> shown in the Popular section
   status: small label on the card (e.g. "New", "Ongoing", "Completed") or ""
   episodes: each has number, available (true/false), added (date, used
             for "Latest Episodes") and downloadLinks. */

/* Helper for the sample data only: makes 3 placeholder links.
   You can delete this function once you write real links by hand. */
function placeholderLinks(slug, ep) {
  return [
    { quality: "720p",  url: "https://pixeldrain.com/u/REPLACE_ME_" + slug + "_E" + ep + "_720" },
    { quality: "780p",  url: "https://pixeldrain.com/u/REPLACE_ME_" + slug + "_E" + ep + "_780" },
    { quality: "1080p", url: "https://pixeldrain.com/u/REPLACE_ME_" + slug + "_E" + ep + "_1080" }
  ];
}

const DRAMAS = [
  {
    id: "gunesin-dogdugu-yer",
    title: "Güneşin Doğduğu Yer",
    categories: ["turkish-dramas"],
    poster: "",
    description: "Description coming soon. Replace this text with your own description.",
    releaseDate: "",
    status: "New",
    featured: true,
    popular: true,
    episodes: [
      {
        number: 1,
        available: true,
        added: "2026-10-01",
        /* EXAMPLE of writing links by hand — replace the url values */
        downloadLinks: [
          { quality: "720p",  url: "https://pixeldrain.com/u/REPLACE_ME_720P" },
          { quality: "780p",  url: "https://pixeldrain.com/u/REPLACE_ME_780P" },
          { quality: "1080p", url: "https://pixeldrain.com/u/REPLACE_ME_1080P" }
        ]
      },
      { number: 2, available: true, added: "2026-10-02", downloadLinks: placeholderLinks("gunesin", 2) },
      { number: 3, available: false, downloadLinks: [] }
    ]
  },
  {
    id: "haysiyet",
    title: "Haysiyet",
    categories: ["turkish-dramas"],
    poster: "",
    description: "Description coming soon. Replace this text with your own description.",
    releaseDate: "",
    status: "Ongoing",
    featured: false,
    popular: true,
    episodes: [
      { number: 1, available: true, added: "2026-09-28", downloadLinks: placeholderLinks("haysiyet", 1) },
      { number: 2, available: true, added: "2026-09-30", downloadLinks: placeholderLinks("haysiyet", 2) },
      { number: 3, available: false, downloadLinks: [] }
    ]
  },
  {
    id: "anne-yarisi",
    title: "Anne Yarısı",
    categories: ["turkish-dramas"],
    poster: "",
    description: "Description coming soon. Replace this text with your own description.",
    releaseDate: "",
    status: "",
    featured: false,
    popular: true,
    episodes: [
      { number: 1, available: true, added: "2026-09-25", downloadLinks: placeholderLinks("anneyarisi", 1) },
      { number: 2, available: false, downloadLinks: [] },
      { number: 3, available: false, downloadLinks: [] }
    ]
  },
  {
    id: "bir-gece-masali",
    title: "Bir Gece Masalı",
    categories: ["turkish-dramas"],
    poster: "",
    description: "Description coming soon. Replace this text with your own description.",
    releaseDate: "",
    status: "",
    featured: false,
    popular: false,
    episodes: [
      { number: 1, available: true, added: "2026-09-20", downloadLinks: placeholderLinks("birgecemasali", 1) },
      { number: 2, available: false, downloadLinks: [] },
      { number: 3, available: false, downloadLinks: [] }
    ]
  },
  {
    id: "sultan-mehmet-faith",
    title: "Sultan Mehmet Faith",
    categories: ["turkish-dramas"],
    poster: "",
    description: "Description coming soon. Replace this text with your own description.",
    releaseDate: "",
    status: "Coming Soon",
    featured: false,
    popular: false,
    episodes: [
      { number: 1, available: false, downloadLinks: [] },
      { number: 2, available: false, downloadLinks: [] },
      { number: 3, available: false, downloadLinks: [] }
    ]
  }
];
