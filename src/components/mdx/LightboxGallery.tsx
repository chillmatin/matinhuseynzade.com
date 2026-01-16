import { useEffect, useState } from "react";
import { useGallery } from "./useGallery";
import type { LightboxGalleryProps } from "./types";

/**
 * LightboxGallery - Grid of images that opens unified lightbox on click
 * 
 * Renders a responsive grid of images that all register with the global gallery.
 * Clicking any image opens the lightbox showing all images on the page in order.
 * 
 * @example
 * ```tsx
 * <LightboxGallery
 *   columns={3}
 *   images={[
 *     { src: "/img1.jpg", alt: "Image 1" },
 *     { src: "/img2.jpg", alt: "Image 2" },
 *   ]}
 * />
 * ```
 */
export default function LightboxGallery({
  images,
  columns = 2,
  className = "",
}: LightboxGalleryProps) {
  const { registerImages, openGallery } = useGallery();
  const [imageIndices, setImageIndices] = useState<number[]>([]);

  useEffect(() => {
    const slides = images.map((img) => ({
      src: img.href || img.src,
      alt: img.alt,
    }));
    const indices = registerImages(slides);
    setImageIndices(indices);
  }, [images, registerImages]);

  const columnClasses = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  const handleImageClick = (i: number) => {
    if (imageIndices[i] >= 0) {
      openGallery(imageIndices[i]);
    }
  };

  return (
    <div className={`grid ${columnClasses[columns]} gap-4 my-8 ${className}`}>
      {images.map((image, i) => (
        <img
          key={i}
          src={image.src}
          alt={image.alt}
          className="w-full aspect-square object-cover cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
          onClick={() => handleImageClick(i)}
        />
      ))}
    </div>
  );
}
