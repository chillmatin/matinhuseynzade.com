import { useCallback } from "react";
import { getGlobalGallery } from "./globalGallery";
import type { GalleryImage } from "./types";

/**
 * Hook for accessing and managing the global gallery
 * Handles image registration and gallery open events
 */
export function useGallery() {
  /**
   * Register a single image to the gallery
   * @param image - Gallery image object with src and alt
   * @returns Index of the registered image
   */
  const registerImage = useCallback((image: GalleryImage): number => {
    const gallery = getGlobalGallery();
    return gallery.registerImage(image);
  }, []);

  /**
   * Register multiple images to the gallery
   * @param images - Array of gallery images
   * @returns Array of indices for each registered image
   */
  const registerImages = useCallback((images: GalleryImage[]): number[] => {
    const gallery = getGlobalGallery();
    return gallery.registerImages(images);
  }, []);

  /**
   * Open the lightbox at a specific image index
   * @param index - Index of the image to display
   */
  const openGallery = useCallback((index: number): void => {
    if (index >= 0) {
      getGlobalGallery().openGallery(index);
    }
  }, []);

  return {
    registerImage,
    registerImages,
    openGallery,
  };
}
