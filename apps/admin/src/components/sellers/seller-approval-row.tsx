import Button from '@/components/ui/button';

interface SellerApprovalRowProps {
  name: string;
  village: string;
}

export default function SellerApprovalRow({ name, village }: SellerApprovalRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-bazar-border bg-white p-4 shadow-card">
      <div>
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-bazar-text/60">{village}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" className="border border-bazar-border">
          Reject
        </Button>
        <Button>Approve</Button>
      </div>
    </div>
  );
}
