import Button from '@/components/ui/button';

export default function SellerDashboardPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-card">
        <h1 className="text-xl font-semibold">Seller Dashboard</h1>
        <p className="text-sm text-bazar-text/60">Orders this week: 8 • Revenue: ₹12,400</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-card">
          <h2 className="text-sm font-semibold">Incoming Orders</h2>
          <p className="text-xs text-bazar-text/60">2 new orders in last 10 minutes</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-card">
          <h2 className="text-sm font-semibold">Boost Listings</h2>
          <p className="text-xs text-bazar-text/60">Pin your product in top categories.</p>
          <Button className="mt-3">Boost product</Button>
        </div>
      </div>
    </div>
  );
}
