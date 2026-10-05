/* Muhafız Playz — client-side search (no reload, no server). */
(function () {
  "use strict";
  var overlay = document.getElementById("search-overlay");
  var input = document.getElementById("search-input");
  var results = document.getElementById("search-results");
  var openBtn = document.getElementById("search-open");
  var closeBtn = document.getElementById("search-close");
  if (!overlay || !window.MP) return;

  // "Güneşin" matches "gunesin": remove accents and turn dotless ı into i.
  function norm(s) {
    return String(s).toLowerCase().replace(/ı/g, "i").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function show(q) {
    var term = norm(q).trim();
    if (!term) { results.innerHTML = ""; return; }
    var found = DRAMAS.filter(function (d) {
      return norm(d.title + " " + MP.catLabel(d)).indexOf(term) > -1;
    });
    if (!found.length) { results.innerHTML = '<p class="no-results">No results found</p>'; return; }
    results.innerHTML = found.map(function (d) {
      return '<a href="' + MP.dramaUrl(d) + '"><img src="' + MP.posterUrl(d) + '" alt="" width="72" height="54">' +
        "<span><strong>" + MP.esc(d.title) + "</strong><small>" + MP.esc(MP.catLabel(d)) + "</small></span></a>";
    }).join("");
  }

  function open() {
    overlay.classList.add("open");
    input.value = ""; results.innerHTML = "";
    input.focus();
  }
  function close() { overlay.classList.remove("open"); openBtn.focus(); }

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
  input.addEventListener("input", function () { show(input.value); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("open")) close();
  });
})();
