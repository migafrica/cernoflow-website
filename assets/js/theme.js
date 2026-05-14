/* CernoFlow site-wide light/dark theme.
   Mirrors the same pattern as i18n.js — one signal in localStorage, applied
   to <html data-theme="..."> as early as possible so CSS variables flip
   before first paint. Toggle UI is the .theme-toggle button in the topbar. */
(function () {
  var KEY = 'cernoflow_theme';

  function get() {
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) {}
    if (stored === 'light' || stored === 'dark') return stored;
    return 'dark';
  }

  function set(theme) {
    if (theme !== 'light' && theme !== 'dark') return;
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    apply(theme);
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      btns[i].setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  // Apply early to avoid a flash of the wrong theme.
  apply(get());

  document.addEventListener('DOMContentLoaded', function () {
    apply(get());
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        set(get() === 'dark' ? 'light' : 'dark');
      });
    }
  });

  // Cross-tab sync.
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) apply(get());
  });

  window.cernoflowTheme = { get: get, set: set };
})();
