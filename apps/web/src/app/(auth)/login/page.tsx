import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import OtpInput from '@/components/auth/otp-input';

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-6 rounded-3xl bg-white p-6 shadow-card">
      <div>
        <h1 className="text-xl font-semibold">Welcome back</h1>
        <p className="text-sm text-bazar-text/60">Sign in with your phone number.</p>
      </div>
      <div className="space-y-3">
        <Input placeholder="+91 70123 45678" />
        <Button className="w-full">Send OTP</Button>
      </div>
      <div className="space-y-3">
        <OtpInput />
        <Button className="w-full">Verify & Continue</Button>
      </div>
    </div>
  );
}
