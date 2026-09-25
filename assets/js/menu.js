/* Menu mobile : bouton « Menu » et panneau de navigation sous l'en-tête.
   Le panneau reprend les liens de la navigation principale de la page. */
(function () {
  var nav = document.querySelector(".header .nav");
  var links = nav && nav.querySelector(".links");
  if (!links) return;

  var panel = document.createElement("nav");
  panel.className = "mnav";
  panel.id = "mnav";
  panel.setAttribute("aria-label", "Menu");
  panel.hidden = true;
  links.querySelectorAll("a:not(.btn)").forEach(function (a) {
    var c = a.cloneNode(true);
    c.removeAttribute("class");
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
