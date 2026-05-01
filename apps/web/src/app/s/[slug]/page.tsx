"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@bazar/shared/src/supabase";
import { Product, SellerProfile } from "@bazar/shared/src/index";
import { MapPin, Star, MessageCircle, Share2, Award, Calendar, ArrowLeft } from "lucide-react";
import { formatPrice } from "@bazar/shared/src/supabase";

export default function SellerProfilePage() {
  const { slug } = useParams();
  const router = useRouter();
  const [seller, setSeller] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [punchCard, setPunchCard] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: sellerData } = await supabase
        .from('seller_profiles')
        .select('*, user:users(*)')
        .eq('store_slug', slug)
        .single();

      if (sellerData) {
        setSeller(sellerData);
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('seller_id', sellerData.user_id);
        if (productsData) setProducts(productsData);

        // Fetch Punch Card for current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: pcData } = await supabase
            .from('punch_cards')
            .select('*')
            .eq('seller_id', sellerData.user_id)
            .eq('buyer_id', user.id)
            .single();
          setPunchCard(pcData);
        }
      }
    }
    fetchData();
  }, [slug]);

  if (!seller) return <div className="min-h-screen bg-neutral-50 flex items-center justify-center font-black animate-pulse">Loading Seller...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 pb-20 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Seller Header */}
      <div className="bg-white p-6 pb-24 border-b rounded-b-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-emerald-500/20 to-teal-500/5 -z-10" />
        <div className="flex justify-between items-start mb-6 z-10 relative">
          <button onClick={() => router.back()} className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-md border border-neutral-100 active:scale-90 transition-transform">
             <ArrowLeft className="w-5 h-5 text-neutral-800" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-md border border-neutral-100 active:scale-90 transition-transform"><Share2 size={18} /></button>
            <button className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-md border border-emerald-200 active:scale-90 transition-transform"><MessageCircle size={18} /></button>
          </div>
        </div>
        
        <div className="flex flex-col items-center mt-4 space-y-3 z-10 relative">
          <div className="w-24 h-24 bg-neutral-200 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-tr from-emerald-100 to-emerald-200">
             <img src={`https://api.dicebear.com/7.x/faces/svg?seed=${seller.user_id}`} className="w-full h-full object-cover" alt="Seller" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-black text-neutral-900">{seller.store_name}</h1>
            <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 font-bold bg-neutral-100/80 w-max mx-auto px-3 py-1 rounded-full">
              <MapPin size={14} className="text-emerald-600" /> {seller.village_origin} • {seller.locality}
            </div>
            <div className="flex items-center justify-center gap-3 pt-3">
              <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-xl text-xs font-black shadow-sm">
                <Star size={14} fill="currentColor" /> {seller.rating || '5.0'}
              </div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest bg-neutral-50 px-3 py-1 rounded-xl">120 Reviews</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-8 space-y-6 relative z-10">
        {/* Punch Card */}
        <section className="bg-neutral-900 text-white p-6 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -z-10" />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Award className="text-yellow-400" />
              <h3 className="font-black text-sm uppercase">Loyalty Card</h3>
            </div>
            <span className="text-[10px] font-black bg-white/10 px-3 py-1.5 rounded-full text-white/90 border border-white/10 backdrop-blur-sm">
              9 ORDERS = 1 FREE GIFT
            </span>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className={`aspect-square rounded-full border-2 border-dashed flex items-center justify-center transition-all ${i < (punchCard?.count || 0) ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-transparent shadow-lg shadow-emerald-500/30 transform scale-105' : 'border-white/20'}`}>
                {i < (punchCard?.count || 0) ? <Star size={16} fill="white" className="text-white" /> : <span className="text-[10px] font-bold text-white/20">{i+1}</span>}
              </div>
            ))}
          </div>
          <p className="text-center text-[10px] font-bold text-emerald-400 uppercase tracking-widest pt-2">
            {(punchCard?.count || 0)} of 9 orders completed
          </p>
        </section>

        {/* Wednesday Market Banner */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-3xl flex justify-between items-center shadow-lg shadow-indigo-600/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-indigo-200" />
              <h3 className="font-black text-sm uppercase tracking-wide">Wednesday Market</h3>
            </div>
            <p className="text-xs text-indigo-100 font-medium">Pre-order for pickup at Town Square.</p>
          </div>
          <button className="bg-white text-indigo-600 px-4 py-2.5 rounded-xl text-xs font-black shadow-lg hover:scale-105 transition-transform active:scale-95">
            VIEW LIST
          </button>
        </section>

        {/* Seller Story */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 space-y-3">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">About the Seller</h3>
          <p className="text-sm text-neutral-700 leading-relaxed font-medium italic">
            "{seller.bio || 'Sharing the authentic flavors of my village with all of Mokokchung.'}"
          </p>
        </section>

        {/* Products */}
        <section className="space-y-4 pt-2">
          <h3 className="font-black text-xl text-neutral-800">Available Today</h3>
          <div className="grid grid-cols-2 gap-4">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/3] bg-neutral-100 relative overflow-hidden">
                  <img src={product.images?.[0] || "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=300&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} />
                  {product.village_origin && (
                    <div className="absolute top-2 left-2 bg-emerald-600/90 backdrop-blur text-white px-2.5 py-1 rounded-full text-[8px] font-black shadow-lg">
                      FROM {product.village_origin.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-1 bg-white">
                  <p className="text-sm font-black line-clamp-1 group-hover:text-emerald-700 transition-colors">{product.name}</p>
                  <p className="text-xs font-black text-emerald-600">{formatPrice(product.price)}</p>
                  <button onClick={() => router.push(`/product/${product.id}`)} className="w-full mt-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-xl border border-emerald-200 transition-colors active:scale-95">
                    VIEW DETAILS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

