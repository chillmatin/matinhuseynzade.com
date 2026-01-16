// Global gallery state management
interface GalleryImage {
  src: string;
  alt: string;
}

class GlobalGallery {
  private images: GalleryImage[] = [];
  private listeners: Set<(images: GalleryImage[]) => void> = new Set();
  private openListeners: Set<(index: number) => void> = new Set();

  registerImage(image: GalleryImage): number {
    const index = this.images.length;
    this.images.push(image);
    this.notifyListeners();
    return index;
  }

  registerImages(images: GalleryImage[]): number[] {
    const startIndex = this.images.length;
    const indices = images.map((_, i) => startIndex + i);
    this.images.push(...images);
    this.notifyListeners();
    return indices;
  }

  getImages(): GalleryImage[] {
    return this.images;
  }

  openGallery(index: number): void {
    this.openListeners.forEach((listener) => listener(index));
  }

  subscribe(listener: (images: GalleryImage[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  subscribeToOpen(listener: (index: number) => void): () => void {
    this.openListeners.add(listener);
    return () => this.openListeners.delete(listener);
  }

  reset(): void {
    this.images = [];
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.images));
  }
}

// Create a global instance
if (typeof window !== "undefined") {
  (window as any).__globalGallery = (window as any).__globalGallery || new GlobalGallery();
}

export function getGlobalGallery(): GlobalGallery {
  if (typeof window === "undefined") {
    return new GlobalGallery();
  }
  return (window as any).__globalGallery;
}
