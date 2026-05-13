/* CernoFlow site-wide i18n.
   One signal — localStorage.cernoflow_lang — read by every page and by every
   bundled React app. Static pages mark translatable elements with
   `class="i18n" data-en="..." data-pt="..."`; the script swaps textContent on
   load and whenever the dropdown changes language. Bundled apps read
   window.cernoflowI18n.get() at boot and reload on switch. */
(function () {
  var SUPPORTED = ['en', 'pt']; // extend with 'fr', 'es', 'de' as translations land
  var DEFAULT = 'en';
  var KEY = 'cernoflow_lang';
  var FLAGS = { en: '🇬🇧', pt: '🇵🇹', fr: '🇫🇷', es: '🇪🇸', de: '🇩🇪' };

  function getLang() {
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) {}
    return SUPPORTED.indexOf(stored) >= 0 ? stored : DEFAULT;
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) < 0) return;
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
    var flagEls = document.querySelectorAll('.lang-current-flag');
    for (var f = 0; f < flagEls.length; f++) flagEls[f].textContent = FLAGS[lang] || '';
    var options = document.querySelectorAll('.lang-option');
    for (var k = 0; k < options.length; k++) {
      options[k].setAttribute('aria-pressed', options[k].getAttribute('data-lang') === lang ? 'true' : 'false');
    }
  }

  // Set <html lang> as early as possible — before DOMContentLoaded — to keep
  // any lang-scoped CSS in sync from first paint.
  try { document.documentElement.lang = getLang(); } catch (e) {}

  document.addEventListener('DOMContentLoaded', function () {
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
