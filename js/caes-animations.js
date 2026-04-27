(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof gsap === 'undefined') return;

  var cards = gsap.utils.toArray('.dog-card');
  if (!cards.length) return;

  var grid = document.querySelector('.dogs-grid');

  /* Block mouse interaction and horizontal scroll during the run-in */
  document.documentElement.style.overflowX = 'hidden';
  if (grid) grid.style.pointerEvents = 'none';

  var COLS = 4;
  var lastDelay = 0, lastDur = 0;

  cards.forEach(function (card, i) {
    var row   = Math.floor(i / COLS);
    var col   = i % COLS;
    var dir   = row % 2 === 0 ? 1 : -1;
    var delay = 0.1 + row * 0.18 + col * 0.06 + Math.random() * 0.04;
    var dur   = 0.55 + Math.random() * 0.2;

    if (delay + dur > lastDelay + lastDur) { lastDelay = delay; lastDur = dur; }

    gsap.fromTo(card,
      { x: dir * 900, opacity: 0, rotation: dir * 12 },
      { x: 0, opacity: 1, rotation: 0, duration: dur, delay: delay, ease: 'back.out(1.4)' }
    );

    var name = card.querySelector('h3');
    if (name) {
      gsap.fromTo(name,
        { opacity: 0, scale: 0.2, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.32, delay: delay + dur * 0.82, ease: 'back.out(3)' }
      );
    }
  });

  /* Once the last card has fully landed: restore interaction and add hover */
  gsap.delayedCall(lastDelay + lastDur + 0.05, function () {
    document.documentElement.style.overflowX = '';
    if (grid) grid.style.pointerEvents = '';

    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        gsap.to(card, { y: -12, scale: 1.05, duration: 0.18, ease: 'power2.out', overwrite: true });
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(card, { y: 0, scale: 1, duration: 0.55, ease: 'elastic.out(1, 0.45)', overwrite: true });
      });
    });
  });

})();
