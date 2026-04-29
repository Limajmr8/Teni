import Button from '@/components/ui/button';

export default function PackerOrderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Order #2398</h1>
        <p className="text-sm text-bazar-text/60">Verify items and assign runner.</p>
      </div>
      <div className="rounded-2xl border border-bazar-border bg-white p-4 shadow-card">
        <p className="text-sm text-bazar-text/60">Items verified: 5</p>
      </div>
      <Button className="w-full">Assign runner</Button>
      <Button variant="ghost" className="w-full border border-bazar-border">
        Mark self pickup ready
      </Button>
    </div>
  );
}
