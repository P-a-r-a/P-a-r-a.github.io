import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js";

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────
    1. INITIAL STATE & SCROLL MANAGEMENT
────────────────────────────────────────── */
// Lock scroll immediately
document.body.style.overflow = 'hidden';

// Force scroll to top
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Hide hero elements immediately so they don't "flash"
gsap.set('#hero', { opacity: 0, visibility: 'hidden' });
gsap.set(['.hero-tag', '.hero-desc', '.hero-scroll', '#main-nav'], { 
    opacity: 0, 
    y: 20 
});
gsap.set('.hero-name .line span', { 
    y: "100%" 
});

/* ──────────────────────────────────────────
    2. LOADING SCREEN ANIMATIONS
────────────────────────────────────────── */
// The floating moon animation
gsap.to(".moon", {
    y: -20,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
});

/* ──────────────────────────────────────────
    3. HERO ENTRANCE FUNCTION
────────────────────────────────────────── */
function startHeroAnimation() {
    // Unlock scroll
    document.body.style.overflow = "auto";
    
    // Reveal hero container
    gsap.set('#hero', { opacity: 1, visibility: 'visible' });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('#main-nav', { opacity: 1, duration: 0.5 })
      .to('.hero-tag', { opacity: 1, y: 0, duration: 0.6 }, "-=0.2")
      .to('.hero-name .line span', {opacity: 1, y: 0, stagger: 0.12, duration: 0.9 }, "-=0.3")
      .to('.hero-desc', { opacity: 1, duration: 0.7 }, "-=0.5")
      .to('.hero-scroll', { opacity: 1, duration: 0.6 }, "-=0.4");
}

/* ──────────────────────────────────────────
    4. THE MASTER TIMER (Transition Logic)
────────────────────────────────────────── */
window.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.querySelector("#loading-screen");

    // 1. Wait for 5 seconds
    setTimeout(() => {
        if (loadingScreen) {
            // 2. Start CSS fade out of the loader
            loadingScreen.classList.add("fade-out");

            // 3. Trigger Hero animation halfway through the fade
            setTimeout(() => {
                startHeroAnimation();
            }, 500);

            // 4. Fully remove loader from DOM after 1s
            setTimeout(() => {
                loadingScreen.style.display = "none";
            }, 1000);
        }
    }, 5000);
});