import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

export default function SellerOnboardingPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Seller onboarding (4 steps)</h1>
        <p className="text-sm text-bazar-text/60">Under 4 minutes to launch your store.</p>
      </div>
      <div className="space-y-3 rounded-3xl bg-white p-6 shadow-card">
        <Input placeholder="Store name" />
        <Input placeholder="Your name" />
        <Input placeholder="Village / locality" />
        <Input placeholder="WhatsApp number" />
        <Input placeholder="UPI ID" />
        <Button className="w-full">Preview store</Button>
      </div>
    </div>
  );
}
