(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.WebGLRenderingContext) return;
  if (typeof THREE === 'undefined') return;

  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  var hero = document.querySelector('.hero');
  if (!hero) return;

  /* ── Paw texture: main pad + 4 toe pads ── */
  function makePawTexture(color) {
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var ctx = c.getContext('2d');
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(32, 38, 12, 0, Math.PI * 2); ctx.fill();
    [[16, 22], [25, 16], [39, 16], [48, 22]].forEach(function (p) {
      ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, Math.PI * 2); ctx.fill();
    });
    return new THREE.CanvasTexture(c);
  }

  /* ── Renderer ── */
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 5;

  var scene = new THREE.Scene();

  /* ── Shared materials ── */
  var matOrange = new THREE.SpriteMaterial({ map: makePawTexture('rgb(227,119,52)'), transparent: true, depthWrite: false });
  var matGreen  = new THREE.SpriteMaterial({ map: makePawTexture('rgb(46,160,56)'),  transparent: true, depthWrite: false });

  var isMobile = window.innerWidth < 720;
  var COUNT = isMobile ? 60 : 120;
  var HALF = COUNT / 2;

  /* ── Particle data ── */
  var px = new Float32Array(COUNT);
  var py = new Float32Array(COUNT);
  var pz = new Float32Array(COUNT);
  var vx = new Float32Array(COUNT);
  var vy = new Float32Array(COUNT);
  var vr = new Float32Array(COUNT);
  var sprites = [];

  function rand(a, b) { return a + Math.random() * (b - a); }

  for (var i = 0; i < COUNT; i++) {
    var mat = i < HALF ? matOrange : matGreen;
    var sp = new THREE.Sprite(mat.clone());
    sp.material.opacity = rand(0.18, 0.55);
    var s = rand(0.08, 0.22);
    sp.scale.set(s, s, 1);
    px[i] = rand(-6, 6);
    py[i] = rand(-4, 4);
    pz[i] = rand(-2, 1);
    sp.position.set(px[i], py[i], pz[i]);
    vx[i] = rand(-0.003, 0.003);
    vy[i] = rand(0.004, 0.012);
    vr[i] = rand(-0.012, 0.012);
    scene.add(sp);
    sprites.push(sp);
  }

  /* ── Mouse parallax ── */
  var targetX = 0, targetY = 0;
  hero.addEventListener('mousemove', function (e) {
    targetX = (e.clientX / hero.offsetWidth  - 0.5) * 0.6;
    targetY = (e.clientY / hero.offsetHeight - 0.5) * -0.3;
  });

  /* ── Resize ── */
  function resize() {
    var w = hero.offsetWidth, h = hero.offsetHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  var ro = new ResizeObserver(resize);
  ro.observe(hero);

  /* ── Render loop via GSAP ticker ── */
  gsap.ticker.add(function () {
    for (var i = 0; i < COUNT; i++) {
      px[i] += vx[i];
      py[i] += vy[i];
      sprites[i].material.rotation += vr[i];
      if (py[i] > 5) {
        py[i] = -5;
        px[i] = rand(-6, 6);
      }
      sprites[i].position.set(px[i], py[i], pz[i]);
    }
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    renderer.render(scene, camera);
  });

})();
