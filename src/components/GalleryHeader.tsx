'use client';

import { useGalleryStore } from '@/lib/store';
import { galleryFilters } from '@/data/gallery-data';
import { cn } from '@/lib/utils';

export function GalleryHeader() {
  const { activeFilter, setActiveFilter } = useGalleryStore();

  return (
    <div className="mb-16">
      {/* Gallery Title */}
      <h1 className="gallery-title mb-12">
        GALLERY
      </h1>
      
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-8 justify-start">
        {galleryFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              'gallery-filter-tab',
              activeFilter === filter.id && 'active'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
