/* CernoFlow mobile menu, shared by every page with a .topbar.
   Each .nav-toggle controls the <nav> named in its aria-controls. The button is
   hidden above 880px, so the panel only ever opens on small screens.
   Listens in the capture phase because i18n.js stops propagation on the language
   toggle, and a bubbling listener would never see those clicks. */
(function () {
  var SMALL = window.matchMedia('(max-width: 880px)');

  function closeLangMenus() {
    var open = document.querySelectorAll('.lang-menu.open');
    for (var i = 0; i < open.length; i++) open[i].classList.remove('open');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggles = Array.prototype.slice.call(document.querySelectorAll('.nav-toggle'));

    function panelOf(toggle) {
      return document.getElementById(toggle.getAttribute('aria-controls'));
    }

    function setOpen(toggle, open) {
      var panel = panelOf(toggle);
      if (!panel) return;
      panel.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function closeAll() {
      toggles.forEach(function (t) { setOpen(t, false); });
    }

    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        if (!SMALL.matches) return;
        var willOpen = toggle.getAttribute('aria-expanded') !== 'true';
        closeAll();
        if (willOpen) {
          closeLangMenus();
          setOpen(toggle, true);
        }
      });
    });

    document.addEventListener('click', function (e) {
      var t = e.target;
      if (t.closest('.lang-toggle')) { closeAll(); return; }
      if (t.closest('.topbar-nav a')) { closeAll(); return; }
      if (!t.closest('.topbar')) closeAll();
    }, true);

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      toggles.forEach(function (t) {
        if (t.getAttribute('aria-expanded') === 'true') {
          setOpen(t, false);
          t.focus();
        }
      });
    });

    SMALL.addEventListener('change', closeAll);
  });
})();
