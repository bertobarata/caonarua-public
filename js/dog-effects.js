(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ================================================================
     1. PAW CURSOR TRAIL (desktop only)
     Small 🐾 emojis spawn at the cursor and float away.
  ================================================================ */
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover) {
    var lastPaw = 0;
    document.addEventListener('mousemove', function (e) {
      var now = Date.now();
      if (now - lastPaw < 110) return;
      lastPaw = now;

      var el = document.createElement('span');
      el.textContent = '🐾';
      el.setAttribute('aria-hidden', 'true');
      var size = 18 + Math.random() * 10;
      var rot  = Math.random() * 70 - 35;
      el.style.cssText = [
        'position:fixed',
        'left:' + (e.clientX - size / 2) + 'px',
        'top:'  + (e.clientY - size / 2) + 'px',
        'font-size:' + size + 'px',
        'line-height:1',
        'pointer-events:none',
        'z-index:99999',
        'transform:rotate(' + rot + 'deg)',
        'will-change:transform,opacity',
      ].join(';');
      document.body.appendChild(el);

      gsap.to(el, {
        opacity: 0,
        y: -(28 + Math.random() * 20),
        scale: 0.3,
        duration: 0.9,
        ease: 'power2.out',
        onComplete: function () { el.remove(); },
      });
    });
  }

  /* ================================================================
     2. SECTION PAW DIVIDERS
     5 paw prints walk across the gap between major sections.
     Only injected on pages that have those sections.
  ================================================================ */
  var sectionPairs = [
    { after: '#services',           color: 'var(--color1)' },
    { after: '#team',               color: 'var(--color2)' },
    { after: '.trust-section',      color: 'var(--color1)' },
    { after: '.philosophy-section', color: 'var(--color2)' },
  ];

  sectionPairs.forEach(function (pair) {
    var anchor = document.querySelector(pair.after);
    if (!anchor) return;

    var divider = document.createElement('div');
    divider.className = 'paw-divider';
    divider.setAttribute('aria-hidden', 'true');
    divider.style.cssText = 'display:flex;justify-content:center;align-items:center;gap:14px;padding:10px 0;overflow:hidden;';

    for (var i = 0; i < 5; i++) {
      var paw = document.createElement('span');
      paw.textContent = '🐾';
      paw.style.cssText = [
        'font-size:22px',
        'display:inline-block',
        'opacity:0',
        'transform:rotate(' + (i % 2 === 0 ? '-15' : '15') + 'deg) translateY(20px)',
        'will-change:transform,opacity',
      ].join(';');
      divider.appendChild(paw);
    }

    anchor.insertAdjacentElement('afterend', divider);

    var paws = divider.querySelectorAll('span');
    gsap.to(paws, {
      scrollTrigger: { trigger: divider, start: 'top 90%', once: true },
      opacity: 1,
      y: 0,
      stagger: 0.12,
      duration: 0.5,
      ease: 'back.out(2)',
    });
  });

  /* ================================================================
     3. WHATSAPP BUTTON TAIL-WAG
     Bounces every 4 seconds to draw attention.
  ================================================================ */
  var wa = document.querySelector('.whatsapp-float');
  if (wa) {
    function wag() {
      gsap.timeline()
        .to(wa, { rotation: 20,  duration: 0.1, ease: 'power1.out' })
        .to(wa, { rotation: -20, duration: 0.1, ease: 'power1.inOut' })
        .to(wa, { rotation: 15,  duration: 0.1, ease: 'power1.inOut' })
        .to(wa, { rotation: 0,   duration: 0.1, ease: 'power1.in' })
        .to(wa, { y: -14, duration: 0.25, ease: 'power2.out' })
        .to(wa, { y: 0,   duration: 0.3,  ease: 'bounce.out' });
    }
    setTimeout(wag, 2500);
    setInterval(wag, 5000);
  }

  /* ================================================================
     4. CTA / BUTTON ATTENTION PULSE
     The main nav CTA and .button links glow once on scroll.
  ================================================================ */
  var ctaEl = document.querySelector('.top-nav .cta');
  if (ctaEl) {
    gsap.fromTo(ctaEl,
      { boxShadow: '0 0 0px rgba(46,160,56,0)' },
      {
        scrollTrigger: { trigger: 'footer', start: 'top bottom', once: true },
        boxShadow: '0 0 22px rgba(46,160,56,0.7)',
        repeat: 3, yoyo: true, duration: 0.5, ease: 'power1.inOut',
      }
    );
  }

})();
