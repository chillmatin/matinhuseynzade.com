import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { getGlobalGallery } from "./globalGallery";

export default function GlobalLightbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<Array<{ src: string; alt: string }>>([]);

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
      zoom={{
        maxZoomPixelRatio: 3,
        scrollToZoom: true,
      }}
      controller={{
        closeOnBackdropClick: true,
      }}
      on={{
        view: ({ index }) => setCurrentIndex(index),
      }}
      animation={{ fade: 250 }}
      carousel={{
        finite: false,
      }}
    />
  );
}
