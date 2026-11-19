/* purpleDrop contact: email-verified call request.
   Wiring verified from the previous build (Nov 2026):
   - API: https://ftiqytuovgpxmsafjtjv.supabase.co/functions/v1
   - Turnstile sitekey: 0x4AAAAAAFv21rsn0rhJ-KJF
   - POST /send-verification {purpose:'contact', email, website:'', turnstile_token}
       -> {success, challenge_id}
   - POST /verify-code {purpose:'contact', challenge_id, code}
       -> {success, verification_token}
   - POST /submit-lead {name, email, business, website:'', goal,
       preferred_time, honeypot, challenge_id, verification_token}
       -> {success}; leads are delivered to info@purpledrop.com.
   Delivery to that inbox is still untested end-to-end — see BUILD-NOTES.md.
*/
(function () {
  var API = 'https://ftiqytuovgpxmsafjtjv.supabase.co/functions/v1';
  var SITEKEY = '0x4AAAAAAFv21rsn0rhJ-KJF';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var form = document.getElementById('pd-form');
  if (!form) return;
  var step1 = document.getElementById('pd-step1');
  var step2 = document.getElementById('pd-step2');
  var step3 = document.getElementById('pd-step3');
  var status1 = document.getElementById('pd-status1');
  var status2 = document.getElementById('pd-status2');
  var codeInput = document.getElementById('pd-code');
  var submitBtn = document.getElementById('pd-submit');
  var resendLink = document.getElementById('pd-resend');
  var cooldown = document.getElementById('pd-cooldown');

  var challengeId = null;
  var sending = false;
  var widgetId = null;

  function renderTs() {
    if (widgetId === null && window.turnstile && document.getElementById('pd-ts')) {
      widgetId = window.turnstile.render('#pd-ts', { sitekey: SITEKEY, action: 'contact' });
    }
  }
  window.pdTurnstileReady = renderTs;
  var tsPoll = setInterval(function () {
    if (window.turnstile) { renderTs(); clearInterval(tsPoll); }
  }, 400);
  setTimeout(function () { clearInterval(tsPoll); }, 15000);

  function post(path, body) {
    return fetch(API + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        return { status: res.status, data: data };
      });
    });
  }
  function serverMsg(data, fallback) {
    return (data && typeof data.error === 'string' && data.error) ? data.error : fallback;
  }
  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }

  var cooldownTimer = null;
  function startCooldown() {
    var left = 30;
    resendLink.style.pointerEvents = 'none';
    resendLink.style.opacity = '.5';
    cooldown.textContent = ' (available in ' + left + 's)';
    cooldownTimer = setInterval(function () {
      left -= 1;
      if (left <= 0) {
        clearInterval(cooldownTimer);
        cooldown.textContent = '';
        resendLink.style.pointerEvents = '';
        resendLink.style.opacity = '';
      } else {
        cooldown.textContent = ' (available in ' + left + 's)';
      }
    }, 1000);
  }

  function sendCode() {
    if (sending) return;
    status1.textContent = '';
    if (val('honey')) return;
    var name = val('name'), email = val('email').toLowerCase();
    if (!name) { status1.textContent = 'Please add your name.'; return; }
    if (!EMAIL_RE.test(email)) { status1.textContent = 'Please add a valid email address.'; return; }
    var token = (window.turnstile && widgetId !== null) ? window.turnstile.getResponse(widgetId) : '';
    if (!token) { status1.textContent = 'Please complete the bot check, then send again.'; return; }
    sending = true;
    status1.textContent = 'Sending your code…';
    post('/send-verification', { purpose: 'contact', email: email, website: '', turnstile_token: token })
      .then(function (r) {
        sending = false;
        if (r.status === 200 && r.data.success) {
          challengeId = r.data.challenge_id;
          document.getElementById('pd-locked').textContent = email;
          document.getElementById('email').setAttribute('readonly', '');
          step1.hidden = true;
          step2.hidden = false;
          codeInput.value = '';
          codeInput.focus();
          startCooldown();
        } else if (r.status === 403) {
          status1.textContent = serverMsg(r.data, 'The bot check failed or expired. Please try again.');
          if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId);
        } else if (r.status === 429) {
          status1.textContent = serverMsg(r.data, 'Too many attempts. Please wait 15 minutes, or email info@purpledrop.com.');
        } else if (r.status === 502) {
          status1.textContent = serverMsg(r.data, 'We could not send the code email. Try again, or email info@purpledrop.com.');
        } else {
          status1.textContent = serverMsg(r.data, 'Something went wrong. Please email info@purpledrop.com directly.');
        }
      })
      .catch(function () {
        sending = false;
        status1.textContent = 'Could not reach the server. Check your connection and try again.';
      });
  }

  function verifyAndSubmit() {
    if (sending || !challengeId) return;
    var code = val('pd-code');
    if (!/^[0-9]{6}$/.test(code)) { status2.textContent = 'Enter the 6-digit code from the email.'; return; }
    sending = true;
    submitBtn.disabled = true;
    status2.textContent = 'Checking the code…';
    post('/verify-code', { purpose: 'contact', challenge_id: challengeId, code: code })
      .then(function (r) {
        if (!(r.status === 200 && r.data.success && r.data.verification_token)) {
          sending = false;
          submitBtn.disabled = false;
          if (r.status === 429 || (r.data && r.data.blocked)) {
            status2.textContent = 'Too many incorrect tries. Verification is paused for 15 minutes — you can email info@purpledrop.com instead.';
            codeInput.disabled = true;
            submitBtn.disabled = true;
          } else {
            status2.textContent = serverMsg(r.data, 'Incorrect code. Try again.');
          }
          return null;
        }
        status2.textContent = 'Code accepted. Sending your request…';
        var interest = document.getElementById('interest');
        var interestLabel = interest && interest.selectedIndex >= 0 ? interest.options[interest.selectedIndex].text : '';
        var goal = (interestLabel && interestLabel !== 'Select…' ? '[' + interestLabel + '] ' : '') + val('message');
        return post('/submit-lead', {
          name: val('name'),
          email: val('email').toLowerCase(),
          business: val('company'),
          website: '',
          goal: goal,
          preferred_time: val('ptime'),
          honeypot: val('honey'),
          challenge_id: challengeId,
          verification_token: r.data.verification_token
        }).then(function (s) {
          sending = false;
          if (s && s.status === 200 && s.data.success) {
            step2.hidden = true;
            step3.hidden = false;
          } else {
            submitBtn.disabled = false;
            status2.textContent = 'Your code was accepted, but the request could not be sent. Please email info@purpledrop.com directly.';
          }
        });
      })
      .catch(function () {
        sending = false;
        submitBtn.disabled = false;
        status2.textContent = 'Could not reach the server. Check your connection and try again.';
      });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!step2.hidden) { verifyAndSubmit(); return; }
    sendCode();
  });
  submitBtn.addEventListener('click', verifyAndSubmit);

  document.getElementById('pd-change').addEventListener('click', function (e) {
    e.preventDefault();
    challengeId = null;
    step2.hidden = true;
    step1.hidden = false;
    document.getElementById('email').removeAttribute('readonly');
    status1.textContent = '';
    if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId);
  });

  resendLink.addEventListener('click', function (e) {
    e.preventDefault();
    if (resendLink.style.pointerEvents === 'none' || sending) return;
    if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId);
    step2.hidden = true;
    step1.hidden = false;
    status1.textContent = 'Complete the bot check again, then send a new code.';
  });
})();
