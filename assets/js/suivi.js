/* Reprendre sa lecture et temps de lecture.
   - Sur un guide ou une fiche : affiche le temps de lecture estimé et
     retient, dans ce navigateur seulement, où le lecteur s'est arrêté.
   - Sur la page d'accueil : propose de reprendre le dernier guide
     commencé et pas terminé. Rien n'est envoyé : tout reste sur l'appareil. */
(function () {
  var KEY = "ab-lecture";
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }

  var article = document.querySelector("article.guide, .f-body");
  if (article) {
    // Temps de lecture (environ 200 mots par minute)
    var words = (article.innerText || "").split(/\s+/).length;
    var min = Math.max(2, Math.round(words / 200));
    var badge = document.querySelector(".g-badge");
    if (badge && !document.querySelector(".read-time")) {
      var t = document.createElement("span");
      t.className = "read-time";
      t.textContent = min + " min de lecture";
      badge.insertAdjacentElement("afterend", t);
    }
    // Position de lecture
    var h1 = document.querySelector("h1");
    var title = h1 ? h1.textContent.trim() : document.title;
    var path = location.pathname;
    var tick = null;
    window.addEventListener("scroll", function () {
      if (tick) return;
      tick = setTimeout(function () {
        tick = null;
        var d = document.documentElement, max = d.scrollHeight - d.clientHeight;
        var pct = max > 0 ? Math.round((d.scrollTop / max) * 100) : 0;
        if (pct < 8) return;
        save({ path: path, title: title, pct: pct, y: d.scrollTop, t: Date.now() });
      }, 400);
    }, { passive: true });
    // Retour à l'endroit exact si on arrive depuis « Reprendre »
    if (location.hash === "#reprendre") {
      var v = load();
      if (v && v.path === path) setTimeout(function () { window.scrollTo(0, v.y); }, 50);
    }
    return;
  }

  var anchor = document.getElementById("guides");
  var v = load();
  if (!anchor || !v || v.pct >= 90 || Date.now() - v.t > 1000 * 60 * 60 * 24 * 30) return;
  var box = document.createElement("div");
  box.className = "resume no-print";
  var a = document.createElement("a");
  a.href = v.path.replace(/^.*?\/(guides|fiches|outils)\//, "$1/") + "#reprendre";
  a.innerHTML = '<span class="resume-k">Reprendre ta lecture</span><strong></strong><span class="resume-bar"><i></i></span>';
  a.querySelector("strong").textContent = v.title;
  a.querySelector("i").style.width = v.pct + "%";
  box.appendChild(a);
  var c = anchor.querySelector(".container");
  if (c) c.insertBefore(box, c.firstChild);
})();
