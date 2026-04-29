import Button from '@/components/ui/button';

interface ItemRowProps {
  name: string;
  quantity: number;
  shelf: string;
}

export default function ItemRow({ name, quantity, shelf }: ItemRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-bazar-border bg-white p-4 shadow-card">
      <div>
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-bazar-text/60">Shelf {shelf} • Qty {quantity}</p>
      </div>
      <Button variant="secondary">Picked</Button>
    </div>
  );
}
