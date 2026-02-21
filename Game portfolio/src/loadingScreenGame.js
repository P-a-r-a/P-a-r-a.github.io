import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";

window.addEventListener("DOMContentLoaded", () => {
    // 1. Lock scrolling initially
    document.body.style.overflow = "hidden";

    const loadingScreen = document.querySelector("#loading-screen");

    // 2. The 5 second timer (Loading phase)
    setTimeout(() => {
        if (loadingScreen) {
            // 3. Trigger the CSS fade-out transition
            loadingScreen.classList.add("fade-out");

            // 4. Wait for the fade animation to finish (0.8s), then redirect
            setTimeout(() => {
                // CHANGE 'home.html' to your actual file name
                window.location.href = "game.html"; 
            }, 800); 
        }
    }, 5000);
});