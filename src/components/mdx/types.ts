/**
 * Gallery image object for lightbox display
 */
export interface GalleryImage {
  src: string;
  alt: string;
}

/**
 * Props for LightboxImage component
 */
export interface LightboxImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Props for LightboxGallery component
 */
export interface LightboxGalleryProps {
  images: Array<GalleryImage & { href?: string }>;
  columns?: 2 | 3 | 4;
  className?: string;
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
