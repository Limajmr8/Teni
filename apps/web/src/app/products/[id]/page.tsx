import Image from 'next/image';
import Button from '@/components/ui/button';
import { formatPaise } from '@bazar/shared';

export default function ProductDetailPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="relative h-64 w-full overflow-hidden rounded-3xl bg-bazar-border/40">
        <Image src="/next.svg" alt="Product" fill className="object-cover" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Smoked Pork 500g</h1>
        <p className="text-bazar-text/60">From Longkhum village • Made today</p>
        <p className="font-mono text-xl font-semibold">{formatPaise(38000)}</p>
      </div>
      <Button className="w-full">Add to cart</Button>
      <div className="space-y-2 text-sm text-bazar-text/70">
        <p>Fresh batch smoked overnight. Ready to deliver today.</p>
        <p>Fulfillment: BAZAR Runner Assisted</p>
      </div>
    </div>
  );
}
