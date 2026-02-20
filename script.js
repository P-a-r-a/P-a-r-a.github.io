gsap.registerPlugin(ScrollTrigger);

/* ─── HERO CANVAS REVEAL ───────────────────────────────────────
   The canvas covers the entire hero with solid red + "About Me"
   text. When the mouse hovers over it, a circular hole is punched
   through revealing the blue background and your name below.
   Mouse events fire directly on the canvas so e.offsetX/Y are
   already canvas-relative — no extra coordinate math needed.
─────────────────────────────────────────────────────────────── */
const canvas = document.getElementById('hero-canvas');
const ctx    = canvas.getContext('2d');
const RADIUS = 180; // hole radius in px

let mx = -9999, my = -9999, over = false;

function resize() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  draw();
}

function draw() {
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Step 1 — fill entire canvas with solid red
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#5f106e';
  ctx.fillRect(0, 0, W, H);

  // Step 2 — punch a transparent hole at the mouse position
  if (over) {
    ctx.globalCompositeOperation = 'destination-out';
    const g = ctx.createRadialGradient(mx, my, 0, mx, my, RADIUS);
    g.addColorStop(0,   'rgb(0, 0, 0)');
    g.addColorStop(0.6, 'rgb(0, 0, 0)');
    g.addColorStop(1,   'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // Step 3 — draw "About Me" text back on top in white
  ctx.globalCompositeOperation = 'source-over';
  const fs = Math.max(28, Math.min(W * 0.09, 100));
  ctx.font         = `700 ${fs}px 'Playfair Display', serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = '#ffffff';
  ctx.fillText('About Me', W / 2, H / 2);
}

canvas.addEventListener('mousemove', e => {
  over = true;
  mx = e.offsetX;
  my = e.offsetY;
  draw();
});

canvas.addEventListener('mouseleave', () => {
  over = false;
  draw();
});

window.addEventListener('resize', resize);
document.fonts.ready.then(resize);
window.addEventListener('load', resize);
resize();

/* ─── GSAP SCROLL ANIMATIONS ──────────────────────────────── */
gsap.set('#hero-desc', { y: 24, opacity: 0 });
gsap.to('#hero-desc', { y: 0, opacity: 1, duration: 0.9, delay: 0.4, ease: 'power3.out' });

gsap.utils.toArray('.section-label').forEach(el => {
  gsap.set(el, { y: 16 });
  gsap.to(el, { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: el, start: 'top 88%' } });
});

gsap.utils.toArray('.section-title').forEach(el => {
  gsap.set(el, { y: 28 });
  gsap.to(el, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: el, start: 'top 88%' } });
});

gsap.set('.project-card', { y: 40 });
gsap.utils.toArray('.project-card').forEach((card, i) => {
  gsap.to(card, { opacity: 1, y: 0, duration: 0.7, delay: i * 0.12, scrollTrigger: { trigger: card, start: 'top 90%' } });
});

gsap.set('.skills-col h3', { y: 16 });
gsap.utils.toArray('.skills-col h3').forEach((el, i) => {
  gsap.to(el, { opacity: 1, y: 0, duration: 0.6, delay: i * 0.15, scrollTrigger: { trigger: el, start: 'top 88%' } });
});

gsap.set('.skill-item', { y: 12 });
gsap.utils.toArray('.skill-item').forEach((item, i) => {
  const fill = item.querySelector('.skill-fill');
  gsap.to(item, { opacity: 1, y: 0, duration: 0.5, delay: i * 0.08, scrollTrigger: { trigger: item, start: 'top 92%' } });
  ScrollTrigger.create({ trigger: item, start: 'top 92%', onEnter: () => { fill.style.width = fill.dataset.width + '%'; } });
});

gsap.set('.hobby-item', { x: -18 });
gsap.utils.toArray('.hobby-item').forEach((item, i) => {
  gsap.to(item, { opacity: 1, x: 0, duration: 0.5, delay: i * 0.08, scrollTrigger: { trigger: item, start: 'top 92%' } });
});

gsap.set(['.contact-desc', '.contact-links'], { y: 24 });
gsap.to('.contact-desc',  { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: '.contact-desc',  start: 'top 88%' } });
gsap.to('.contact-links', { opacity: 1, y: 0, duration: 0.8, delay: 0.15, scrollTrigger: { trigger: '.contact-links', start: 'top 88%' } });