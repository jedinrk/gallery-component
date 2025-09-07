'use client';

import { useEffect, useRef, useState } from 'react';
import { useGalleryStore } from '@/lib/store';
import { GalleryItem } from './GalleryItem';
import { GalleryItem as GalleryItemType } from '@/types/gallery';

interface GalleryGridProps {
  onItemClick: (item: GalleryItemType) => void;
}

export function GalleryGrid({ onItemClick }: GalleryGridProps) {
  const { filteredItems, isLoading } = useGalleryStore();
  const gridRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="gallery-grid">
        {/* Skeleton loading */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="gallery-item animate-pulse bg-gray-200 rounded"
            style={{ height: `${200 + Math.random() * 200}px` }}
          />
        ))}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="gallery-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="gallery-item animate-pulse bg-gray-200 rounded"
            style={{ height: `${200 + Math.random() * 200}px` }}
          />
        ))}
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No items found for the selected filter.</p>
      </div>
    );
  }

  return (
    <div ref={gridRef} className="gallery-grid">
      {filteredItems.map((item, index) => (
        <GalleryItem
          key={`${item.id}-${index}`}
          item={item}
          onClick={() => onItemClick(item)}
        />
      ))}
    </div>
  );
}
