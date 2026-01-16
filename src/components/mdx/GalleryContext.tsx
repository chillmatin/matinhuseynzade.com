import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryContextType {
  images: GalleryImage[];
  registerImage: (image: GalleryImage) => number;
  registerImages: (images: GalleryImage[]) => number[];
  openGallery: (index: number) => void;
}

const GalleryContext = createContext<GalleryContextType | null>(null);

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const registerImage = useCallback((image: GalleryImage) => {
    let index = -1;
    setImages((prev) => {
      index = prev.length;
      return [...prev, image];
    });
    return index;
  }, []);

  const registerImages = useCallback((newImages: GalleryImage[]) => {
    const indices: number[] = [];
    setImages((prev) => {
      const startIndex = prev.length;
      newImages.forEach((_, i) => indices.push(startIndex + i));
      return [...prev, ...newImages];
    });
    return indices;
  }, []);

  const openGallery = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  return (
    <GalleryContext.Provider value={{ images, registerImage, registerImages, openGallery }}>
      {children}
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
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error("useGallery must be used within a GalleryProvider");
  }
  return context;
}
