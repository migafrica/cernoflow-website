/* CernoFlow site-wide i18n.
   One signal — localStorage.cernoflow_lang — read by every page and by every
   bundled React app. Static pages mark translatable elements with
   `class="i18n" data-en="..." data-pt="..."`; the script swaps textContent on
   load and whenever the dropdown changes language. Bundled apps read
   window.cernoflowI18n.get() at boot and reload on switch.

   SUPPORTED lists the languages translated in the markup. PUBLISHED lists the
   ones offered to visitors: only these can be selected, and the switcher drops
   the rest on load. A stored language that is not published falls back to
   DEFAULT. */
(function () {
  var SUPPORTED = ['en', 'pt', 'es', 'fr']; // extend with 'de' as translations land
  var PUBLISHED = ['en', 'pt']; // add a language only after native review — see docs/translation-review.md
  var DEFAULT = 'en';
  var KEY = 'cernoflow_lang';

  function getLang() {
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) {}
    return PUBLISHED.indexOf(stored) >= 0 ? stored : DEFAULT;
  }

  function setLang(lang) {
    if (PUBLISHED.indexOf(lang) < 0) return;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    apply(lang);
    // Bundled React pages can't be hot-swapped — they read the lang at boot.
    // The data-reload-on-lang attribute opts a page into the reload behavior.
    if (document.documentElement.hasAttribute('data-reload-on-lang')) {
      location.reload();
    }
  }

  function apply(lang) {
    document.documentElement.lang = lang;
    var nodes = document.querySelectorAll('.i18n');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var txt = el.getAttribute('data-' + lang);
      if (txt === null) txt = el.getAttribute('data-en');
      if (txt !== null) el.textContent = txt;
    }
    // Update dropdown surfaces.
    var labels = document.querySelectorAll('.lang-current');
    for (var j = 0; j < labels.length; j++) labels[j].textContent = lang.toUpperCase();
    var options = document.querySelectorAll('.lang-option');
    for (var k = 0; k < options.length; k++) {
      options[k].setAttribute('aria-pressed', options[k].getAttribute('data-lang') === lang ? 'true' : 'false');
    }
  }

  // Set <html lang> as early as possible — before DOMContentLoaded — to keep
  // any lang-scoped CSS in sync from first paint.
  try { document.documentElement.lang = getLang(); } catch (e) {}

  document.addEventListener('DOMContentLoaded', function () {
    var allOptions = document.querySelectorAll('.lang-option');
    for (var o = 0; o < allOptions.length; o++) {
      if (PUBLISHED.indexOf(allOptions[o].getAttribute('data-lang')) < 0) {
        var item = allOptions[o].parentNode;
        item.parentNode.removeChild(item);
      }
    }

    apply(getLang());

    var toggles = document.querySelectorAll('.lang-toggle');
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].addEventListener('click', function (e) {
        e.stopPropagation();
        var menu = this.nextElementSibling;
        if (menu && menu.classList.contains('lang-menu')) menu.classList.toggle('open');
      });
    }

    var opts = document.querySelectorAll('.lang-option');
    for (var j = 0; j < opts.length; j++) {
      opts[j].addEventListener('click', function () {
        setLang(this.getAttribute('data-lang'));
        var open = document.querySelectorAll('.lang-menu.open');
        for (var n = 0; n < open.length; n++) open[n].classList.remove('open');
      });
    }

    document.addEventListener('click', function () {
      var open = document.querySelectorAll('.lang-menu.open');
      for (var n = 0; n < open.length; n++) open[n].classList.remove('open');
    });
  });

  // Cross-tab sync.
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) apply(getLang());
  });

  window.cernoflowI18n = { get: getLang, set: setLang, supported: SUPPORTED };
})();
