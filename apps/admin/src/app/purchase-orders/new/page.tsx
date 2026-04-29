import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

export default function NewPurchaseOrderPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Create purchase order</h1>
      <div className="rounded-2xl border border-bazar-border bg-white p-6 shadow-card space-y-3">
        <Input placeholder="Supplier name" />
        <Input placeholder="Expected date" />
        <Input placeholder="Items (JSON)" />
        <Button className="w-full">Save PO</Button>
      </div>
    </div>
  );
}
