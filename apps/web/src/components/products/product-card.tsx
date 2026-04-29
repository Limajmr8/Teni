'use client';

import Image from 'next/image';
import Button from '@/components/ui/button';
import { formatPaise } from '@bazar/shared';
import { useCartStore } from '@/stores/cart';
import { getCloudinaryUrl } from '@/lib/cloudinary';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  source: 'dark_store' | 'seller';
  sellerId?: string;
  unit?: string;
}

export default function ProductCard({ id, name, price, image, source, sellerId, unit }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="rounded-2xl border border-bazar-border bg-white p-3 shadow-card">
      <div className="relative h-32 w-full overflow-hidden rounded-xl bg-bazar-border/40">
        <Image
          src={getCloudinaryUrl(image)}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 20vw"
        />
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-sm font-semibold text-bazar-text">{name}</p>
        <p className="text-xs text-bazar-text/60">{unit ?? 'Pack'}</p>
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-semibold">{formatPaise(price)}</span>
          <Button
            onClick={() =>
              addItem({
                id,
                name,
                price,
                quantity: 1,
                source,
                sellerId,
                unit,
                imageUrl: image,
              })
            }
            className="px-3 py-1 text-xs"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
