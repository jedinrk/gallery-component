export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  type: 'image' | 'video';
  category: GalleryCategory;
  width?: number;
  height?: number;
  aspectRatio?: number;
}

export type GalleryCategory = 'all' | 'design' | 'residences' | 'amenities' | 'views' | 'video';

export interface GalleryFilter {
  id: GalleryCategory;
  label: string;
  count?: number;
}

export interface GalleryState {
  items: GalleryItem[];
  filteredItems: GalleryItem[];
  activeFilter: GalleryCategory;
  isLoading: boolean;
  error: string | null;
}

export interface GalleryActions {
  setActiveFilter: (filter: GalleryCategory) => void;
  setItems: (items: GalleryItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export type GalleryStore = GalleryState & GalleryActions;
