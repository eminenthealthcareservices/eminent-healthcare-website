/* ================================================================
   EMINENT HEALTHCARE SERVICES — SHARED JAVASCRIPT
   File: assets/js/main.js
   All pages link to this file.
================================================================ */

(function () {
  'use strict';

  /* ── Navbar scroll shadow ──────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ── Mobile hamburger menu ─────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose  = document.getElementById('menuClose');

  function openMobileMenu()  { if (mobileMenu) { mobileMenu.classList.add('open'); document.body.style.overflow = 'hidden'; } }
  function closeMobileMenu() { if (mobileMenu) { mobileMenu.classList.remove('open'); document.body.style.overflow = ''; } }

  if (hamburger) hamburger.addEventListener('click', openMobileMenu);
  if (menuClose)  menuClose.addEventListener('click', closeMobileMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('.menu-close-on-click').forEach(el => el.addEventListener('click', closeMobileMenu));
  }

  /* ── Mobile services sub-menu toggle ───────────────────── */
  const mobileServicesToggle  = document.getElementById('mobileServicesToggle');
  const mobileServicesSubmenu = document.getElementById('mobileServicesSubmenu');
  if (mobileServicesToggle && mobileServicesSubmenu) {
    mobileServicesToggle.addEventListener('click', () => {
      mobileServicesSubmenu.classList.toggle('open');
    });
  }

  /* ── About Us panel ─────────────────────────────────────── */
  const aboutPanel      = document.getElementById('aboutPanel');
  const aboutPanelClose = document.getElementById('aboutPanelClose');

  function openAbout(e)  { if (e) e.preventDefault(); closeMobileMenu(); if (aboutPanel) { aboutPanel.classList.add('open'); document.body.style.overflow = 'hidden'; } }
  function closeAbout()  { if (aboutPanel) { aboutPanel.classList.remove('open'); document.body.style.overflow = ''; } }

  document.querySelectorAll('[data-open-about]').forEach(el => el.addEventListener('click', openAbout));
  if (aboutPanelClose) aboutPanelClose.addEventListener('click', closeAbout);
  if (aboutPanel)      aboutPanel.addEventListener('click', e => { if (e.target === aboutPanel) closeAbout(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeAbout(); closeMobileMenu(); } });

  /* ── Hero image slider (homepage only) ─────────────────── */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots   = document.querySelectorAll('.hero-dot');
  if (heroSlides.length > 0) {
    let current  = 0;
    let timer    = null;
    const INTERVAL = 5800;

    function goTo(index) {
      heroSlides[current].classList.remove('active');
      if (heroDots[current]) { heroDots[current].classList.remove('active'); heroDots[current].setAttribute('aria-selected', 'false'); }
      current = (index + heroSlides.length) % heroSlides.length;
      heroSlides[current].classList.add('active');
      if (heroDots[current]) { heroDots[current].classList.add('active'); heroDots[current].setAttribute('aria-selected', 'true'); }
    }

    function startTimer() { timer = setInterval(() => goTo(current + 1), INTERVAL); }
    function resetTimer()  { clearInterval(timer); startTimer(); }

    heroDots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetTimer(); }));
    startTimer();
  }

  /* ── Scroll reveal ─────────────────────────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── Contact / Enquiry form — Formspree AJAX ───────────── */
  /*
   * SETUP INSTRUCTIONS:
   * 1. Go to https://formspree.io — create a free account
   * 2. Create a new form — copy your Form ID (looks like: xabc1234)
   * 3. In each HTML page's <form>, replace YOUR_FORMSPREE_ID with your ID:
   *    action="https://formspree.io/f/YOUR_FORMSPREE_ID"
   * 4. Set delivery email to: info.eminent.hcs@gmail.com in Formspree settings
   */
  document.querySelectorAll('form[data-formspree]').forEach(form => {
    const statusEl = form.querySelector('.form-status');
    const submitBtn = form.querySelector('[type="submit"]');
    const origLabel = submitBtn ? submitBtn.innerHTML : 'Send';

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>&nbsp; Sending…'; }
      if (statusEl)  { statusEl.className = 'form-status'; }

      try {
        const res = await fetch(form.action, {
          method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          if (statusEl) { statusEl.textContent = '✓ Your enquiry has been sent! We will respond within 24 hours.'; statusEl.classList.add('success'); }
          form.reset();
          if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-check"></i>&nbsp; Sent!';
        } else throw new Error();
      } catch {
        if (statusEl) { statusEl.textContent = '✗ Something went wrong. Please email us at info.eminent.hcs@gmail.com'; statusEl.classList.add('error'); }
        if (submitBtn) { submitBtn.innerHTML = origLabel; submitBtn.disabled = false; }
      }
    });
  });

})();
