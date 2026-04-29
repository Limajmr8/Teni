import Link from 'next/link';
import Button from '@/components/ui/button';

export default function PurchaseOrdersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Purchase orders</h1>
        <Link href="/purchase-orders/new">
          <Button>Create PO</Button>
        </Link>
      </div>
      <div className="rounded-2xl border border-bazar-border bg-white p-4 shadow-card">
        <p className="text-sm text-bazar-text/60">No pending POs</p>
      </div>
    </div>
  );
}
