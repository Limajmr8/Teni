import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/context/CartContext";

const outfit = Outfit({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#e11d48",
};

export const metadata: Metadata = {
  title: "TENI — Mokokchung's Hyperlocal Marketplace",
  description: "Get groceries delivered in 15 minutes and shop authentic Naga heritage products from local sellers in Mokokchung, Nagaland.",
  keywords: ["TENI", "Mokokchung", "Nagaland", "hyperlocal", "q-commerce", "smoked pork", "Naga food", "heritage", "marketplace"],
  openGraph: {
    title: "TENI — Mokokchung's Hyperlocal Marketplace",
    description: "Fresh groceries in 15 mins. Authentic Naga heritage products from local sellers.",
    type: "website",
    locale: "en_IN",
    siteName: "TENI",
  },
  twitter: {
    card: "summary_large_image",
    title: "TENI — Mokokchung's Hyperlocal Marketplace",
    description: "Fresh groceries in 15 mins. Authentic Naga heritage products from local sellers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(outfit.className, "min-h-screen bg-neutral-900 flex justify-center")}>
        <CartProvider>
          <main className="w-full max-w-md min-h-screen bg-white shadow-2xl relative overflow-x-hidden">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}

