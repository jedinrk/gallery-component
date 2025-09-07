import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '53 West 53 Gallery | Manhattan Condominiums',
  description: 'Explore the stunning gallery of 53 West 53 Manhattan Condominiums. View interior designs, residences, amenities, and breathtaking views.',
  keywords: 'Manhattan condominiums, luxury apartments, 53 West 53, gallery, interior design, NYC real estate',
  openGraph: {
    title: '53 West 53 Gallery | Manhattan Condominiums',
    description: 'Explore the stunning gallery of 53 West 53 Manhattan Condominiums.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: '53 West 53 Gallery | Manhattan Condominiums',
    description: 'Explore the stunning gallery of 53 West 53 Manhattan Condominiums.',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-white`}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
