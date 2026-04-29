import Input from '@/components/ui/input';
import Button from '@/components/ui/button';

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">Checkout</h1>
      <div className="space-y-3 rounded-3xl bg-white p-5 shadow-card">
        <Input placeholder="Name" />
        <Input placeholder="Phone (+91...)" />
        <Input placeholder="Address line 1" />
        <Input placeholder="Locality" />
        <Input placeholder="Landmark" />
      </div>
      <Button className="w-full">Pay with Razorpay</Button>
    </div>
  );
}
