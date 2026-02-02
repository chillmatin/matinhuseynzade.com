import { useEffect, useMemo, useState } from "react";
import { useGallery } from "./useGallery";

type GalleryItem = {
  src: string;
  alt: string;
  href?: string;
  width?: number;
  height?: number;
};

export interface GalleryProps {
  images: GalleryItem[];
  columns?: 1 | 2 | 3 | 4;
  lightbox?: boolean;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  singleSizes?: string;
}

export default function Gallery({
  images,
  columns = 3,
  lightbox = true,
  className = "",
  imageClassName = "",
  sizes,
  singleSizes = "(min-width: 1024px) 800px, 100vw",
}: GalleryProps) {
  const { registerImages, openGallery } = useGallery();
  const [imageIndices, setImageIndices] = useState<number[]>([]);

  const isSingle = images.length === 1;

  const slides = useMemo(
    () => images.map((img) => ({ src: img.href || img.src, alt: img.alt })),
    [images]
  );

  useEffect(() => {
    if (!lightbox || images.length === 0) return;
    const indices = registerImages(slides);
    setImageIndices(indices);
  }, [lightbox, images.length, registerImages, slides]);

  const gridSizesByCols: Record<1 | 2 | 3 | 4, string> = {
    1: singleSizes,
    2: "(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 100vw",
    3: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
    4: "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw",
  };

  const computedSizes = sizes || gridSizesByCols[columns];

  const baseImageClass = "rounded-lg transition-opacity";
  const interactiveClass = lightbox ? "cursor-pointer hover:opacity-90" : "";
  const singleImageClass = `w-full h-auto ${baseImageClass} ${interactiveClass} ${imageClassName}`;
  const gridImageClass = `w-full aspect-square object-cover ${baseImageClass} ${interactiveClass} ${imageClassName}`;

  const handleImageClick = (i: number) => {
    if (lightbox && imageIndices[i] >= 0) {
      openGallery(imageIndices[i]);
    }
  };

  if (isSingle) {
    const image = images[0];
    return (
      <div className={`my-8 ${className}`}>
        {lightbox ? (
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className={singleImageClass}
            loading="lazy"
            decoding="async"
            sizes={singleSizes}
            onClick={() => handleImageClick(0)}
          />
        ) : image.href ? (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={image.href}
            className="block w-full">
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className={singleImageClass}
              loading="lazy"
              decoding="async"
              sizes={singleSizes}
            />
          </a>
        ) : (
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className={singleImageClass}
            loading="lazy"
            decoding="async"
            sizes={singleSizes}
          />
        )}
      </div>
    );
  }

  const columnClasses: Record<1 | 2 | 3 | 4, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className={`grid ${columnClasses[columns]} gap-4 my-8 ${className}`}>
      {images.map((image, i) =>
        lightbox ? (
          <img
            key={i}
            src={image.src}
            alt={image.alt}
            className={gridImageClass}
            loading="lazy"
            decoding="async"
            sizes={computedSizes}
            onClick={() => handleImageClick(i)}
          />
        ) : image.href ? (
          <a
            key={i}
            target="_blank"
            rel="noopener noreferrer"
            href={image.href}
            className="block w-full h-full">
            <img
              src={image.src}
              alt={image.alt}
              className={gridImageClass}
              loading="lazy"
              decoding="async"
              sizes={computedSizes}
            />
          </a>
        ) : (
          <img
            key={i}
            src={image.src}
            alt={image.alt}
            className={gridImageClass}
            loading="lazy"
            decoding="async"
            sizes={computedSizes}
          />
        )
      )}
    </div>
  );
}
