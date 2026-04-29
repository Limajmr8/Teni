import ItemRow from '@/components/picker/item-row';
import PickProgress from '@/components/picker/pick-progress';
import Button from '@/components/ui/button';

export default function PickerOrderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Order #2401</h1>
        <p className="text-sm text-bazar-text/60">Buyer: Alongla • Town center</p>
      </div>
      <PickProgress picked={2} total={6} />
      <div className="space-y-3">
        <ItemRow name="Amul Milk 1L" quantity={2} shelf="A1-2" />
        <ItemRow name="Bread loaf" quantity={1} shelf="B1-1" />
        <ItemRow name="Tomato 500g" quantity={3} shelf="C1-1" />
      </div>
      <Button className="w-full">Hand to packer</Button>
    </div>
  );
}
