import Link from 'next/link';

interface OrderCardProps {
  id: string;
  buyer: string;
  locality: string;
  itemCount: number;
}

export default function OrderCard({ id, buyer, locality, itemCount }: OrderCardProps) {
  return (
    <Link
      href={`/picker/${id}`}
      className="block rounded-2xl border border-bazar-border bg-white p-4 shadow-card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Order #{id}</p>
          <p className="text-xs text-bazar-text/60">{buyer} • {locality}</p>
        </div>
        <span className="text-sm font-semibold">{itemCount} items</span>
      </div>
    </Link>
  );
}
