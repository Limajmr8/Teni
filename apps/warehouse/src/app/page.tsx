import Link from 'next/link';

export default function WarehouseHomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Warehouse operations</h1>
      <p className="text-sm text-bazar-text/70">Pick, pack, and dispatch orders in real time.</p>
      <Link href="/picker" className="text-bazar-primary underline">
        Go to picker queue
      </Link>
    </div>
  );
}
