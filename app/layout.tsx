import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { LanguageProvider } from '@/lib/context/LanguageContext';
import { LocationProvider } from '@/lib/context/LocationContext';
import { SavedPlacesProvider } from '@/lib/context/SavedPlacesContext';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';
import { PWARegister } from '@/components/pwa/PWARegister';
import { KashiMitraChat } from '@/components/chat/KashiMitraChat';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { ScrollGangaBoat } from '@/components/interactive/ScrollGangaBoat';

export const metadata: Metadata = {
  title: 'Mapporae — Your Varanasi City Guide, Made Simple',
  description:
    'Discover Varanasi (Kashi) ghats, ancient temples, iconic street food, 24x7 emergency services, live weather, air quality, and interactive maps from one calm dashboard.',
  keywords: [
    'Varanasi',
    'Kashi',
    'Ganga Aarti',
    'Dashashwamedh Ghat',
    'Assi Ghat',
    'Kashi Vishwanath Temple',
    'Varanasi Map',
    'Varanasi Street Food',
    'Banaras Guide'
  ],
  manifest: '/manifest.json',
  authors: [{ name: 'Mapporae Varanasi' }],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mapporae',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF9F6' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1120' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-[#FAF9F6] dark:bg-[#0B1120] text-[#172554] dark:text-[#F8FAFC] selection:bg-[#E0F2FE] selection:text-[#0E7490] transition-colors duration-200">
        <ThemeProvider>
          <LanguageProvider>
            <LocationProvider>
              <SavedPlacesProvider>
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
                <MobileNav />
                <PWARegister />
                <KashiMitraChat />
                <ScrollToTop />
                <ScrollGangaBoat />
              </SavedPlacesProvider>
            </LocationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
