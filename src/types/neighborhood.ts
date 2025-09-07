export interface DiningVenue {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'restaurant' | 'bar' | 'cafe';
}

export interface CategoryItem {
  name: string;
  type: 'restaurant' | 'venue' | 'shop' | 'activity';
  image?: string;
  description?: string;
}

export interface NeighborhoodCategory {
  title: string;
  items: CategoryItem[];
}

export interface NeighborhoodData {
  hero: {
    title: string[];
  };
  vibrantNeighborhood: {
    title: string;
    description: string;
    image: string;
  };
  momaSection: {
    title: string;
    description: string;
    image: string;
  };
  whereToSection: WhereToSection;
  diningVenues: DiningVenue[];
  essenceCategories: NeighborhoodCategory[];
  map: {
    image: string;
    alt: string;
  };
  cta: {
    title: string;
    buttonText: string;
    link: string;
  };
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface WhereToItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'dine-sip' | 'see-hear' | 'shop-browse' | 'move-play';
}

export interface WhereToCategory {
  label: string;
  items: WhereToItem[];
}

export interface WhereToSection {
  title: string;
  categories: {
    'dine-sip': WhereToCategory;
    'see-hear': WhereToCategory;
    'shop-browse': WhereToCategory;
    'move-play': WhereToCategory;
  };
}

export interface ContactInfo {
  email: string;
  phone: string;
  instagram: string;
  press: string;
}
