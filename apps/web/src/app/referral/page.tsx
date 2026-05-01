"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Gift, Share2, Copy, Users } from "lucide-react";

export default function ReferralPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const referralCode = "TENI-MOK24";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 font-sans selection:bg-emerald-500 selection:text-white">
      <header className="p-5 bg-white/80 backdrop-blur-md border-b border-neutral-100 flex items-center justify-between sticky top-0 z-20">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 active:scale-90 transition-transform">
          <ArrowLeft className="w-5 h-5 text-neutral-800" />
        </button>
        <h1 className="text-lg font-black text-neutral-900">Invite Neighbors</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="bg-emerald-600 text-white p-8 text-center relative overflow-hidden rounded-b-[40px] shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-900/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30 shadow-xl relative z-10">
            <Gift className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl font-black mb-3 relative z-10">Get ₹100 Off!</h2>
          <p className="text-emerald-100 font-medium leading-relaxed relative z-10 text-sm px-4">
            Invite your neighbors in Mokokchung. They get ₹50 off their first order, and you get ₹100 when their order is delivered!
          </p>
        </div>

        {/* Share Section */}
        <div className="p-6 -mt-8 relative z-10 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-neutral-200/50 border border-neutral-100 space-y-4">
            <p className="text-xs font-black text-neutral-400 uppercase tracking-widest text-center">Your Referral Code</p>
            
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-neutral-100 p-4 rounded-2xl border border-neutral-200 border-dashed text-center">
                <span className="text-2xl font-black text-emerald-700 tracking-wider">{referralCode}</span>
              </div>
              <button 
                onClick={handleCopy}
                className="w-16 h-[68px] bg-emerald-50 text-emerald-600 rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-emerald-100 transition-colors border border-emerald-100"
              >
                {copied ? <span className="text-xs font-black">Copied!</span> : <><Copy className="w-5 h-5" /><span className="text-[10px] font-bold uppercase">Copy</span></>}
              </button>
            </div>

            <button className="w-full btn-primary h-14 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 text-sm tracking-wide">
              <Share2 className="w-5 h-5" /> SHARE WITH NEIGHBORS
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-100 text-center">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-neutral-900">12</p>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Neighbors Invited</p>
            </div>
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-100 text-center">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-neutral-900">₹1200</p>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Total Earned</p>
            </div>
          </div>
          
          <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100">
             <h3 className="text-sm font-black text-emerald-800 mb-2">How it works</h3>
             <ul className="space-y-3">
               <li className="flex gap-3 items-start">
                 <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">1</span>
                 <p className="text-xs font-medium text-emerald-900 leading-relaxed">Share your code with neighbors.</p>
               </li>
               <li className="flex gap-3 items-start">
                 <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">2</span>
                 <p className="text-xs font-medium text-emerald-900 leading-relaxed">They get ₹50 off their first dark store or marketplace order.</p>
               </li>
               <li className="flex gap-3 items-start">
                 <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">3</span>
                 <p className="text-xs font-medium text-emerald-900 leading-relaxed">You earn ₹100 wallet cashback once their order is delivered!</p>
               </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
