/* purpleDrop — shared behaviour: mobile menu + scroll reveals with failsafes. */
(function () {
  /* Mobile menu: markup exists on every page; toggle is bound here. */
  var toggle = document.getElementById('pd-nav-toggle');
  var menu = document.getElementById('pd-mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target && e.target.tagName === 'A') {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Scroll reveals: only elements with .reveal are affected, and only
     after this script runs (html.js is added by the inline head script).
     Failsafe: after 2.5s everything is forced visible regardless. */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function showAll() { document.documentElement.classList.add('reveal-done'); }
  if (!('IntersectionObserver' in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    setTimeout(showAll, 2500);
  }

  /* Footer year. */
  var y = document.getElementById('pd-year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* purpleDrop — storyboard: "Where are you?" self-check + prompt copy buttons.
   Enhancement only: with JS off, every stage, CTA and prompt stays visible
   and readable; the chooser buttons simply do nothing. */
(function () {
  /* Self-check chooser: tapping an option highlights the matching stages
     and points to the matching offer. Tapping again clears the choice. */
  var resultEl = document.getElementById('choice-result');
  var choices = Array.prototype.slice.call(document.querySelectorAll('.choice[data-choice]'));
  var stages = Array.prototype.slice.call(document.querySelectorAll('.stage[data-stage]'));
  var defaultResult = resultEl ? resultEl.innerHTML : '';
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var choiceMap = {
    'old-site': {
      stages: ['2', '6'],
      html: `That's stages 2 and 6. Usually the <a href="/services/#update">Revive</a> — a refresh of the site you have. If the old site can't be saved, it's the <a href="/services/#redesign">Rebuild</a>. The free check confirms which one, on the call. <a href="/contact/">Book the free check &rarr;</a>`
    },
    'ai-missing': {
      stages: ['3'],
      html: `That's stage 3. Usually the <a href="/services/#fix">Fix</a> — the site is fine, AI just can't describe it. If the message itself needs rework, it's the <a href="/services/#update">Revive</a>. The free check shows which, live. <a href="/contact/">Book the free check &rarr;</a>`
    },
    'domain': {
      stages: ['7'],
      html: `That's stage 7 — and we sort it out first, on the call, before any work. Not sure? <a href="https://lookup.icann.org/en" target="_blank" rel="noopener noreferrer">Check who your domain is registered to (ICANN Lookup, opens in a new tab)</a> — it takes about 30 seconds. <a href="/contact/">Book a call &rarr;</a>`
    },
    'no-purpose': {
      stages: ['1', '5', '6'],
      html: `That's stages 1, 5 and 6. Start with the <a href="/ai-check/">free check</a> — it tells you which of the three fits, or that you don't need any of them. <a href="/contact/">Book the free check &rarr;</a>`
    }
  };

  function clearChoice() {
    choices.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    stages.forEach(function (s) { s.classList.remove('is-match'); });
    if (resultEl) resultEl.innerHTML = defaultResult;
  }

  choices.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-choice');
      var entry = choiceMap[key];
      if (!entry) return;
      if (btn.getAttribute('aria-pressed') === 'true') { clearChoice(); return; }
      clearChoice();
      btn.setAttribute('aria-pressed', 'true');
      stages.forEach(function (s) {
        if (entry.stages.indexOf(s.getAttribute('data-stage')) !== -1) {
          s.classList.add('is-match');
        }
      });
      if (resultEl) resultEl.innerHTML = entry.html;
      var first = document.getElementById('stage-' + entry.stages[0]);
      if (first) {
        first.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
      }
    });
  });

  /* Copy buttons for the try-it-yourself prompt boxes. */
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* clipboard unavailable */ }
    document.body.removeChild(ta);
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-copy-target]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.getElementById(btn.getAttribute('data-copy-target'));
      if (!target) return;
      var text = (target.innerText || target.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
      var original = btn.textContent;
      function done() {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = original; }, 2000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else {
        fallbackCopy(text);
        done();
      }
    });
  });
})();
