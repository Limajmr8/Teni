"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@bazar/shared/src/supabase";
import { SubOrder, OrderStatus } from "@bazar/shared/src/index";
import { ArrowLeft, MapPin, Truck, CheckCircle2, Clock, Phone, Navigation } from "lucide-react";

export default function OrderTracking() {
  const { id } = useParams();
  const router = useRouter();
  const [subOrders, setSubOrders] = useState<SubOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data } = await supabase
        .from('sub_orders')
        .select('*, runner:runner_profiles(*)')
        .eq('parent_id', id);
      
      if (data) setSubOrders(data);
      setLoading(false);
    }

    fetchOrders();

    // Real-time tracking
    const channel = supabase
      .channel(`tracking_${id}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'sub_orders',
        filter: `parent_id=eq.${id}`
      }, (payload) => {
        setSubOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  if (loading) return <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8 text-center font-black animate-pulse">Finding your orders...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 pb-20 font-sans selection:bg-emerald-500 selection:text-white">
      <header className="p-5 bg-white/80 backdrop-blur-md border-b border-neutral-100 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
        <button onClick={() => router.push('/')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 active:scale-90 transition-all">
          <ArrowLeft className="w-5 h-5 text-neutral-800" />
        </button>
        <h1 className="text-xl font-black text-neutral-900">Track Order</h1>
      </header>

      {/* Map Placeholder */}
      <div className="w-full h-72 bg-neutral-200 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Map" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
           <div className="relative">
             <div className="w-12 h-12 bg-emerald-500/30 rounded-full animate-ping absolute -inset-2" />
             <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg relative z-10">
               <Navigation className="w-4 h-4 text-white fill-white transform rotate-45" />
             </div>
           </div>
        </div>
      </div>

      <div className="p-5 space-y-6 relative -mt-6 z-10">
        {subOrders.map((order, idx) => (
          <section key={order.id} className="bg-white p-6 rounded-3xl shadow-lg shadow-neutral-200/50 border border-neutral-100 space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                  Package {idx + 1} <span className="w-1 h-1 bg-neutral-300 rounded-full" /> {order.source === 'dark_store' ? 'BAZAR Now' : 'Marketplace'}
                </p>
                <h3 className="text-xl font-black text-neutral-900">
                  {order.source === 'dark_store' ? 'Groceries' : 'Local Items'}
                </h3>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>

            <hr className="border-neutral-100 border-dashed" />

            {/* Timeline */}
            <div className="space-y-0 pl-2">
              <div className="flex gap-4 relative">
                <div className="flex flex-col items-center z-10 relative">
                  <div className={`w-4 h-4 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${['pending', 'accepted', 'picking', 'packed', 'out_for_delivery', 'delivered'].includes(order.status) ? 'bg-emerald-500' : 'bg-neutral-200'}`} />
                  <div className="w-0.5 h-10 bg-neutral-100" />
                </div>
                <div className="flex-1 pb-6 -mt-1">
                  <p className="text-sm font-black text-neutral-900">Order Placed</p>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">We've received your order</p>
                </div>
              </div>
              <div className="flex gap-4 relative">
                <div className="flex flex-col items-center z-10 relative">
                  <div className={`w-4 h-4 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${['out_for_delivery', 'delivered'].includes(order.status) ? 'bg-emerald-500' : 'bg-neutral-200'}`} />
                  <div className="w-0.5 h-10 bg-neutral-100" />
                </div>
                <div className="flex-1 pb-6 -mt-1">
                  <p className="text-sm font-black text-neutral-900">Out for Delivery</p>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">Runner is on the way</p>
                </div>
              </div>
              <div className="flex gap-4 relative">
                <div className="flex flex-col items-center z-10 relative">
                  <div className={`w-4 h-4 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${order.status === 'delivered' ? 'bg-emerald-500' : 'bg-neutral-200'}`} />
                </div>
                <div className="flex-1 -mt-1">
                  <p className="text-sm font-black text-neutral-900">Delivered</p>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">Enjoy your items!</p>
                </div>
              </div>
            </div>

            {/* Runner Card */}
            {order.status === 'out_for_delivery' && (
              <div className="bg-neutral-900 text-white p-5 rounded-2xl shadow-xl flex items-center justify-between relative overflow-hidden mt-4">
                <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-neutral-800 rounded-full overflow-hidden border-2 border-neutral-700">
                     <img src="https://api.dicebear.com/7.x/faces/svg?seed=runner" alt="Runner" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Your Runner</p>
                    <p className="text-base font-black">Bendang Ao</p>
                  </div>
                </div>
                <button className="w-10 h-10 bg-white text-emerald-600 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform relative z-10">
                  <Phone className="w-5 h-5" />
                </button>
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="p-6 text-center">
        <p className="text-xs text-neutral-500 font-bold bg-white px-4 py-2 rounded-full shadow-sm inline-block border border-neutral-100">
          Having trouble? <span className="text-emerald-600 font-black cursor-pointer hover:underline">Chat with Support</span>
        </p>
      </div>
    </div>
  );
}

