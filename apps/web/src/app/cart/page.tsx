import CartDrawer from '@/components/cart/cart-drawer';
import Button from '@/components/ui/button';
import Link from 'next/link';

export default function CartPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">Your cart</h1>
      <CartDrawer />
      <Link href="/checkout">
        <Button className="w-full">Proceed to checkout</Button>
      </Link>
    </div>
  );
}
