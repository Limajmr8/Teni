import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

export default function WarehouseLoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-6 rounded-3xl bg-white p-6 shadow-card">
      <h1 className="text-xl font-semibold">Warehouse login</h1>
      <Input placeholder="Phone (+91...)" />
      <Button className="w-full">Send OTP</Button>
    </div>
  );
}
