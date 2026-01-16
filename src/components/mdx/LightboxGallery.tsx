import { useEffect, useState } from "react";
import { getGlobalGallery } from "./globalGallery";

interface GalleryImage {
  src: string;
  alt: string;
  href?: string;
}

interface LightboxGalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export default function LightboxGallery({
  images,
  columns = 2,
  className = "",
}: LightboxGalleryProps) {
  const [imageIndices, setImageIndices] = useState<number[]>([]);

  useEffect(() => {
    const gallery = getGlobalGallery();
    const slides = images.map((img) => ({
      src: img.href || img.src,
      alt: img.alt,
    }));
    const indices = gallery.registerImages(slides);
    setImageIndices(indices);
  }, [images]);

  const handleClick = (i: number) => {
    if (imageIndices[i] >= 0) {
      getGlobalGallery().openGallery(imageIndices[i]);
    }
  };

  const columnClasses = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className={`grid ${columnClasses[columns]} gap-4 my-8 ${className}`}>
      {images.map((image, i) => (
        <img
          key={i}
          src={image.src}
          alt={image.alt}
          className="w-full aspect-square object-cover cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
          onClick={() => handleClick(i)}
          loading="lazy"
        />
      ))}
    </div>
  );
}
