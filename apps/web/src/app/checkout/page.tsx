"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { ArrowLeft, ShoppingCart, Info } from "lucide-react";
import { supabase } from "@bazar/shared/src/supabase";
import { useCart } from "@/context/CartContext";
import { InteractiveCheckout, PaymentMethod } from "@/components/ui/interactive-checkout";

export default function Checkout() {
  const router = useRouter();
  const { cart, clearCart, subtotal } = useCart();
  const [loading, setLoading] = useState(false);
  
  const deliveryFee = subtotal >= 20000 ? 0 : 2000;
  const total = subtotal + deliveryFee;

  const createSupabaseOrder = async (paymentMethod: PaymentMethod, paymentId?: string) => {
    // 1. Create Parent Order in Supabase
    const { data: parentOrder, error } = await supabase
      .from('parent_orders')
      .insert({
        buyer_id: (await supabase.auth.getUser()).data.user?.id || null,
        town_id: '11111111-1111-1111-1111-111111111111', // Mokokchung town ID
        total_amount: total,
        delivery_fee: deliveryFee,
        delivery_address: {
          name: "John Doe",
          phone: "+919876543210",
          line1: "Dilong Ward, House 42",
          locality: "Mokokchung",
          landmark: "Near Ao Baptist Church",
          lat: 26.3267,
          lng: 94.5244
        },
        metadata: { items: cart, paymentMethod, paymentId }
      })
      .select()
      .single();

    if (parentOrder) {
      // 2. Split orders by type
      const darkStoreItems = cart.filter(item => item.type === 'dark_store');
      if (darkStoreItems.length > 0) {
        await supabase.from('sub_orders').insert({
          parent_id: parentOrder.id,
          source: 'dark_store',
          amount: darkStoreItems.reduce((acc, item) => acc + (item.price * item.quantity), 0),
          status: 'pending',
          items: darkStoreItems
        });
      }

      const marketplaceItems = cart.filter(item => item.type === 'seller');
      // Group marketplace items by seller
      const sellerGroups: Record<string, typeof marketplaceItems> = {};
      for (const item of marketplaceItems) {
        const key = item.seller_id || 'unknown';
        if (!sellerGroups[key]) sellerGroups[key] = [];
        sellerGroups[key].push(item);
      }
      
      for (const [sellerId, items] of Object.entries(sellerGroups)) {
        await supabase.from('sub_orders').insert({
          parent_id: parentOrder.id,
          seller_id: sellerId !== 'unknown' ? sellerId : null,
          source: 'marketplace',
          amount: items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
          status: 'pending',
          items: items
        });
      }

      clearCart();
      router.push(`/order/tracking/${parentOrder.id}`);
    }
  };

  const handlePayment = async (paymentMethod: PaymentMethod) => {
    if (cart.length === 0) return;
    setLoading(true);

    if (paymentMethod === 'cod') {
      await createSupabaseOrder(paymentMethod);
      setLoading(false);
      return;
    }

    try {
      // Create Razorpay Order
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total, // amount in paise
          currency: 'INR',
          receipt: 'receipt_' + Date.now()
        })
      });

      const { orderId } = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key', // Uses dummy by default
        amount: total,
        currency: "INR",
        name: "BAZAR",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response: any) {
          // Payment Success
          await createSupabaseOrder(paymentMethod, response.razorpay_payment_id);
          setLoading(false);
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9876543210"
        },
        theme: {
          color: "#e11d48" // Rose 600
        }
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error(response.error);
        alert('Payment Failed! ' + response.error.description);
        setLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Error initiating payment');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <header className="fixed top-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/80 backdrop-blur-md flex items-center z-20 shadow-sm border-b border-gray-100">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <h1 className="text-lg font-black text-gray-900 ml-2">Checkout</h1>
        </header>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 mt-16 w-full">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="w-12 h-12 text-gray-300" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-gray-900">Your cart is empty</h2>
            <p className="text-sm text-gray-500 font-medium">Looks like you haven't added anything yet.</p>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="bg-rose-600 text-white font-black text-sm px-8 py-3.5 rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 shadow-sm flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1 -ml-1 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
        <div>
          <h1 className="text-lg font-black text-gray-900 leading-tight">Checkout</h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase">{cart.length} ITEMS</p>
        </div>
      </header>

      <div className="pt-3 pb-32">
        <div className="px-4 mb-3">
          <div className="bg-emerald-50 text-emerald-700 rounded-xl p-3 flex items-start gap-2 border border-emerald-100">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" />
            <p className="text-xs font-medium leading-relaxed">
              Ordering from <span className="font-bold text-emerald-800">BAZAR Now</span> and <span className="font-bold text-emerald-800">Local Sellers</span>. Items may arrive in separate deliveries.
            </p>
          </div>
        </div>

        <InteractiveCheckout onCheckout={handlePayment} loading={loading} />
      </div>
    </div>
  );
}
