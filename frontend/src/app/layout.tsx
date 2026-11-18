import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BharatBN™ — AI-Powered Business Discovery & Enterprise Visibility Platform',
  description:
    'Discover verified local businesses, clinics, preschools, and franchise networks across India. Powered by Engine 7 and Pay-As-You-Rank™.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bharatbn.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.className} suppressHydrationWarning>
      <body
        className="flex flex-col min-h-screen antialiased text-slate-800 font-sans"
        suppressHydrationWarning
      >
        <Navbar />
        <main className="flex-1 overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
