(function(){
  // /services and /contact are static pages outside the app router: force real
  // navigations. Delegated at document level so it survives client re-renders.
  document.addEventListener('click', function(e){
    var a = e.target && e.target.closest ? e.target.closest('a[href="/services"], a[href="/contact"]') : null;
    if (a) { e.preventDefault(); e.stopPropagation(); window.location.href = a.getAttribute('href'); }
  }, true);

  // Footer tagline. The app re-renders after load, so re-insert when missing.
  function tagline(){
    var wm = document.querySelector('footer a[href="/"]');
    if (wm && !document.getElementById('pd-tagline')) {
      var t = document.createElement('span');
      t.id = 'pd-tagline';
      t.textContent = 'By Design';
      t.style.cssText = 'display:block;font-size:11px;letter-spacing:.18em;text-transform:uppercase;opacity:.65;margin-top:2px';
      wm.appendChild(t);
    }
  }
  if (document.readyState !== 'loading') tagline(); else document.addEventListener('DOMContentLoaded', tagline);

  // Mobile menu (static pages have no app JS to run the hamburger)
  function menu(){
    var b = document.querySelector('button[aria-label="Toggle menu"]');
    var m = document.getElementById('pd-mobile-menu');
    if (b && m && !b.dataset.pdBound) {
      b.dataset.pdBound = '1';
      b.addEventListener('click', function(){
        var open = m.hasAttribute('hidden');
        if (open) { m.removeAttribute('hidden'); } else { m.setAttribute('hidden',''); }
        b.setAttribute('aria-expanded', String(open));
      });
    }
  }
  if (document.readyState !== 'loading') menu(); else document.addEventListener('DOMContentLoaded', menu);
  new MutationObserver(tagline).observe(document.documentElement, {childList:true, subtree:true});
})();
