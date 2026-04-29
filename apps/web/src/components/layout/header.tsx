'use client';

import Link from 'next/link';
import { MapPin, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cart';

export default function Header() {
  const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <header className="sticky top-0 z-20 border-b border-bazar-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bazar-primary text-white">B</div>
          <div>
            <p className="text-sm font-semibold">BAZAR</p>
            <p className="text-xs text-bazar-text/70">Mokokchung</p>
          </div>
        </Link>
        <div className="hidden items-center gap-2 text-sm text-bazar-text/70 md:flex">
          <MapPin className="h-4 w-4" />
          <span>Ward-2, Mokokchung</span>
        </div>
        <Link href="/cart" className="relative flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-bazar-accent text-xs font-semibold text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
