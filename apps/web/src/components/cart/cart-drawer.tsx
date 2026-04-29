'use client';

import { useCartStore } from '@/stores/cart';
import Button from '@/components/ui/button';
import { formatPaise } from '@bazar/shared';

export default function CartDrawer() {
  const { items, subtotal, deliveryFee, total, clear } = useCartStore();

  if (items.length === 0) {
    return <p className="text-sm text-bazar-text/60">Your cart is empty.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between text-sm">
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-bazar-text/60">
              {item.quantity} × {formatPaise(item.price)}
            </p>
          </div>
          <span className="font-semibold">{formatPaise(item.price * item.quantity)}</span>
        </div>
      ))}
      <div className="border-t border-bazar-border pt-3 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPaise(subtotal())}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>{formatPaise(deliveryFee())}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPaise(total())}</span>
        </div>
      </div>
      <Button onClick={clear} variant="ghost" className="w-full">
        Clear cart
      </Button>
    </div>
  );
}
