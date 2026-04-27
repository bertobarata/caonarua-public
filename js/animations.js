(function () {
  'use strict';

  document.body.classList.add('js-loaded');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* ── Lenis smooth scroll ── */
  if (typeof Lenis !== 'undefined') {
    var lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function st(trigger, start) {
    return { trigger: trigger, start: start || 'top 82%', once: true };
  }

  /* helper: fromTo with explicit rotation:0 end state */
  function rot(selector, from, extra, trigger, start) {
    var to = Object.assign({ opacity: 1, y: 0, x: 0, scale: 1, rotation: 0 }, extra || {});
    if (trigger) to.scrollTrigger = { trigger: trigger, start: start || 'top 82%', once: true };
    gsap.fromTo(selector, from, to);
  }

  /* ── Hero entrance ── */
  if (document.querySelector('.main-title')) {
    rot('.main-title', { opacity: 0, y: 80, scale: 0.85, rotation: -3 }, { duration: 1.1, ease: 'back.out(2)', delay: 0.1 });
    rot('.hero-sub',   { opacity: 0, y: 50 },                            { duration: 0.9, ease: 'power3.out', delay: 0.65 });
  }

  /* ── Services ── */
  if (document.querySelector('#services')) {
    rot('.services-title', { opacity: 0, y: 50, rotation: -2 }, { duration: 0.9, ease: 'back.out(2)' }, '#services', 'top 85%');
    rot('.service-card',   { opacity: 0, y: 100, scale: 0.88, rotation: 3 }, { duration: 0.75, stagger: { amount: 0.6 }, ease: 'back.out(1.8)' }, '#services', 'top 80%');
  }

  /* ── Team ── */
  if (document.querySelector('#team')) {
    rot('.team-title', { opacity: 0, x: -80, rotation: -3 }, { duration: 0.9, ease: 'back.out(2)' }, '#team', 'top 85%');
    rot('.team-card',  { opacity: 0, y: 80, scale: 0.88, rotation: -3 }, { duration: 0.85, stagger: 0.18, ease: 'back.out(2)' }, '#team', 'top 78%');
  }

  /* ── Trust cards ── */
  if (document.querySelector('.trust-section')) {
    rot('.trust-card',      { opacity: 0, y: 70, scale: 0.9, rotation: 2 }, { duration: 0.75, stagger: 0.15, ease: 'back.out(2)' }, '.trust-section', 'top 80%');
    rot('.trust-card-icon', { opacity: 0, scale: 0, rotation: -20 },        { duration: 0.6,  stagger: 0.15, ease: 'back.out(3.5)', delay: 0.2 }, '.trust-section', 'top 74%');
  }

  /* ── Philosophy ── */
  if (document.querySelector('.philosophy-section')) {
    rot('.philosophy-section h2', { opacity: 0, y: 50, rotation: -2 }, { duration: 0.9, ease: 'back.out(2)' }, '.philosophy-section', 'top 82%');
    gsap.fromTo('.philosophy-divider',
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, transformOrigin: 'left center', duration: 0.8, ease: 'power4.out', scrollTrigger: st('.philosophy-section', 'top 78%') }
    );
    rot('.philosophy-text', { opacity: 0, y: 36 }, { duration: 0.7, stagger: 0.2, ease: 'power2.out' }, '.philosophy-section', 'top 72%');
    rot('.philosophy-goal', { opacity: 0, x: -60, rotation: -1 }, { duration: 0.9, ease: 'back.out(1.5)' }, '.philosophy-section', 'top 62%');
  }

  /* ── Contact ── */
  if (document.querySelector('#contacts')) {
    rot('#contacts h3',             { opacity: 0, y: 40, scale: 0.85, rotation: -2 }, { duration: 0.9, ease: 'back.out(2)' }, '#contacts', 'top 82%');
    rot('.form-cta, .contact-line', { opacity: 0, y: 40 }, { duration: 0.65, stagger: 0.12, ease: 'back.out(1.5)' }, '#contacts', 'top 76%');
  }

  /* ── Partnerships ── */
  if (document.querySelector('.partnerships-section')) {
    rot('.partnerships-section', { opacity: 0, y: 50 }, { duration: 0.9, ease: 'power3.out' }, '#partnerships', 'top 84%');
  }

  /* ── Service pages: title + subtitle ── */
  if (document.querySelector('.page-title')) {
    rot('.page-title',    { opacity: 0, y: 70, scale: 0.88, rotation: -2 }, { duration: 1.0, ease: 'back.out(2)', delay: 0.15 });
    rot('.page-subtitle', { opacity: 0, y: 40 },                            { duration: 0.8, ease: 'power3.out', delay: 0.6 });
  }

  /* ── Service pages: info-cards ── */
  if (document.querySelector('.info-card')) {
    rot('.info-card', { opacity: 0, y: 70, scale: 0.9, rotation: 2 }, { duration: 0.8, stagger: 0.18, ease: 'back.out(2)' }, '.info-cards', 'top 82%');
  }

  /* ── Service pages: side-boxes ── */
  gsap.utils.toArray('.side-box').forEach(function (box) {
    var dir = box.classList.contains('reverse') ? 1 : -1;
    gsap.fromTo(box,
      { opacity: 0, x: 90 * dir, rotation: dir * 2 },
      { opacity: 1, x: 0, rotation: 0, duration: 0.9, ease: 'back.out(1.6)', scrollTrigger: { trigger: box, start: 'top 84%', once: true } }
    );
  });

  /* ── Service pages: flex cards ── */
  gsap.utils.toArray('.service-card-flex').forEach(function (card, i) {
    gsap.fromTo(card,
      { opacity: 0, y: 70, rotation: i % 2 === 0 ? -2 : 2 },
      { opacity: 1, y: 0, rotation: 0, duration: 0.85, ease: 'back.out(1.8)', scrollTrigger: { trigger: card, start: 'top 84%', once: true } }
    );
  });

  /* ── Service pages: FAQ ── */
  if (document.querySelector('.faq')) {
    rot('.faq h3',                { opacity: 0, y: 40, rotation: -2 }, { duration: 0.8, ease: 'back.out(2)' }, '.faq', 'top 85%');
    rot('.faq-item, .faq details', { opacity: 0, y: 30, x: -20 },      { duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '.faq', 'top 80%');
  }

  /* ── Refresh after layout settles ── */
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });

})();
