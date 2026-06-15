import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Grand Emaar Hotel Nawabshah - Luxurious Hotel & Restaurant',
  description: "Experience Nawabshah's first certified Two-Star hotel. Offering deluxe executive rest rooms, secure family sit-ins, and multi-cuisine restaurant grills on Sakrand Road.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body suppressHydrationWarning className="font-sans bg-[#FDFCF9] text-neutral-800 antialiased selection:bg-[#C5A059]/20 selection:text-neutral-900">
        {children}
      </body>
    </html>
  );
}
