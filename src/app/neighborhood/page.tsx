import { Metadata } from 'next';
import ScrollBlendHeader from '@/components/navigation/ScrollBlendHeader';
import NeighborhoodHero from '@/components/neighborhood/NeighborhoodHero';
import NeighborhoodIntro from '@/components/neighborhood/NeighborhoodIntro';
import NeighborhoodTransition from '@/components/neighborhood/NeighborhoodTransition';
import MoMASection from '@/components/neighborhood/MoMASection';
import WhereToSection from '@/components/neighborhood/WhereToSection';
import DiningCarousel from '@/components/neighborhood/DiningCarousel';
import EssenceGrid from '@/components/neighborhood/EssenceGrid';
import NeighborhoodMap from '@/components/neighborhood/NeighborhoodMap';
import ExperienceBuilding from '@/components/neighborhood/ExperienceBuilding';

export const metadata: Metadata = {
  title: 'Neighborhood | Manhattan Condominiums near MoMA',
  description: 'Discover the vibrant neighborhood surrounding 53 West 53. Located in the heart of Midtown Manhattan, connected to MoMA with world-class dining, culture, and entertainment.',
  keywords: 'Manhattan neighborhood, MoMA, Midtown, luxury condominiums, NYC dining, culture, shopping',
  openGraph: {
    title: 'Neighborhood | Manhattan Condominiums near MoMA',
    description: 'Discover the vibrant neighborhood surrounding 53 West 53.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function NeighborhoodPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <ScrollBlendHeader />
      
      {/* Hero Section */}
      <NeighborhoodHero />
      
      {/* Vibrant Neighborhood Section */}
      {/* <NeighborhoodIntro /> */}
      
      {/* Neighborhood Transition */}
      <NeighborhoodTransition />
      
      {/* MoMA Section */}
      {/* <MoMASection /> */}
      
      {/* Where To Section */}
      <WhereToSection />
      
      {/* Dining Carousel */}
      <DiningCarousel />
      
      {/* Essence Grid */}
      <EssenceGrid />
      
      {/* Neighborhood Map */}
      <NeighborhoodMap />
      
      {/* Experience Building CTA */}
      <ExperienceBuilding />
    </div>
  );
}
