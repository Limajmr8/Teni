import Link from 'next/link';
import Button from '@/components/ui/button';

export default function SellerProductsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your products</h1>
        <Link href="/seller/products/new">
          <Button>Add product</Button>
        </Link>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-card">
        <p className="text-sm text-bazar-text/60">No products yet. Add your first listing.</p>
      </div>
    </div>
  );
}
