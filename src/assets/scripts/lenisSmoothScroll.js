import "@styles/lenis.css";

import Lenis from "lenis";

let lenisInstance;
let rafId;

// Initialize Lenis only when motion is allowed and not already running
export function initLenis() {
  if (typeof window === "undefined" || lenisInstance) return lenisInstance;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReducedMotion.matches) return undefined;

  const lenis = new Lenis();

  const raf = (time) => {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };

  rafId = requestAnimationFrame(raf);
  lenisInstance = { lenis, destroy: () => rafId && cancelAnimationFrame(rafId) };
  return lenisInstance;
}

export default initLenis;
