"use client";

import { useState } from "react";
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Package, 
  Shield, 
  Calculator,
  Check
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@bazar/shared/src/supabase";

type ParcelSize = "small" | "medium" | "large";

function generateLRNumber() {
  const chars = '0123456789ABCDEF';
  let code = 'MKG-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  code += '-';
  for (let i = 0; i < 2; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function CreateLRPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [senderPhone, setSenderPhone] = useState("");
  const [senderName, setSenderName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [destination, setDestination] = useState("Kohima");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState<ParcelSize>("small");
  const [insured, setInsured] = useState(false);
  const [declaredValue, setDeclaredValue] = useState("");

  // Base fee logic (paise)
  const sizeFee = { small: 10000, medium: 20000, large: 40000 };
  const baseFee = sizeFee[size] || 10000;
  const insuranceFee = insured && declaredValue ? Math.max(2000, parseInt(declaredValue) * 100) : 0;
  const totalFee = baseFee + insuranceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const lrNumber = generateLRNumber();

    const { data, error } = await supabase.from('lorry_receipts').insert({
      lr_number: lrNumber,
      sender_name: senderName,
      sender_phone: senderPhone,
      receiver_name: receiverName,
      receiver_phone: receiverPhone,
      destination_district: destination,
      parcel_description: description,
      parcel_size: size,
      total_fee: totalFee,
      declared_value: insured && declaredValue ? parseInt(declaredValue) * 100 : null,
      status: 'created',
    }).select().single();

    if (data) {
      // Create insurance record if insured
      if (insured && declaredValue) {
        await supabase.from('parcel_insurance').insert({
          lr_id: data.id,
          insured_value: parseInt(declaredValue) * 100,
          premium_amount: insuranceFee,
          status: 'active',
        });
      }

      // Create initial checkpoint
      await supabase.from('lr_checkpoints').insert({
        lr_id: data.id,
        checkpoint_type: 'origin',
        location_name: 'Mokokchung Main Counter',
        reported_by: 'counter',
      });

      router.push(`/logistics/track/${lrNumber}`);
    } else {
      alert(error?.message || 'Failed to create LR');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 font-sans">
      {/* Header */}
      <div className="bg-white px-5 pt-6 pb-4 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : router.back()}
            className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </button>
          <div>
            <h1 className="text-lg font-black text-neutral-900 leading-tight">Create Lorry Receipt</h1>
            <p className="text-xs text-neutral-500 font-medium">Step {step} of 2</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 flex gap-1">
          <div className="h-1 flex-1 bg-emerald-500 rounded-full" />
          <div className={`h-1 flex-1 rounded-full ${step > 1 ? 'bg-emerald-500' : 'bg-neutral-200'}`} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-5 py-6 flex flex-col">
        {step === 1 ? (
          <div className="space-y-6 flex-1">
            {/* Sender */}
            <div className="space-y-3">
              <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wide flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" /> Sender Details
              </h2>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 space-y-3">
                <input 
                  type="tel" 
                  placeholder="Sender Phone Number"
                  required
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full bg-neutral-50 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 border border-neutral-200"
                />
                <input 
                  type="text" 
                  placeholder="Sender Name"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full bg-neutral-50 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 border border-neutral-200"
                />
              </div>
            </div>

            {/* Receiver & Destination */}
            <div className="space-y-3">
              <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wide flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" /> Receiver Details
              </h2>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 space-y-3">
                <select 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-neutral-50 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 border border-neutral-200 appearance-none"
                >
                  <option value="Kohima">Kohima</option>
                  <option value="Dimapur">Dimapur</option>
                  <option value="Zunheboto">Zunheboto</option>
                  <option value="Wokha">Wokha</option>
                </select>
                <input 
                  type="tel" 
                  placeholder="Receiver Phone Number"
                  required
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  className="w-full bg-neutral-50 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 border border-neutral-200"
                />
                <input 
                  type="text" 
                  placeholder="Receiver Name"
                  required
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full bg-neutral-50 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 border border-neutral-200"
                />
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setStep(2)}
              disabled={!senderPhone || !senderName || !receiverPhone || !receiverName}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-sm font-black disabled:opacity-50 disabled:active:scale-100 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20"
            >
              Continue to Parcel Details
            </button>
          </div>
        ) : (
          <div className="space-y-6 flex-1 flex flex-col">
            {/* Parcel Description */}
            <div className="space-y-3">
              <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wide flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" /> Parcel Details
              </h2>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 space-y-4">
                <input 
                  type="text" 
                  placeholder="What's in the parcel? (e.g., Cloth, Documents)"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-neutral-50 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 border border-neutral-200"
                />
                
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Parcel Size</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["small", "medium", "large"] as ParcelSize[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`py-3 rounded-xl text-xs font-black capitalize border transition-all ${
                          size === s 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                            : 'bg-white border-neutral-200 text-neutral-500'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Insurance */}
            <div className="space-y-3">
              <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wide flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" /> Protection
              </h2>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-bold text-neutral-900">Transit Insurance</p>
                    <p className="text-xs text-neutral-500">Protect against loss/damage</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${insured ? 'bg-emerald-500' : 'bg-neutral-200'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={insured}
                      onChange={(e) => setInsured(e.target.checked)}
                    />
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${insured ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </label>

                {insured && (
                  <div className="animate-fade-in pt-2">
                    <input 
                      type="number" 
                      placeholder="Declared Value (₹)"
                      required={insured}
                      value={declaredValue}
                      onChange={(e) => setDeclaredValue(e.target.value)}
                      className="w-full bg-neutral-50 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 border border-neutral-200"
                    />
                    <p className="text-[10px] text-neutral-400 mt-1.5 ml-1">Premium: ~1% of declared value (Min ₹20)</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1" />

            {/* Fee Summary */}
            <div className="bg-emerald-900 rounded-3xl p-5 text-white shadow-xl">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5 mb-3">
                <Calculator className="w-4 h-4" /> Fee Summary
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-100">Base Freight ({size})</span>
                  <span className="font-bold">₹{baseFee / 100}</span>
                </div>
                {insured && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-100">Insurance Premium</span>
                    <span className="font-bold">₹{Math.round(insuranceFee / 100)}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-emerald-800/50 mb-6">
                <span className="text-sm font-bold text-emerald-100 uppercase">Total to Collect</span>
                <span className="text-2xl font-black">₹{Math.round(totalFee / 100)}</span>
              </div>

              <button 
                type="submit"
                disabled={loading || !description || (insured && !declaredValue)}
                className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-sm font-black disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'GENERATING...' : 'Generate LR'} {!loading && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
