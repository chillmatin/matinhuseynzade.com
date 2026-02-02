/**
 * Gallery image object for lightbox display
 */
export interface GalleryImage {
  src: string;
  alt: string;
}

/**
 * Lightbox configuration options
 */
export const LIGHTBOX_CONFIG = {
  zoom: {
    maxZoomPixelRatio: 3,
    scrollToZoom: true,
  },
  controller: {
    closeOnBackdropClick: true,
  },
  // Snap instantly between slides (no swipe/fade) for maximal perceived smoothness
  animation: {
    fade: 0,
    swipe: 0,
  },
  // Preload neighboring slides so the next/prev image is decoded before we animate
  carousel: { finite: false, preload: 2 },
} as const;
