import type { Metadata } from 'next';
import { Inter, Lora, Inter_Tight } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/header';
import BottomNav from '@/components/layout/bottom-nav';
import Providers from '@/components/layout/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
});

const interMono = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-mono',
});

export const metadata: Metadata = {
  title: 'BAZAR — Mokokchung Quick Commerce',
  description: 'BAZAR Now + BAZAR Market in one app for Mokokchung.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${interMono.variable} h-full`}
    >
      <body className="min-h-full bg-bazar-background text-bazar-text">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 px-4 pb-24 pt-4 md:px-8">{children}</main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
