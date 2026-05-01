"use client";

import { useState } from "react";
import { Check, ArrowRight, Store, MapPin, Phone, CheckCircle2, Sparkles } from "lucide-react";
import { supabase } from "@bazar/shared/src/supabase";
import { useRouter } from "next/navigation";

export default function SellerOnboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    store_name: "",
    bio: "",
    village_origin: "",
    locality: "",
    whatsapp_number: "",
    upi_id: "",
    category: "",
  });

  const handleNext = () => setStep(step + 1);

  const handleSubmit = async () => {
    setLoading(true);
    
    // Get authenticated user if available
    const { data: { user } } = await supabase.auth.getUser();
    
    // Generate a deterministic demo user ID if not logged in
    const userId = user?.id || crypto.randomUUID();
    const storeSlug = formData.store_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Ensure user exists in the users table
    if (!user) {
      await supabase.from('users').upsert({
        id: userId,
        phone: formData.whatsapp_number || '+910000000000',
        full_name: formData.store_name + ' Owner',
        roles: ['buyer', 'seller'],
      }, { onConflict: 'id' });
    }

    const { error } = await supabase
      .from('seller_profiles')
      .insert({
        user_id: userId,
        store_name: formData.store_name,
        store_slug: storeSlug,
        bio: formData.bio || `Bringing the authentic taste of ${formData.village_origin} to Mokokchung.`,
        village_origin: formData.village_origin,
        locality: formData.locality || 'Mokokchung Town',
        whatsapp_number: formData.whatsapp_number,
        upi_id: formData.upi_id,
        category: formData.category,
        is_approved: false,
        plan: 'starter',
        rating: 5.0,
      });

    if (!error) {
      // Update user roles if authenticated
      if (user) {
        await supabase.from('users').update({
          roles: ['buyer', 'seller']
        }).eq('id', user.id);
      }
      
      // Store the seller ID for dashboard access
      if (typeof window !== 'undefined') {
        localStorage.setItem('bazar_demo_seller_id', userId);
        localStorage.setItem('bazar_demo_store_slug', storeSlug);
      }
      
      setStep(5);
    } else {
      console.error('Onboarding error:', error);
      // If duplicate key, still go to success (re-onboarding same demo user)
      if (error.code === '23505') {
        setStep(5);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <div className="max-w-md mx-auto space-y-8">
        {/* Progress Bar */}
        {step < 5 && (
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-emerald-600 shadow-sm shadow-emerald-600/20' : 'bg-neutral-100'}`} 
              />
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 mb-2">
                <Sparkles className="w-3 h-3" /> Welcome to TENI
              </div>
              <h1 className="text-3xl font-black leading-tight">Tell us about<br/>your store</h1>
              <p className="text-neutral-500 font-medium">Every seller in Mokokchung has a story.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Store Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mary's Smoked Pork" 
                  className="input-field"
                  value={formData.store_name}
                  onChange={(e) => setFormData({...formData, store_name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Village/Town Origin</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ungma Village" 
                  className="input-field"
                  value={formData.village_origin}
                  onChange={(e) => setFormData({...formData, village_origin: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Locality in Mokokchung</label>
                <input 
                  type="text" 
                  placeholder="e.g. Arkong Ward" 
                  className="input-field"
                  value={formData.locality}
                  onChange={(e) => setFormData({...formData, locality: e.target.value})}
                />
              </div>
            </div>
            <button 
              onClick={handleNext} 
              disabled={!formData.store_name || !formData.village_origin}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-50"
            >
              CONTINUE <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-3xl font-black">What do you sell?</h1>
              <p className="text-neutral-500 font-medium">Help buyers find your products.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Smoked Meat', emoji: '🥩' },
                { name: 'Pickles', emoji: '🫙' },
                { name: 'Weaving', emoji: '🧣' },
                { name: 'Bakery', emoji: '🥐' },
                { name: 'Fresh Food', emoji: '🥬' },
                { name: 'Bamboo Craft', emoji: '🎋' },
              ].map((cat) => (
                <button 
                  key={cat.name}
                  onClick={() => setFormData({...formData, category: cat.name})}
                  className={`p-4 border-2 rounded-2xl text-left font-bold transition-all duration-200 ${formData.category === cat.name ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100' : 'border-neutral-100 hover:border-neutral-200'}`}
                >
                  <span className="text-2xl block mb-1">{cat.emoji}</span>
                  <span className="text-sm">{cat.name}</span>
                </button>
              ))}
            </div>
            <button 
              onClick={handleNext} 
              disabled={!formData.category}
              className="btn-primary w-full py-4 disabled:opacity-50"
            >
              CONTINUE
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-3xl font-black">Getting Paid</h1>
              <p className="text-neutral-500 font-medium">How should we send your earnings?</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider">WhatsApp Number</label>
                <input 
                  type="tel" 
                  placeholder="+91" 
                  className="input-field"
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({...formData, whatsapp_number: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider">UPI ID</label>
                <input 
                  type="text" 
                  placeholder="username@okaxis" 
                  className="input-field"
                  value={formData.upi_id}
                  onChange={(e) => setFormData({...formData, upi_id: e.target.value})}
                />
              </div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <p className="text-xs font-bold text-emerald-800 leading-relaxed">
                💡 <span className="font-black">Fintech Layer:</span> Every sale builds your TENI Credit Score — enabling micro-loans and insurance in the future.
              </p>
            </div>
            <button onClick={handleNext} className="btn-primary w-full py-4">
              CONTINUE
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-3xl space-y-4 border border-emerald-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/20 relative z-10">
                <Store className="w-10 h-10 text-white" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-black text-neutral-900">{formData.store_name}</h2>
                <p className="text-emerald-700 font-bold flex items-center justify-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> From {formData.village_origin}
                </p>
              </div>
              <div className="pt-4 flex justify-center gap-4 relative z-10">
                <div className="flex items-center gap-1 text-xs font-bold bg-white px-3 py-1.5 rounded-full shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {formData.category}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold bg-white px-3 py-1.5 rounded-full shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> UPI Ready
                </div>
              </div>
            </div>
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="btn-primary w-full py-4 text-lg"
            >
              {loading ? "OPENING STORE..." : "🚀 OPEN MY STORE"}
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8 text-center pt-12 animate-fade-in">
            <div className="w-24 h-24 bg-emerald-100 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-100/50">
              <Check className="w-12 h-12 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black">You're Online! 🎉</h1>
              <p className="text-neutral-500 font-medium">Your store is pending admin approval.</p>
            </div>
            <div className="bg-neutral-100 p-4 rounded-xl font-mono text-sm break-all border border-neutral-200">
              teni.in/s/{formData.store_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/seller/dashboard')}
                className="btn-primary w-full py-4"
              >
                GO TO DASHBOARD
              </button>
              <button 
                onClick={() => router.push('/')}
                className="w-full py-3 bg-neutral-100 text-neutral-600 rounded-2xl font-bold text-sm hover:bg-neutral-200 transition-colors"
              >
                Back to Marketplace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
