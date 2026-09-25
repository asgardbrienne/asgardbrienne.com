/* Inscription à la newsletter sans quitter le site.
   Envoie le formulaire à Brevo en arrière-plan et affiche le résultat
   sous le bouton. Si l'envoi en arrière-plan échoue (réseau, blocage),
   le formulaire est envoyé normalement vers la page de Brevo. */
(function () {
  var ACTION = window.NEWSLETTER_ACTION;
  if (!ACTION || !window.fetch || !window.FormData) return;

  document.querySelectorAll("form.js-newsletter").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      if (form.dataset.fallback) return; // envoi classique demandé
      e.preventDefault();
      var msg = form.querySelector(".form-msg");
      var btn = form.querySelector("button[type=submit]");
      var say = function (t, ok) {
        if (!msg) return;
        msg.textContent = t;
        msg.style.color = ok ? "var(--sage2)" : "var(--terra2)";
        msg.style.fontWeight = "700";
      };
      if (btn) btn.disabled = true;
      say("Envoi en cours…", true);

      fetch(ACTION + (ACTION.indexOf("?") < 0 ? "?" : "&") + "isAjax=1", {
        method: "POST",
        body: new FormData(form)
      })
        .then(function (r) {
          return r.text().then(function (t) {
            var d = null;
            try { d = JSON.parse(t); } catch (err) {}
            return { ok: r.ok, data: d };
          });
        })
        .then(function (res) {
          if (btn) btn.disabled = false;
          if (res.ok && (!res.data || res.data.success !== false)) {
            form.reset();
            say("Presque fini : un e-mail de confirmation vient de t’être envoyé. Clique sur le lien qu’il contient pour valider ton inscription (pense à regarder dans les spams).", true);
          } else {
            say("L’inscription n’a pas abouti. Vérifie ton adresse e-mail et réessaie.", false);
          }
        })
        .catch(function () {
          // Envoi en arrière-plan impossible : on passe par la page de Brevo
          form.dataset.fallback = "1";
          form.action = ACTION;
          form.method = "post";
          form.submit();
        });
    });
  });
})();
