import { useEffect, useState } from "react";
import { useGallery } from "./useGallery";
import type { LightboxImageProps } from "./types";

/**
 * LightboxImage - Individual image with lightbox on click
 * 
 * Renders an image that registers itself with the global gallery.
 * Clicking the image opens the unified lightbox showing all images on the page.
 * 
 * @example
 * ```tsx
 * <LightboxImage
 *   src="/image.jpg"
 *   alt="Description"
 *   width={640}
 *   height={480}
 * />
 * ```
 */
export default function LightboxImage({
  src,
  alt,
  width,
  height,
  className = "",
}: LightboxImageProps) {
  const { registerImage, openGallery } = useGallery();
  const [imageIndex, setImageIndex] = useState<number>(-1);

  useEffect(() => {
    const index = registerImage({ src, alt });
    setImageIndex(index);
  }, [src, alt, registerImage]);

  const handleClick = () => {
    if (imageIndex >= 0) {
      openGallery(imageIndex);
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-lg cursor-pointer hover:opacity-90 transition-opacity ${className}`}
      onClick={handleClick}
      loading="lazy"
      decoding="async"
      sizes="(min-width: 1024px) 800px, 100vw"
    />
  );
}
