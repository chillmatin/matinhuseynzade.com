import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { getGlobalGallery } from "./globalGallery";
import type { GalleryImage } from "./types";
import { LIGHTBOX_CONFIG } from "./types";

/**
 * GlobalLightbox - Unified lightbox component for all page images
 * 
 * Displays a single lightbox instance that manages all images registered
 * via LightboxImage and LightboxGallery components. Listens to global
 * gallery events and updates the displayed image set.
 * 
 * Should be placed once in the layout, typically at the end of the page.
 */
export default function GlobalLightbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const gallery = getGlobalGallery();

    // Subscribe to gallery updates
    const unsubscribe = gallery.subscribe((updatedImages) => {
      setImages(updatedImages);
    });

    // Subscribe to open events
    const unsubscribeOpen = gallery.subscribeToOpen((index) => {
      setCurrentIndex(index);
      setIsOpen(true);
    });

    // Get initial images
    setImages(gallery.getImages());

    return () => {
      unsubscribe();
      unsubscribeOpen();
    };
  }, []);

  return (
    <Lightbox
      open={isOpen}
      close={() => setIsOpen(false)}
      slides={images}
      index={currentIndex}
      plugins={[Fullscreen, Zoom, Thumbnails]}
      zoom={LIGHTBOX_CONFIG.zoom}
      controller={LIGHTBOX_CONFIG.controller}
      on={{
        view: ({ index }) => setCurrentIndex(index),
      }}
      animation={LIGHTBOX_CONFIG.animation}
      carousel={LIGHTBOX_CONFIG.carousel}
    />
  );
}
