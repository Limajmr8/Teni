"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@bazar/shared/src/supabase";
import { ArrowLeft, Mail, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendOTP = async () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setError("");
    
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
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
      email,
      token: otp,
      type: 'email',
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col font-sans">
      <header className="mb-12">
        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-neutral-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black">{step === 1 ? "Welcome to TENI" : "Verify Email"}</h1>
          <p className="text-neutral-500 font-medium">
            {step === 1 ? "Enter your email address to continue" : `We sent a code to ${email}`}
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
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="w-full pl-12 pr-4 py-4 bg-neutral-100 rounded-2xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
              />
            </div>
          ) : (
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type="text" 
                placeholder="6-digit code" 
                className="w-full pl-12 pr-4 py-4 bg-neutral-100 rounded-2xl font-bold text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyOTP()}
              />
            </div>
          )}

          <button 
            onClick={step === 1 ? handleSendOTP : handleVerifyOTP}
            disabled={loading}
            className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 text-lg uppercase tracking-wide font-black"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                {step === 1 ? "SEND CODE" : "VERIFY & LOGIN"}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {step === 2 && (
          <button 
            onClick={() => setStep(1)}
            className="w-full text-center text-sm font-bold text-neutral-400 uppercase tracking-widest hover:text-neutral-600 transition-colors"
          >
            Change Email
          </button>
        )}
      </div>

      <footer className="text-center text-xs text-neutral-400 font-medium pb-8">
        By continuing, you agree to TENI's <br />
        <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
      </footer>
    </div>
  );
}
