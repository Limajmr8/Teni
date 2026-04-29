import Link from 'next/link';
import Button from '@/components/ui/button';

export default function InventoryPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">SKU inventory</h1>
        <Link href="/inventory/skus/new">
          <Button>Add SKU</Button>
        </Link>
      </div>
      <div className="rounded-2xl border border-bazar-border bg-white p-4 shadow-card">
        <p className="text-sm text-bazar-text/60">20 SKUs • Low stock alerts enabled</p>
      </div>
    </div>
  );
}
