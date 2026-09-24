/* La vie d'Asgard & Brienne : scripts communs */

/* Le réglage de l'inscription se fait dans assets/js/config.js */
var NEWSLETTER_ACTION = window.NEWSLETTER_ACTION || "";

(function () {
  // Âges calculés à partir des dates de naissance (toujours à jour)
  function age(born) {
    var b = new Date(born + "T00:00:00"), n = new Date();
    var days = Math.floor((n - b) / 86400000);
    if (days < 0) return "";
    if (days < 112) return Math.floor(days / 7) + " semaines";
    var m = (n.getFullYear() - b.getFullYear()) * 12 + (n.getMonth() - b.getMonth());
    if (n.getDate() < b.getDate()) m--;
    if (m < 24) return m + " mois";
    return Math.floor(m / 12) + " ans";
  }
  document.querySelectorAll("[data-born]").forEach(function (el) {
    var a = age(el.getAttribute("data-born"));
    if (a) el.textContent = a;
  });

  // Formulaires d'inscription
  document.querySelectorAll("form.js-newsletter").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      var msg = form.querySelector(".form-msg");
      if (!NEWSLETTER_ACTION) {
        e.preventDefault();
        if (msg) msg.textContent = "Les inscriptions ouvrent très bientôt. En attendant, retrouve-nous sur Instagram ou TikTok.";
        return;
      }
      form.action = NEWSLETTER_ACTION;
      form.method = "post";
    });
  });

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

/* Guides : barre de lecture et quiz */
(function () {
  var bar = document.querySelector(".readbar span");
  if (bar) {
    var upd = function () {
      var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", upd, { passive: true }); upd();
  }
  document.querySelectorAll(".qz").forEach(function (q) {
    q.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        if (q.classList.contains("done")) return;
        var good = b.getAttribute("data-v") === q.getAttribute("data-answer");
        b.classList.add(good ? "ok" : "ko");
        if (!good) q.querySelector('button[data-v="' + q.getAttribute("data-answer") + '"]').classList.add("ok");
        var e = q.querySelector(".qz-e");
        e.insertAdjacentText("afterbegin", good ? "Bien vu. " : "Pas tout à fait. ");
        q.classList.add("done");
      });
    });
  });
  window.addEventListener("beforeprint", function () {
    document.querySelectorAll(".reveal details").forEach(function (d) { d.open = true; });
  });
})();
