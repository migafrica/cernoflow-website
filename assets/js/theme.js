/* CernoFlow site-wide theme.
   Toggle is disabled for now — site is forced dark site-wide.
   Light-mode CSS is retained so the toggle can be re-enabled later
   by restoring this file. */
(function () {
  function apply() {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  apply();

  document.addEventListener('DOMContentLoaded', function () {
    apply();
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) { btns[i].hidden = true; }
  });

  window.cernoflowTheme = { get: function () { return 'dark'; } };
})();
