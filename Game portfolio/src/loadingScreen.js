import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";

gsap.to(".moon", {
  y: -20,
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut"
});

window.addEventListener("DOMContentLoaded", () => {
    // 1. Lock scrolling initially
    document.body.style.overflow = "hidden";

    const loadingScreen = document.querySelector("#loading-screen");

    // 2. The 3.5 second timer
    setTimeout(() => {
        if (loadingScreen) {
            // 3. Trigger the CSS fade effect
            loadingScreen.classList.add("fade-out");

            // 4. Unlock scrolling once the fade begins/ends
            document.body.style.overflow = "auto";
            
            // 5. Optional: Clean up the DOM after fade is done (0.8s)
            setTimeout(() => {
                loadingScreen.style.display = "none";
            }, 800); 
        }
    }, 5000);
});