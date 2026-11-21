/* purpleDrop — shared behaviour: mobile menu, scroll-craft motion, storyboard.
   Scroll is the timeline here, not a trigger for a generic fade. The storyboard
   progress line draws as you travel, stage nodes light when reached, headlines
   assemble line by line, the hero AI panel assembles in sequence, and the page
   ground deepens around the "why this is confusing" section and comes back.

   Failsafes (content must never be stuck invisible):
   - Nothing is hidden until this script runs (html.sc-on). A 6s backstop
     timer in this script forces revealed content visible if the observer
     or watchdog ever fail to. (Previously an inline head timer; moved
     here so the CSP needs no 'unsafe-inline' in script-src.)
   - If IntersectionObserver is missing, everything reveals at once.
   - A watchdog forces visible any .reveal that has sat in view for over 1s
     without revealing. There is NO blanket force-visible timeout: the old
     2.5s timer defeated the scroll effects, so it is gone.
   - If this script throws mid-run, .sc-failed forces everything visible.
   - With JS off, no .js/.sc-on class exists, so nothing is ever hidden.
   - Reduced motion: everything visible, no driver, no splitting. */
(function () {
  'use strict';
  var docEl = document.documentElement;
  /* Moved here from the inline head script (CSP: no 'unsafe-inline' in
     script-src). Adds .js, then a 6s backstop forcing revealed content
     visible if the observer or watchdog ever fail to. */
  docEl.classList.add('js');
  window.__pdMotionTimer = setTimeout(function () { docEl.classList.add('reveal-done'); }, 6000);
  docEl.classList.remove('reveal-done');
  docEl.classList.add('sc-on');

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function failSafe() { docEl.classList.add('sc-failed'); }

  try {
    /* ---------- mobile menu ---------- */
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

    /* Header gains its shadow once the page has moved. */
    var header = document.querySelector('.site-header');
    if (header) {
      var onScrollHeader = function () {
        header.classList.toggle('scrolled', window.scrollY > 8);
      };
      window.addEventListener('scroll', onScrollHeader, { passive: true });
      onScrollHeader();
    }

    /* Footer year. */
    var y = document.getElementById('pd-year');
    if (y) y.textContent = new Date().getFullYear();

    /* ---------- sticky call bar: wait until the hero buttons have scrolled away ----------
     Only on pages that have hero buttons. Without JS, or if anything fails, the bar stays visible. */
  try {
    var heroCtas = document.querySelector('.hero-ctas');
    if (heroCtas && 'IntersectionObserver' in window && document.querySelector('.mobile-cta')) {
      docEl.classList.add('cta-wait');
      new IntersectionObserver(function (entries) {
        var e = entries[0];
        var gone = !e.isIntersecting && e.boundingClientRect.top < 0;
        docEl.classList.toggle('cta-show', gone);
      }, { threshold: 0 }).observe(heroCtas);
    }
  } catch (err2) { docEl.classList.remove('cta-wait'); }

  /* ---------- trailing drop cursor: purple drops follow the pointer ----------
     Decorative only. Fixed canvas, pointer-events none, native cursor untouched.
     Not started on touch, reduced motion, high contrast or forced colors. */
  try {
    var mq = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
    var trailOk = window.matchMedia && mq('(hover: hover) and (pointer: fine)') &&
      !mq('(prefers-reduced-motion: reduce)') && !mq('(forced-colors: active)') && !mq('(prefers-contrast: more)');
    if (trailOk) {
      var cv = document.createElement('canvas');
      cv.className = 'pd-trail';
      cv.setAttribute('aria-hidden', 'true');
      document.body.appendChild(cv);
      var cx = cv.getContext('2d');
      var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0;
      var fit = function () {
        W = window.innerWidth; H = window.innerHeight;
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
        cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      fit(); window.addEventListener('resize', fit);
      var N = 12, pts = [], tx = -100, ty = -100, trailSeen = false, running = false;
      for (var i = 0; i < N; i++) pts.push({ x: -100, y: -100 });
      var drop = function (x, y, r, a, ang) {
        cx.save(); cx.translate(x, y); cx.rotate(ang);
        cx.globalAlpha = a; cx.fillStyle = '#6D28D9';
        cx.beginPath();
        cx.moveTo(0, -r * 1.7);
        cx.bezierCurveTo(r * 1.1, -r * .35, r * 1.1, r, 0, r);
        cx.bezierCurveTo(-r * 1.1, r, -r * 1.1, -r * .35, 0, -r * 1.7);
        cx.fill(); cx.restore();
      };
      var tick = function () {
        cx.clearRect(0, 0, W, H);
        var moving = false, px = tx, py = ty;
        for (var k = 0; k < N; k++) {
          var p = pts[k], ease = .34 - k * .02;
          var dx = px - p.x, dy = py - p.y;
          p.x += dx * ease; p.y += dy * ease;
          if (Math.abs(dx) > .4 || Math.abs(dy) > .4) moving = true;
          var t = 1 - k / N, ang = Math.atan2(dy, dx) + Math.PI / 2;
          drop(p.x, p.y, 2.5 + 5.5 * t, .08 + .6 * t * t, isFinite(ang) ? ang : 0);
          px = p.x; py = p.y;
        }
        if (moving && !document.hidden) { requestAnimationFrame(tick); }
        else { running = false; if (!moving) cx.clearRect(0, 0, W, H); }
      };
      window.addEventListener('pointermove', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
        tx = e.clientX; ty = e.clientY;
        if (!trailSeen) { trailSeen = true; for (var q = 0; q < N; q++) { pts[q].x = tx; pts[q].y = ty; } }
        if (!running) { running = true; requestAnimationFrame(tick); }
      }, { passive: true });
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden && trailSeen && !running) { running = true; requestAnimationFrame(tick); }
      });
      document.addEventListener('mouseleave', function () { trailSeen = false; cx.clearRect(0, 0, W, H); });
    }
  } catch (err4) {}

  /* ---------- folds: open the one a link points into ---------- */
  try {
    var openForHash = function () {
      var id = (location.hash || '').slice(1);
      if (!id) return;
      var t = document.getElementById(id);
      var d = t && t.closest ? t.closest('details') : null;
      if (d && !d.open) { d.open = true; setTimeout(function () { t.scrollIntoView(); }, 50); }
    };
    openForHash();
    window.addEventListener('hashchange', openForHash);
  } catch (err3) {}

  /* ---------- storyboard self-check + prompt copy ---------- */
    bindChooserAndCopy();

    if (reduced) {
      /* Reduced motion: everything visible, no driver, no splitting. */
      Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) {
        el.classList.add('in');
      });
      var panelRm = document.querySelector('.ai-panel--assemble');
      if (panelRm) panelRm.classList.add('assembled');
      var storyRm = document.querySelector('.story');
      if (storyRm) storyRm.style.setProperty('--story-p', '1');
      return;
    }

    /* ---------- kinetic headlines: words assemble line by line ----------
       Words are wrapped in place (never moved out of their parent, so the
       accent span in the hero headline keeps its colour), then grouped by
       measured line so each line rises in sequence. Re-split after fonts
       load and on resize, when the line breaks can change. */
    var kineticEls = Array.prototype.slice.call(document.querySelectorAll('[data-kinetic="lines"]'));
    var splitState = new Map();

    function wrapWords(el) {
      Array.prototype.slice.call(el.childNodes).forEach(function (node) {
        if (node.nodeType === 3) {
          var frag = document.createDocumentFragment();
          node.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement('span'); w.className = 'sc-w';
            var wi = document.createElement('span'); wi.className = 'sc-wi'; wi.textContent = part;
            w.appendChild(wi); frag.appendChild(w);
          });
          el.replaceChild(frag, node);
        } else if (node.nodeType === 1) { wrapWords(node); }
      });
    }

    function splitKinetic(el) {
      try {
        if (!el.textContent || !el.textContent.trim()) return;
        var st = splitState.get(el);
        if (st) { el.innerHTML = st.orig; } else { splitState.set(el, { orig: el.innerHTML, width: el.offsetWidth }); }
        wrapWords(el);
        var words = Array.prototype.slice.call(el.querySelectorAll('.sc-w'));
        var lines = [];
        var lastTop = null;
        words.forEach(function (w) {
          var top = Math.round(w.getBoundingClientRect().top);
          if (lastTop === null || Math.abs(top - lastTop) > 3) { lines.push([]); lastTop = top; }
          lines[lines.length - 1].push(w);
        });
        lines.forEach(function (line, li) {
          line.forEach(function (w, wi) {
            if (w.firstChild) w.firstChild.style.transitionDelay = (li * 110 + wi * 30) + 'ms';
          });
        });
        splitState.get(el).width = el.offsetWidth;
      } catch (e) {
        var s2 = splitState.get(el);
        if (s2) el.innerHTML = s2.orig;
      }
    }

    function splitAllKinetic() { kineticEls.forEach(splitKinetic); }
    splitAllKinetic();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { splitAllKinetic(); });
    }
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        kineticEls.forEach(function (el) {
          var st = splitState.get(el);
          if (st && Math.abs(el.offsetWidth - st.width) > 4) splitKinetic(el);
        });
      }, 250);
    });

    /* ---------- reveals: IntersectionObserver + per-element watchdog ----------
       .in is added when an element enters view. The watchdog only ever fires
       for an element that has sat in view for over a second without revealing,
       so it can never defeat the scroll effects below the fold. */
    var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

    function armKinetic(scope) {
      var els = [];
      if (scope.matches && scope.matches('[data-kinetic]')) els.push(scope);
      Array.prototype.push.apply(els, scope.querySelectorAll('[data-kinetic]'));
      els.forEach(function (el) { el.classList.add('lines-in'); });
    }

    function stagger(el) {
      var parent = el.parentElement;
      if (!parent) return;
      var sibs = Array.prototype.filter.call(parent.children, function (c) {
        return c.classList && c.classList.contains('reveal');
      });
      var idx = sibs.indexOf(el);
      if (idx > 0) el.style.transitionDelay = Math.min(idx * 70, 350) + 'ms';
    }

    function revealEl(el) {
      if (el.classList.contains('in')) return;
      stagger(el);
      el.classList.add('in');
      armKinetic(el);
      var panel = el.querySelector ? el.querySelector('.ai-panel--assemble') : null;
      if (panel) {
        setTimeout(function () { panel.classList.add('assembled'); }, 250);
      }
    }

    if (!('IntersectionObserver' in window)) {
      reveals.forEach(revealEl);
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealEl(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px 25% 0px' });
      reveals.forEach(function (el) { io.observe(el); });

      var revealSeen = new Map();
      setInterval(function () {
        var now = Date.now();
        reveals.forEach(function (el) {
          if (el.classList.contains('in')) { revealSeen.delete(el); return; }
          var r = el.getBoundingClientRect();
          var inView = r.top < window.innerHeight * 0.92 && r.bottom > 0;
          if (!inView) { revealSeen.delete(el); return; }
          if (!revealSeen.has(el)) { revealSeen.set(el, now); return; }
          if (now - revealSeen.get(el) > 400) { revealEl(el); revealSeen.delete(el); }
        });
      }, 500);
    }

    /* ---------- scroll driver: storyboard line, nodes, ground drift ----------
       One rAF loop, lerped so the line and the tilt glide instead of stepping.
       No pinning anywhere: the page always scrolls freely, on desktop and on
       a phone. */
    var storyEl = document.querySelector('.story');
    var stages = Array.prototype.slice.call(document.querySelectorAll('.stage[data-stage]'));
    var whyEl = document.getElementById('why-confusing');
    var PAPER = [255, 255, 255];
    var DEEP = [246, 243, 252];
    var lastGround = '';
    var targetP = 0;
    var currentP = 0;

    var heroEl = document.querySelector('.hero');
    var panelEl = document.querySelector('.ai-panel');
    var tiltTX = 0, tiltTY = 0, tiltCX = 0, tiltCY = 0;
    if (heroEl && panelEl && finePointer) {
      heroEl.addEventListener('mousemove', function (e) {
        var r = heroEl.getBoundingClientRect();
        tiltTX = ((e.clientX - r.left) / r.width - 0.5) * 2;
        tiltTY = ((e.clientY - r.top) / r.height - 0.5) * 2;
      });
      heroEl.addEventListener('mouseleave', function () { tiltTX = 0; tiltTY = 0; });
    }

    function frame() {
      var vh = window.innerHeight;

      if (storyEl) {
        var sr = storyEl.getBoundingClientRect();
        targetP = Math.max(0, Math.min(1, (vh * 0.7 - sr.top) / sr.height));
        currentP += (targetP - currentP) * 0.18;
        if (Math.abs(currentP - targetP) < 0.0005) currentP = targetP;
        storyEl.style.setProperty('--story-p', currentP.toFixed(3));

        /* One lit node: the stage nearest the middle of the viewport. */
        var best = null;
        var bestDist = Infinity;
        stages.forEach(function (st) {
          var r = st.getBoundingClientRect();
          if (r.bottom <= 0 || r.top >= vh) return;
          var dist = Math.abs((r.top + r.height / 2) - vh * 0.5);
          if (dist < bestDist) { bestDist = dist; best = st; }
        });
        stages.forEach(function (st) { st.classList.toggle('is-active', st === best); });
      }

      if (whyEl) {
        var wr = whyEl.getBoundingClientRect();
        var center = wr.top + wr.height / 2;
        var w = 1 - Math.min(Math.abs(center - vh / 2) / (vh * 1.1), 1);
        w = w * w * (3 - 2 * w);
        var c = PAPER.map(function (a, i) { return Math.round(a + (DEEP[i] - a) * w); });
        var bg = 'rgb(' + c.join(',') + ')';
        if (bg !== lastGround) { document.body.style.backgroundColor = bg; lastGround = bg; }
      }

      if (panelEl && finePointer) {
        tiltCX += (tiltTX - tiltCX) * 0.08;
        tiltCY += (tiltTY - tiltCY) * 0.08;
        if (Math.abs(tiltCX) > 0.01 || Math.abs(tiltCY) > 0.01) {
          panelEl.style.transform = 'perspective(1200px) rotateY(' + (tiltCX * 3).toFixed(2) +
            'deg) rotateX(' + (-tiltCY * 3).toFixed(2) + 'deg)';
        } else if (panelEl.style.transform) {
          panelEl.style.transform = '';
        }
      }

      requestAnimationFrame(frame);
    }
    if (storyEl || whyEl || (panelEl && finePointer)) requestAnimationFrame(frame);
  } catch (err) {
    failSafe();
  }

  /* ---------- storyboard self-check + prompt copy ----------
     Enhancement only: with JS off, every stage, CTA and prompt stays visible
     and readable; the chooser buttons simply do nothing. */
  function bindChooserAndCopy() {
    var resultEl = document.getElementById('choice-result');
    var choices = Array.prototype.slice.call(document.querySelectorAll('.choice[data-choice]'));
    var stages = Array.prototype.slice.call(document.querySelectorAll('.stage[data-stage]'));
    var story = document.querySelector('.story');
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
      stages.forEach(function (s) { s.classList.remove('is-match'); s.classList.remove('is-dim'); });
      if (story) story.classList.remove('choice-active');
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
          var matched = entry.stages.indexOf(s.getAttribute('data-stage')) !== -1;
          s.classList.toggle('is-match', matched);
          s.classList.toggle('is-dim', !matched);
        });
        if (story) story.classList.add('choice-active');
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

    /* Hero panel assembly: the answer lines arrive in sequence, with
       per-line delays set here so the order reads top to bottom. */
    var panel = document.querySelector('.ai-panel--assemble');
    if (panel) {
      var bits = panel.querySelectorAll('.chat-q, .chat-a > p, .chat-a ol li, .ai-caption');
      bits.forEach(function (b, i) { b.style.transitionDelay = (i * 130) + 'ms'; });
    }
  }
})();

/* v9.6 nav: one rectangle + underline that follows the pointer and rests on the current page.
   A white copy of the labels sits inside the rectangle (clipped by it) so text stays readable while it moves. */
(function () {
  var nav = document.querySelector('.main-nav');
  if (!nav) return;
  var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
  var cur = nav.querySelector('a[aria-current="page"]');
  var s = document.createElement('span'); s.className = 'nav-slider'; s.setAttribute('aria-hidden', 'true');
  var g = document.createElement('span'); g.className = 'nav-ghost';
  links.forEach(function (a) { var c = document.createElement('span'); c.textContent = a.textContent; if (a === cur) c.className = 'cur'; g.appendChild(c); });
  s.appendChild(g); nav.insertBefore(s, nav.firstChild); nav.classList.add('has-slider');
  var timer = 0;
  function place(a, instant) {
    var x = a.offsetLeft;
    if (instant) { s.style.transition = 'none'; g.style.transition = 'none'; }
    s.style.width = a.offsetWidth + 'px';
    s.style.transform = 'translate3d(' + x + 'px,0,0)';
    g.style.transform = 'translate3d(' + (-x) + 'px,0,0)';
    if (instant) { void s.offsetWidth; s.style.transition = ''; g.style.transition = ''; }
  }
  function go(a) {
    clearTimeout(timer);
    if (!a) { s.classList.remove('on'); return; }
    if (nav.offsetWidth === 0) return;
    var wasOn = s.classList.contains('on');
    place(a, !wasOn);
    s.classList.add('on');
  }
  links.forEach(function (a) {
    a.addEventListener('mouseenter', function () { go(a); });
    a.addEventListener('focus', function () { go(a); });
  });
  nav.addEventListener('mouseleave', function () { go(cur); });
  nav.addEventListener('focusout', function (e) { if (!nav.contains(e.relatedTarget)) go(cur); });
  window.addEventListener('resize', function () { if (cur) place(cur, true); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (cur) place(cur, true); });
  go(cur);
})();
