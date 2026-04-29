import LiveTracker from '@/components/orders/live-tracker';

export default function OrderDetailPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Order #2411</h1>
        <p className="text-sm text-bazar-text/60">2 deliveries • Live tracking enabled</p>
      </div>
      <LiveTracker lat={26.3242} lng={94.5083} />
      <div className="space-y-3 rounded-3xl bg-white p-5 shadow-card">
        <div className="flex items-center justify-between text-sm">
          <span>Dark store delivery</span>
          <span className="text-bazar-primary">Out for delivery</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Aunty Imtisunep (Smoked Pork)</span>
          <span className="text-bazar-text/60">Arriving by 5pm</span>
        </div>
      </div>
    </div>
  );
}
