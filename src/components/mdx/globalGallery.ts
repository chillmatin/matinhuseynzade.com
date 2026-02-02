import type { GalleryImage } from "./types";

/**
 * Global gallery state manager for unified lightbox experience
 * Manages image registration and gallery events across Astro's React islands
 */
class GlobalGallery {
  private images: GalleryImage[] = [];
  private listeners: Set<(images: GalleryImage[]) => void> = new Set();
  private openListeners: Set<(index: number) => void> = new Set();

  /**
   * Register a single image to the gallery
   * @param image - Gallery image object with src and alt
   * @returns Index of the registered image
   */
  registerImage(image: GalleryImage): number {
    const index = this.images.length;
    this.images.push(image);
    this.notifyListeners();
    return index;
  }

  /**
   * Register multiple images to the gallery
   * @param images - Array of gallery images
   * @returns Array of indices for each registered image
   */
  registerImages(images: GalleryImage[]): number[] {
    const startIndex = this.images.length;
    const indices = images.map((_, i) => startIndex + i);
    this.images.push(...images);
    this.notifyListeners();
    return indices;
  }

  /**
   * Get all registered images
   * @returns Array of all gallery images
   */
  getImages(): GalleryImage[] {
    return [...this.images];
  }

  /**
   * Open the lightbox and navigate to a specific image
   * @param index - Index of the image to display
   */
  openGallery(index: number): void {
    this.openListeners.forEach((listener) => listener(index));
  }

  /**
   * Subscribe to gallery image updates
   * @param listener - Callback function that receives updated images array
   * @returns Unsubscribe function to remove the listener
   */
  subscribe(listener: (images: GalleryImage[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Subscribe to gallery open events
   * @param listener - Callback function that receives the image index to display
   * @returns Unsubscribe function to remove the listener
   */
  subscribeToOpen(listener: (index: number) => void): () => void {
    this.openListeners.add(listener);
    return () => this.openListeners.delete(listener);
  }

  /**
   * Clear all registered images and notify listeners
   * Called on page navigation to prevent duplicate images
   */
  reset(): void {
    this.images = [];
    this.notifyListeners();
  }

  /**
   * Notify all subscribers of image changes
   * @private
   */
  private notifyListeners(): void {
    const snapshot = [...this.images];
    this.listeners.forEach((listener) => listener(snapshot));
  }
}

// Create and expose global instance
if (typeof window !== "undefined") {
  (window as any).__globalGallery = (window as any).__globalGallery || new GlobalGallery();
}

/**
 * Get the global gallery instance
 * Creates or retrieves the existing global gallery manager
 * @returns GlobalGallery instance
 */
export function getGlobalGallery(): GlobalGallery {
  if (typeof window === "undefined") {
    return new GlobalGallery();
  }
  return (window as any).__globalGallery;
}
