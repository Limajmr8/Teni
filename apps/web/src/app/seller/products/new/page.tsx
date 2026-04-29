import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-xl font-semibold">Add new product</h1>
      <div className="space-y-3 rounded-3xl bg-white p-6 shadow-card">
        <Input placeholder="Product name" />
        <Input placeholder="Price (in paise)" />
        <Input placeholder="Unit (kg/pack/piece)" />
        <Input placeholder="Story" />
        <Input placeholder="Village origin" />
        <Input placeholder="Stock quantity" />
        <Button className="w-full">Save product</Button>
      </div>
    </div>
  );
}
