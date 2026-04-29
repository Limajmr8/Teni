import Link from 'next/link';

interface OrderCardProps {
  id: string;
  status: string;
  total: string;
  eta: string;
}

export default function OrderCard({ id, status, total, eta }: OrderCardProps) {
  return (
    <Link
      href={`/orders/${id}`}
      className="block rounded-2xl border border-bazar-border bg-white p-4 shadow-card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Order #{id}</p>
          <p className="text-xs text-bazar-text/60">ETA {eta}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-bazar-text/60">{status}</p>
          <p className="text-sm font-semibold">{total}</p>
        </div>
      </div>
    </Link>
  );
}
