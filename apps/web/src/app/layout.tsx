import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/context/CartContext";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TENI - Mokokchung's Hyperlocal Marketplace",
  description: "Get groceries in 15 mins and shop from local Mokokchung sellers.",
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
