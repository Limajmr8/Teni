import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">BAZAR Admin</h1>
      <p className="text-sm text-bazar-text/70">Use the dashboard to manage towns, sellers, and inventory.</p>
      <Link href="/dashboard" className="text-bazar-primary underline">
        Go to dashboard
      </Link>
    </div>
  );
}
