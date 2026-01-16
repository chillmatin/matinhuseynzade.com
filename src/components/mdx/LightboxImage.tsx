import { useEffect, useState } from "react";
import { getGlobalGallery } from "./globalGallery";

interface LightboxImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function LightboxImage({
  src,
  alt,
  width,
  height,
  className = "",
}: LightboxImageProps) {
  const [imageIndex, setImageIndex] = useState<number>(-1);

  useEffect(() => {
    const gallery = getGlobalGallery();
    const index = gallery.registerImage({ src, alt });
    setImageIndex(index);
  }, [src, alt]);

  const handleClick = () => {
    if (imageIndex >= 0) {
      getGlobalGallery().openGallery(imageIndex);
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
    />
  );
}
