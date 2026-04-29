import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

export default function NewSkuPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Add new SKU</h1>
      <div className="rounded-2xl border border-bazar-border bg-white p-6 shadow-card space-y-3">
        <Input placeholder="SKU name" />
        <Input placeholder="Brand" />
        <Input placeholder="Purchase price (paise)" />
        <Input placeholder="Selling price (paise)" />
        <Input placeholder="MRP (paise)" />
        <Input placeholder="Shelf code" />
        <Button className="w-full">Save SKU</Button>
      </div>
    </div>
  );
}
