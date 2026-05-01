"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@bazar/shared/src/supabase";
import { ArrowLeft, Phone, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendOTP = async () => {
    if (!phone.startsWith("+91")) {
      setError("Please include +91 prefix");
      return;
    }
    setLoading(true);
    setError("");
    
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone,
    });

    if (error) {
      setError(error.message);
    } else {
      setStep(2);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError("");
    
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col">
      <header className="mb-12">
        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-neutral-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black">{step === 1 ? "Welcome to TENI" : "Verify Number"}</h1>
          <p className="text-neutral-500 font-medium">
            {step === 1 ? "Enter your phone number to continue" : `We sent a code to ${phone}`}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {step === 1 ? (
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type="tel" 
                placeholder="+91 00000 00000" 
                className="w-full pl-12 pr-4 py-4 bg-neutral-100 rounded-2xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          ) : (
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type="number" 
                placeholder="6-digit code" 
                className="w-full pl-12 pr-4 py-4 bg-neutral-100 rounded-2xl font-bold text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          )}

          <button 
            onClick={step === 1 ? handleSendOTP : handleVerifyOTP}
            disabled={loading}
            className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                {step === 1 ? "SEND OTP" : "VERIFY & LOGIN"}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {step === 2 && (
          <button 
            onClick={() => setStep(1)}
            className="w-full text-center text-sm font-bold text-neutral-400 uppercase tracking-widest"
          >
            Change Number
          </button>
        )}
      </div>

      <footer className="text-center text-xs text-neutral-400 font-medium pb-8">
        By continuing, you agree to TENI's <br />
        <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
      </footer>
    </div>
  );
}
