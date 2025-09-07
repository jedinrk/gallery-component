import { create } from 'zustand';
import { GalleryStore, GalleryCategory, GalleryItem } from '@/types/gallery';

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  // State
  items: [],
  filteredItems: [],
  activeFilter: 'all',
  isLoading: false,
  error: null,

  // Actions
  setActiveFilter: (filter: GalleryCategory) => {
    const { items } = get();
    const filteredItems = filter === 'all' 
      ? items 
      : items.filter(item => item.category === filter);
    
    set({ 
      activeFilter: filter, 
      filteredItems 
    });
  },

  setItems: (items: GalleryItem[]) => {
    const { activeFilter } = get();
    const filteredItems = activeFilter === 'all' 
      ? items 
      : items.filter(item => item.category === activeFilter);
    
    set({ 
      items, 
      filteredItems,
      isLoading: false,
      error: null 
    });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error, isLoading: false });
  },
}));
