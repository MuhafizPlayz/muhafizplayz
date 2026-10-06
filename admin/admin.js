// Shared helpers for Muhafız Playz admin pages

function esc(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ş/g, "s")
    .replace(/ç/g, "c").replace(/ö/g, "o").replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toast(message, type) {
  var old = document.getElementById("toast");
  if (old) old.remove();
  var el = document.createElement("div");
  el.id = "toast";
  el.className = "toast " + (type === "err" ? "err" : "ok");
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(function () { el.remove(); }, type === "err" ? 6000 : 3000);
}

function renderNav(active) {
  var links = [
    ["index", "index.html", "📊 Dashboard"],
    ["dramas", "dramas.html", "🎬 Dramas"],
    ["episodes", "episodes.html", "📺 Episodes"],
    ["categories", "categories.html", "🗂️ Categories"],
    ["social", "social.html", "🔗 Social Links"],
    ["settings", "settings.html", "⚙️ Settings"],
    ["contact", "contact.html", "✉️ Contact"]
  ];
  var html =
    '<div class="brand"><img src="../assets/logo/logo.png" alt="" onerror="this.style.display=\'none\'">' +
    "<div><b>Muhafız Playz</b><span>Admin Panel</span></div></div><nav class=\"nav\">";
  links.forEach(function (l) {
    html += '<a href="' + l[1] + '"' + (l[0] === active ? ' class="active"' : "") + ">" + l[2] + "</a>";
  });
  html += '<div class="sep"></div>' +
    '<a href="../index.html" target="_blank">🌐 View Website</a>' +
    '<button type="button" onclick="logoutUser()">🚪 Logout</button></nav>';
  document.getElementById("sidebar").innerHTML = html;
}
