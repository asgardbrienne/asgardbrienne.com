/* Menu mobile : bouton « Menu » et panneau de navigation sous l'en-tête.
   Le panneau reprend tous les liens de la navigation principale, newsletter comprise. */
(function () {
  var nav = document.querySelector(".header .nav");
  var links = nav && nav.querySelector(".links");
  if (!links) return;

  var panel = document.createElement("nav");
  panel.className = "mnav";
  panel.id = "mnav";
  panel.setAttribute("aria-label", "Menu");
  panel.hidden = true;
  links.querySelectorAll("a").forEach(function (a) {
    var c = a.cloneNode(true);
    var st = a.querySelector("strong");
    if (st) c.textContent = st.textContent;
    if (a.classList.contains("nav-np")) c.className = "mnav-np";
    else c.removeAttribute("class");
    panel.appendChild(c);
  });

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "mnav-toggle";
  btn.setAttribute("aria-controls", "mnav");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path class="l1" d="M4 7h16"/><path class="l2" d="M4 12h16"/><path class="l3" d="M4 17h16"/></svg><span>Menu</span>';

  nav.appendChild(btn);
  nav.parentNode.appendChild(panel);

  function set(open) {
    panel.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    document.documentElement.classList.toggle("mnav-open", open);
  }
  btn.addEventListener("click", function () { set(panel.hidden); });
  panel.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) { set(false); btn.focus(); }
  });
  document.addEventListener("click", function (e) {
    if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) set(false);
  });
  window.addEventListener("resize", function () { if (window.innerWidth > 760) set(false); });
})();

/* Apparition douce des blocs au défilement (désactivée si l'utilisateur réduit les animations) */
(function () {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var sel = "main section, .gcard, .tcard, .fcard, .intent, .np-card, .npx-t, .dc-card, .rc-card, .rc-g, .fd-top-i, .t5-list li, .diff-item";
  var els = [].slice.call(document.querySelectorAll(sel));
  var vh = window.innerHeight;
  els = els.filter(function (el) { return el.getBoundingClientRect().top > vh * 0.92; });
  if (!els.length) return;
  document.documentElement.classList.add("rv");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("rv-in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -6% 0px" });
  els.forEach(function (el) { el.classList.add("rv-item"); io.observe(el); });
  window.addEventListener("beforeprint", function () { els.forEach(function (el) { el.classList.add("rv-in"); }); });
})();

/* Menu déroulant « Comprendre » : clic, clavier, fermeture au clic extérieur ou avec Échap */
(function () {
  document.querySelectorAll(".dd").forEach(function (dd) {
    var btn = dd.querySelector(".dd-btn");
    if (!btn) return;
    function set(open) { dd.classList.toggle("open", open); btn.setAttribute("aria-expanded", open ? "true" : "false"); }
    btn.addEventListener("click", function (e) { e.stopPropagation(); set(!dd.classList.contains("open")); });
    document.addEventListener("click", function (e) { if (!dd.contains(e.target)) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && dd.classList.contains("open")) { set(false); btn.focus(); } });
    dd.addEventListener("focusout", function (e) { if (!dd.contains(e.relatedTarget)) set(false); });
  });
})();

/* Fiches race : sommaire actif, compteur, barre de lecture, idées reçues ouvertes à l'impression */
(function () {
  var wrap = document.querySelector(".rf-wrap");
  if (!wrap) return;
  var links = [].slice.call(wrap.querySelectorAll(".rf-toc a"));
  var secs = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });
  var bar = document.createElement("div");
  bar.className = "rf-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  var ticking = false;
  function update() {
    ticking = false;
    var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, y / h) : 0) + ")";
    var cur = -1;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < window.innerHeight * 0.35) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle("on", i === cur); });
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
  var n = document.querySelector("[data-count]");
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (n && "IntersectionObserver" in window && !still) {
    var end = +n.getAttribute("data-count");
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      var t0 = null;
      (function step(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / 1200);
        n.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    }, { threshold: 0.6 });
    n.textContent = "0";
    io.observe(n);
  }
  window.addEventListener("beforeprint", function () { [].forEach.call(document.querySelectorAll(".rf-myth"), function (d) { d.open = true; }); });
})();
