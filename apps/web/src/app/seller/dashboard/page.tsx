"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@bazar/shared/src/supabase";
import { SubOrder, Product } from "@bazar/shared/src/index";
import { ShoppingBag, TrendingUp, Package, Plus, MessageCircle, ArrowLeft, Clock, CheckCircle2, XCircle } from "lucide-react";
import { formatPrice } from "@bazar/shared/src/supabase";

export default function SellerDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<SubOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({ earnings: 0, totalOrders: 0 });
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Try auth user first, fallback to demo localStorage ID
      const { data: { user } } = await supabase.auth.getUser();
      let sellerId = user?.id;
      
      if (!sellerId && typeof window !== 'undefined') {
        sellerId = localStorage.getItem('bazar_demo_seller_id') || undefined;
      }

      if (!sellerId) {
        // Fallback: get any seller for demo
        const { data: anySeller } = await supabase.from('seller_profiles').select('*').limit(1).single();
        if (anySeller) {
          sellerId = anySeller.user_id || anySeller.id;
          setSellerProfile(anySeller);
        }
      } else {
        // Try user_id first, then id
        let { data: profile } = await supabase.from('seller_profiles').select('*').eq('user_id', sellerId).single();
        if (!profile) {
          const { data: p2 } = await supabase.from('seller_profiles').select('*').eq('id', sellerId).single();
          profile = p2;
        }
        if (profile) setSellerProfile(profile);
      }

      if (!sellerId) {
        setLoading(false);
        return;
      }

      const { data: ordersData } = await supabase
        .from('sub_orders')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerId);

      if (ordersData) {
        setOrders(ordersData);
        const totalEarnings = ordersData
          .filter(o => o.status === 'delivered')
          .reduce((acc, o: any) => acc + ((o.subtotal || o.amount || 0) - (o.commission_amount || 0)), 0);
        setStats({ earnings: totalEarnings, totalOrders: ordersData.length });
      }
      if (productsData) setProducts(productsData);
      setLoading(false);
    }

    fetchData();
  }, []);

  const handleAcceptOrder = async (orderId: string) => {
    await supabase.from('sub_orders').update({ status: 'accepted' }).eq('id', orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'accepted' } : o));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center space-y-3 animate-pulse">
          <Package className="w-10 h-10 text-emerald-500 mx-auto" />
          <p className="font-black text-neutral-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-28 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-600 text-white p-6 pb-24 relative overflow-hidden rounded-b-3xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-900/20 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/')} className="w-10 h-10 bg-white/15 backdrop-blur rounded-full flex items-center justify-center border border-white/10">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-black">SELLER PANEL</h1>
                {sellerProfile && (
                  <p className="text-emerald-100 text-xs font-bold mt-0.5">{sellerProfile.store_name}</p>
                )}
              </div>
            </div>
            <button className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm border border-white/10">
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider mb-1">EARNINGS</p>
              <p className="text-2xl font-black">{stats.earnings > 0 ? formatPrice(stats.earnings) : '₹0'}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider mb-1">TOTAL ORDERS</p>
              <p className="text-2xl font-black">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 -mt-12 space-y-6 relative z-10">
        {/* Approval Status */}
        {sellerProfile && !sellerProfile.is_approved && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black text-amber-900">Pending Admin Approval</p>
              <p className="text-xs font-medium text-amber-700 mt-0.5">Your store is live but orders will start flowing once approved.</p>
            </div>
          </div>
        )}

        {/* Active Orders */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-lg font-black text-neutral-800">Incoming Orders</h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">VIEW HISTORY</span>
          </div>
          <div className="space-y-3">
            {orders.filter(o => o.status === 'pending').map(order => (
              <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 space-y-3 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">ORDER #{order.id.slice(0,8)}</p>
                    <p className="text-sm font-black mt-0.5">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
                  </div>
                  <span className="text-sm font-black text-emerald-600">{formatPrice(order.subtotal || (order as any).amount || 0)}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAcceptOrder(order.id)}
                    className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-sm shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> ACCEPT
                  </button>
                  <button className="flex-1 bg-neutral-100 text-neutral-400 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> REJECT
                  </button>
                </div>
              </div>
            ))}
            {orders.filter(o => o.status === 'pending').length === 0 && (
              <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-neutral-200 text-center space-y-2">
                <ShoppingBag className="w-8 h-8 text-neutral-300 mx-auto" />
                <p className="text-neutral-400 font-bold">No new orders yet</p>
                <p className="text-xs text-neutral-300">Orders will appear here in real-time</p>
              </div>
            )}
          </div>
        </section>

        {/* Products */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-lg font-black text-neutral-800">My Products</h2>
            <button onClick={() => router.push('/seller/add-product')} className="flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-200 transition-colors active:scale-95">
              <Plus className="w-3 h-3" /> ADD NEW
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="aspect-square bg-neutral-100 overflow-hidden">
                  <img 
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=200&auto=format&fit=crop'} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-sm font-black truncate">{product.name}</p>
                  <p className="text-xs font-bold text-emerald-600">{formatPrice(product.price)}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.stock_quantity > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {product.stock_quantity > 0 ? `${product.stock_quantity} IN STOCK` : 'OUT OF STOCK'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="col-span-2 bg-white p-8 rounded-2xl border-2 border-dashed border-neutral-200 text-center space-y-3">
                <Package className="w-8 h-8 text-neutral-300 mx-auto" />
                <p className="text-neutral-400 font-bold">No products yet</p>
                <button 
                  onClick={() => router.push('/seller/add-product')} 
                  className="text-xs font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100"
                >
                  ADD YOUR FIRST PRODUCT
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Boost Button */}
      <div className="fixed bottom-6 left-5 right-5 max-w-md mx-auto">
        <button className="w-full bg-neutral-900 text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-neutral-900/20 active:scale-[0.98] transition-transform">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span className="font-black">BOOST MY SALES</span>
        </button>
      </div>
    </div>
  );
}
