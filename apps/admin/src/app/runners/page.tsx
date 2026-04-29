import Button from '@/components/ui/button';

export default function RunnersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Runner payouts</h1>
      <div className="rounded-2xl border border-bazar-border bg-white p-4 shadow-card">
        <p className="text-sm text-bazar-text/60">Batch payout ready for 14 runners.</p>
        <Button className="mt-3">Send UPI payout</Button>
      </div>
    </div>
  );
}
