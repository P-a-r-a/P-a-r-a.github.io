/* ═══════════════════════════════════════════
   main.js  —  Portfolio main page logic
   Deps: GSAP + ScrollTrigger
═══════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────
   LOADING SCREEN
────────────────────────────────────────── */
(function initLoader() {
  const screen  = document.getElementById('loading-screen');
  const bar     = document.getElementById('loader-bar');
  const pct     = document.getElementById('loader-pct');
  const nameSpans = document.querySelectorAll('.loader-name span');

  // Animate name letters in
  gsap.to(nameSpans, { y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out', delay: 0.2 });

  // Fake progress bar
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 12;
    if (progress >= 100) { progress = 100; clearInterval(interval); finishLoading(); }
    bar.style.width = progress + '%';
    pct.textContent = Math.round(progress) + '%';
  }, 80);

  function finishLoading() {
    setTimeout(() => {
      gsap.to(screen, {
        opacity: 0, duration: 0.6, ease: 'power2.in',
        onComplete: () => {
          screen.style.display = 'none';
          document.body.style.overflow = '';
          startHero();
        }
      });
    }, 300);
  }

  // Prevent scroll while loading
  document.body.style.overflow = 'hidden';
})();

/* ──────────────────────────────────────────
   HERO ENTRANCE
────────────────────────────────────────── */
function startHero() {
  // Fade nav in
  gsap.to('#main-nav', { opacity: 1, duration: 0.5 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.hero-tag', { opacity: 1, y: 0, duration: 0.6 }, 0.1)
    .to('.hero-name .line span', { y: 0, stagger: 0.12, duration: 0.9 }, 0.25)
    .to('.hero-desc',   { opacity: 1, duration: 0.7 }, 0.7)
    .to('.hero-scroll', { opacity: 1, duration: 0.6 }, 1.0);

  // Set initial states
  gsap.set('.hero-tag',  { opacity: 0, y: 20 });
  gsap.set('.hero-desc', { opacity: 0 });
  gsap.set('.hero-scroll', { opacity: 0 });
}

/* ──────────────────────────────────────────
   PROJECT CARDS — mouse glow follow
────────────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

/* ──────────────────────────────────────────
   SKILL BARS — animate when scrolled into view
────────────────────────────────────────── */
document.querySelectorAll('.skill').forEach((skill, i) => {
  const fill   = skill.querySelector('.skill-fill');
  const target = skill.dataset.target;

  gsap.set(fill, { width: 0 });

  ScrollTrigger.create({
    trigger: skill,
    start: 'top 88%',
    onEnter() {
      gsap.to(fill, {
        width: target + '%',
        duration: 1.1,
        delay: i * 0.07,
        ease: 'power2.out'
      });
    }
  });
});

/* ──────────────────────────────────────────
   SECTION REVEAL ANIMATIONS
────────────────────────────────────────── */
gsap.utils.toArray('.section-tag, .section-heading').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' } }
  );
});

gsap.utils.toArray('.project-card').forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.7, delay: (i % 2) * 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 90%' } }
  );
});

gsap.utils.toArray('.contact-link').forEach((link, i) => {
  gsap.fromTo(link,
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.6, delay: i * 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: link, start: 'top 90%' } }
  );
});/* ═══════════════════════════════════════════
   main.js  —  Portfolio main page logic
   Deps: GSAP + ScrollTrigger
═══════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────
   LOADING SCREEN
────────────────────────────────────────── */
(function initLoader() {
  const screen  = document.getElementById('loading-screen');
  const bar     = document.getElementById('loader-bar');
  const pct     = document.getElementById('loader-pct');
  const nameSpans = document.querySelectorAll('.loader-name span');

  // Animate name letters in
  gsap.to(nameSpans, { y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out', delay: 0.2 });

  // Fake progress bar
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 12;
    if (progress >= 100) { progress = 100; clearInterval(interval); finishLoading(); }
    bar.style.width = progress + '%';
    pct.textContent = Math.round(progress) + '%';
  }, 80);

  function finishLoading() {
    setTimeout(() => {
      gsap.to(screen, {
        opacity: 0, duration: 0.6, ease: 'power2.in',
        onComplete: () => {
          screen.style.display = 'none';
          document.body.style.overflow = '';
          startHero();
        }
      });
    }, 300);
  }

  // Prevent scroll while loading
  document.body.style.overflow = 'hidden';
})();

/* ──────────────────────────────────────────
   HERO ENTRANCE
────────────────────────────────────────── */
function startHero() {
  // Fade nav in
  gsap.to('#main-nav', { opacity: 1, duration: 0.5 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.hero-tag', { opacity: 1, y: 0, duration: 0.6 }, 0.1)
    .to('.hero-name .line span', { y: 0, stagger: 0.12, duration: 0.9 }, 0.25)
    .to('.hero-desc',   { opacity: 1, duration: 0.7 }, 0.7)
    .to('.hero-scroll', { opacity: 1, duration: 0.6 }, 1.0);

  // Set initial states
  gsap.set('.hero-tag',  { opacity: 0, y: 20 });
  gsap.set('.hero-desc', { opacity: 0 });
  gsap.set('.hero-scroll', { opacity: 0 });
}

/* ──────────────────────────────────────────
   PROJECT CARDS — mouse glow follow
────────────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

/* ──────────────────────────────────────────
   SKILL BARS — animate when scrolled into view
────────────────────────────────────────── */
document.querySelectorAll('.skill').forEach((skill, i) => {
  const fill   = skill.querySelector('.skill-fill');
  const target = skill.dataset.target;

  gsap.set(fill, { width: 0 });

  ScrollTrigger.create({
    trigger: skill,
    start: 'top 88%',
    onEnter() {
      gsap.to(fill, {
        width: target + '%',
        duration: 1.1,
        delay: i * 0.07,
        ease: 'power2.out'
      });
    }
  });
});

/* ──────────────────────────────────────────
   SECTION REVEAL ANIMATIONS
────────────────────────────────────────── */
gsap.utils.toArray('.section-tag, .section-heading').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' } }
  );
});

gsap.utils.toArray('.project-card').forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.7, delay: (i % 2) * 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 90%' } }
  );
});

gsap.utils.toArray('.contact-link').forEach((link, i) => {
  gsap.fromTo(link,
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.6, delay: i * 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: link, start: 'top 90%' } }
  );
});