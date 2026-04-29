import Button from '@/components/ui/button';

export default function SellerDetailPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Seller detail</h1>
      <div className="rounded-2xl border border-bazar-border bg-white p-6 shadow-card">
        <p className="text-sm">Store: Aunty Imtisunep</p>
        <p className="text-sm text-bazar-text/60">Category: Smoked meat</p>
        <div className="mt-4 flex gap-2">
          <Button variant="ghost" className="border border-bazar-border">
            Reject
          </Button>
          <Button>Approve</Button>
        </div>
      </div>
    </div>
  );
}
