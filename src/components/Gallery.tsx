'use client';

import { useEffect, useState } from 'react';
import { useGalleryStore } from '@/lib/store';
import { galleryItems } from '@/data/gallery-data';
import { GalleryHeader } from './GalleryHeader';
import { GalleryGrid } from './GalleryGrid';
import { GalleryItem as GalleryItemType } from '@/types/gallery';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export function Gallery() {
  const { setItems, setLoading } = useGalleryStore();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxSlides, setLightboxSlides] = useState<any[]>([]);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    // Load gallery items
    setTimeout(() => {
      setItems(galleryItems);
    }, 500);
  }, [setItems, setLoading]);

  const handleItemClick = (item: GalleryItemType) => {
    // Prepare slides for lightbox
    const slides = galleryItems.map(galleryItem => ({
      src: galleryItem.src,
      alt: galleryItem.alt,
      width: 2000,
      height: Math.round(2000 / (galleryItem.aspectRatio || 1.5))
    }));

    const clickedIndex = galleryItems.findIndex(galleryItem => galleryItem.id === item.id);
    
    setLightboxSlides(slides);
    setLightboxIndex(clickedIndex);
    setLightboxOpen(true);
  };

  return (
    <div className="site-max relative mt-100 s:mt-150">
      <GalleryHeader />
      <GalleryGrid onItemClick={handleItemClick} />
      
      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        carousel={{
          finite: false,
          preload: 2,
        }}
        render={{
          buttonPrev: lightboxSlides.length <= 1 ? () => null : undefined,
          buttonNext: lightboxSlides.length <= 1 ? () => null : undefined,
        }}
        controller={{
          closeOnBackdropClick: true,
          closeOnPullDown: true,
          closeOnPullUp: true,
        }}
        animation={{
          fade: 300,
          swipe: 500,
        }}
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          },
        }}
      />
    </div>
  );
}
