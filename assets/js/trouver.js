/* Parcours « Trouve la bonne ressource » : comportement, situation, résultat.
   Oriente vers les pages du site ; ne pose aucun diagnostic. Rien n'est envoyé. */
(function () {
  var root = document.getElementById("trouver-app");
  var D = window.TROUVER;
  if (!root || !D) return;
  root.hidden = false;
  var steps = root.querySelectorAll(".tr-steps li");
  var body = root.querySelector(".tr-body");
  var back = root.querySelector(".tr-back");
  var hist = [];

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function setStep(n) {
    steps.forEach(function (s, i) { s.classList.toggle("on", i === n); s.classList.toggle("done", i < n); });
    back.hidden = n === 0;
  }
  function focusTitle() { var h = body.querySelector("h3"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); } }
  function choices(title, list, onPick) {
    body.innerHTML = "";
    body.appendChild(el("h3", "tr-q", title));
    var g = el("div", "tr-opts");
    list.forEach(function (label, i) {
      var b = el("button", "tr-opt", label); b.type = "button";
      b.addEventListener("click", function () { onPick(i); });
      g.appendChild(b);
    });
    body.appendChild(g);
  }
  function card(u, main) {
    var p = D.P[u]; var a = el("a", main ? "tr-res tr-main" : "tr-res");
    a.href = p.u;
    a.appendChild(el("span", "tr-k", p.k));
    a.appendChild(el("strong", null, p.t));
    if (main) a.appendChild(el("p", null, p.d));
    a.appendChild(el("span", "more", main ? "Commencer par là →" : "Voir →"));
    return a;
  }
  function showBehaviours() {
    hist = []; setStep(0);
    choices("Qu’est-ce qui te pose problème en ce moment ?", D.T.map(function (b) { return b.q; }), function (i) { hist.push(i); showSituations(i); focusTitle(); });
  }
  function showSituations(i) {
    setStep(1);
    var b = D.T[i];
    choices("Dans quelle situation ?", b.s.map(function (s) { return s.l; }), function (j) { hist.push(j); showResult(i, j); focusTitle(); });
    body.insertBefore(el("p", "tr-ctx", b.q), body.firstChild);
  }
  function showResult(i, j) {
    setStep(2);
    var s = D.T[i].s[j];
    body.innerHTML = "";
    body.appendChild(el("p", "tr-ctx", D.T[i].q + " · " + s.l));
    body.appendChild(el("h3", "tr-q", "Par ici"));
    if (s.a) { var w = el("div", "tr-alert"); w.appendChild(el("strong", null, "D’abord : ")); w.appendChild(document.createTextNode(s.a)); body.appendChild(w); }
    body.appendChild(card(s.r[0], true));
    var g = el("div", "tr-more");
    s.r.slice(1).forEach(function (u) { g.appendChild(card(u, false)); });
    body.appendChild(g);
    var again = el("button", "tr-again", "Recommencer"); again.type = "button";
    again.addEventListener("click", function () { showBehaviours(); focusTitle(); });
    body.appendChild(again);
  }
  back.addEventListener("click", function () {
    if (hist.length === 2) { hist.pop(); showSituations(hist[0]); }
    else { showBehaviours(); }
    focusTitle();
  });
  showBehaviours();
})();
