'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GalleryItem as GalleryItemType } from '@/types/gallery';
import { cn } from '@/lib/utils';

interface GalleryItemProps {
  item: GalleryItemType;
  onClick: () => void;
}

export function GalleryItem({ item, onClick }: GalleryItemProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div 
      className={cn(
        'gallery-item cursor-pointer',
        !isLoaded && 'opacity-0',
        isLoaded && 'opacity-100 fade-in-up'
      )}
      onClick={onClick}
    >
      {!hasError ? (
        <div className="relative">
          <Image
            src={item.src}
            alt={item.alt}
            width={800}
            height={Math.round(800 / (item.aspectRatio || 1.5))}
            className="w-full h-auto object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={false}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          {/* Video Play Button */}
          {item.type === 'video' && (
            <div className="video-play-button">
              <div className="w-0 h-0 border-l-[16px] border-l-gray-800 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1" />
            </div>
          )}
        </div>
      ) : (
        <div 
          className="w-full bg-gray-200 flex items-center justify-center text-gray-500"
          style={{ 
            height: Math.round(400 / (item.aspectRatio || 1.5)) 
          }}
        >
          <span className="text-sm">Image not available</span>
        </div>
      )}
    </div>
  );
}
