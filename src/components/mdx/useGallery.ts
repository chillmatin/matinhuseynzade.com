import { useEffect, useState } from "react";
import { getGlobalGallery } from "./globalGallery";
import type { GalleryImage } from "./types";

/**
 * Hook for accessing and managing the global gallery
 * Handles image registration and gallery open events
 */
export function useGallery() {
  const [imageIndex, setImageIndex] = useState<number>(-1);

  /**
   * Register a single image to the gallery
   * @param image - Gallery image object with src and alt
   * @returns Index of the registered image
   */
  const registerImage = (image: GalleryImage): number => {
    const gallery = getGlobalGallery();
    const index = gallery.registerImage(image);
    setImageIndex(index);
    return index;
  };

  /**
   * Register multiple images to the gallery
   * @param images - Array of gallery images
   * @returns Array of indices for each registered image
   */
  const registerImages = (images: GalleryImage[]): number[] => {
    const gallery = getGlobalGallery();
    const indices = gallery.registerImages(images);
    setImageIndex(indices[0] ?? -1);
    return indices;
  };

  /**
   * Open the lightbox at a specific image index
   * @param index - Index of the image to display
   */
  const openGallery = (index: number): void => {
    if (index >= 0) {
      getGlobalGallery().openGallery(index);
    }
  };

  return {
    imageIndex,
    registerImage,
    registerImages,
    openGallery,
  };
}
