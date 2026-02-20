import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";
import { TextPlugin } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/TextPlugin.js";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

window.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. HERO ANIMATION ---
    const heroDesc = document.querySelector("#hero-desc");
    if (heroDesc) {
        heroDesc.textContent = ""; 
        const tlHero = gsap.timeline({ defaults: { ease: "power2.out" } });

        tlHero.from(".hero-eyebrow", { y: -20, opacity: 0, duration: 0.8 })
              .from("#hero-name", { y: 30, opacity: 0, duration: 1.6 }, "-=0.2")
              .to("#hero-desc", { 
                  duration: 2.4, 
                  text: "I'm a Computer Science undergraduate passionate about web design and frontend development.", 
                  ease: "none" 
              }, "-=1")
              .from(".scroll-hint", { opacity: 0, y: 20, duration: 1 }, "-=0.5");
    }

    // --- 2. CUSTOM CURSOR ---
    const cursor = document.querySelector(".cursor-outline");
    if (cursor) {
        window.addEventListener("mousemove", (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: "power3.out"
            });
        });

        const interactives = document.querySelectorAll("a, button, #hero-name, .project-card");
        interactives.forEach(link => {
            link.addEventListener("mouseenter", () => {
                gsap.to(cursor, { scale: 2, backgroundColor: "transparent", duration: 0.3 });
            });
            link.addEventListener("mouseleave", () => {
                gsap.to(cursor, { scale: 1, backgroundColor: "#4a0f568c", duration: 0.3 });
            });
        });
    }

    // --- 3. PROGRESS BAR ---
    const progressBar = document.querySelector(".progress-bar");
    if (progressBar) {
        gsap.to(progressBar, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3
            }
        });
    }

    // --- 4. PROJECTS HORIZONTAL SCROLL ---
    const projectSection = document.querySelector("#projects"); // Check if this ID matches your HTML!
    const projectGrid = document.querySelector(".project-grid");

    if (projectSection && projectGrid) {
        const tlProj = gsap.timeline({
            scrollTrigger: {
                trigger: projectSection,
                start: "top top",
                end: () => "+=" + projectGrid.scrollWidth,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                // markers: true // Uncomment this to debug if it's still not working
            }
        });

        tlProj.to({}, { duration: 0.2 }) // Pause
              .to(projectGrid, {
                  x: () => -(projectGrid.scrollWidth - window.innerWidth),
                  ease: "none",
                  duration: 1
              });
    } else {
        console.warn("Project elements missing: ", { projectSection, projectGrid });
    }
});