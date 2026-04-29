import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

const roles = [
  { id: 'buyer', label: 'Buyer' },
  { id: 'seller', label: 'Seller' },
  { id: 'runner', label: 'Runner' },
  { id: 'warehouse_staff', label: 'Warehouse Staff' },
];

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md space-y-6 rounded-3xl bg-white p-6 shadow-card">
      <div>
        <h1 className="text-xl font-semibold">Create your BAZAR account</h1>
        <p className="text-sm text-bazar-text/60">Pick a role to get started.</p>
      </div>
      <Input placeholder="Full name" />
      <Input placeholder="+91 70123 45678" />
      <div className="grid grid-cols-2 gap-2">
        {roles.map((role) => (
          <Button key={role.id} variant="ghost" className="border border-bazar-border">
            {role.label}
          </Button>
        ))}
      </div>
      <Button className="w-full">Continue</Button>
    </div>
  );
}
