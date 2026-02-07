import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Space_Grotesk, Inter } from 'next/font/google';

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'Roofer Univers',
  description: 'E-commerce outdoor avec vérification email',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`min-h-screen text-slate-100 bg-[#0b1220] ${display.variable} ${body.variable} font-body`}>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">{children}</main>
      </body>
    </html>
  );
}
