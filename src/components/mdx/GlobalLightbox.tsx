import { useEffect, useState } from "react";
import { getGlobalGallery } from "./globalGallery";
import type { GalleryImage } from "./types";
import { LIGHTBOX_CONFIG } from "./types";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

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
  const [LightboxComponent, setLightboxComponent] = useState<null |
    (typeof import("yet-another-react-lightbox").default)
  >(null);
  const [plugins, setPlugins] = useState<null | any[]>(null);

  useEffect(() => {
    let cancelled = false;

    if (!images.length) return undefined;

    const loadLightbox = async () => {
      const [lightboxModule, fullscreenModule, zoomModule, thumbnailsModule] =
        await Promise.all([
          import("yet-another-react-lightbox"),
          import("yet-another-react-lightbox/plugins/fullscreen"),
          import("yet-another-react-lightbox/plugins/zoom"),
          import("yet-another-react-lightbox/plugins/thumbnails"),
        ]);

      if (cancelled) return;

      setLightboxComponent(() => lightboxModule.default);
      setPlugins([fullscreenModule.default, zoomModule.default, thumbnailsModule.default]);
    };

    loadLightbox();

    return () => {
      cancelled = true;
    };
  }, [images.length]);

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

  if (!LightboxComponent || !plugins || images.length === 0) return null;

  return (
    <LightboxComponent
      open={isOpen}
      close={() => setIsOpen(false)}
      slides={images}
      index={currentIndex}
      plugins={plugins}
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
