"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, ShoppingCart, User, ChevronDown, Star, Sparkles, Clock, ArrowRight } from "lucide-react";
import { supabase } from "@bazar/shared/src/supabase";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import SearchOverlay from "@/components/SearchOverlay";

export default function Home() {
  const router = useRouter();
  const { cart, addItem, updateQuantity } = useCart();
  const [town, setTown] = useState("Mokokchung");
  const [categories, setCategories] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  useEffect(() => {
    async function fetchData() {
      const { data: cats } = await supabase.from('product_categories').select('*');
      if (cats) setCategories(cats);

      const { data: sellerData } = await supabase.from('seller_profiles').select('*').eq('is_approved', true).limit(10);
      if (sellerData && sellerData.length > 0) setSellers(sellerData);

      const { data: productData } = await supabase.from('products').select('*, seller:seller_profiles(store_name)').eq('is_active', true).limit(6);
      if (productData && productData.length > 0) setProducts(productData);
    }
    fetchData();
  }, []);

  const handleAddToCart = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const isDarkStore = !item.seller_id;
    addItem({
      id: item.id,
      name: item.name,
      quantity: 1,
      price: isDarkStore ? (item.selling_price || item.price) : item.price,
      type: isDarkStore ? 'dark_store' : 'seller',
      seller_id: item.seller_id || undefined,
      image: item.images?.[0] || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=200&auto=format&fit=crop',
      unit: item.unit || '1 unit',
    });
  };

  const getItemQty = (id: string) => {
    const item = cart.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <div className="flex flex-col pb-24 min-h-screen bg-slate-50 font-sans">
      {/* Header - Q-Commerce Style */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="text-rose-600">
              <MapPin className="w-6 h-6 fill-rose-100" />
            </div>
            <div>
              <p className="text-[11px] text-gray-800 font-extrabold flex items-center gap-1">
                Home <ChevronDown className="w-4 h-4 text-gray-500" />
              </p>
              <p className="text-xs font-medium text-gray-500 truncate max-w-[150px]">
                Dilong Ward, {town}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <button onClick={() => router.push('/login')} className="p-1">
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="relative" onClick={() => setSearchOpen(true)}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <div className="w-full pl-10 pr-4 py-3.5 bg-gray-100 rounded-xl text-sm font-medium text-gray-500 cursor-pointer shadow-inner">
            Search for &quot;pork&quot; or &quot;eggs&quot;
          </div>
        </div>
      </header>

      {/* Banners */}
      <div className="px-4 py-4">
        <div className="w-full bg-gradient-to-r from-orange-400 to-rose-500 rounded-2xl p-4 text-white relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
          <h2 className="text-xl font-black mb-1 relative z-10">Fresh & Local</h2>
          <p className="text-xs font-medium text-white/90 mb-3 relative z-10">Get the best of Nagaland delivered.</p>
          <button className="bg-white text-rose-600 text-[10px] font-extrabold px-4 py-2 rounded-lg shadow-sm relative z-10">
            ORDER NOW
          </button>
        </div>
      </div>

      {/* Dynamic Categories (Circular) */}
      <div className="px-4 pb-2">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {['Meat & Fish', 'Vegetables', 'Bakery', 'Groceries', 'Local Finds'].map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 cursor-pointer min-w-[72px]">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden">
                <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center">
                  <span className="text-2xl">
                    {idx === 0 ? '🥩' : idx === 1 ? '🥒' : idx === 2 ? '🥐' : idx === 3 ? '🧺' : '🥬'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-center leading-tight text-gray-700">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Teni Now Section (15 Min Delivery) */}
      <div className="mt-4 px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-black text-gray-900">Teni Now</h2>
            <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded ml-1">15 MINS</span>
          </div>
          <button className="text-rose-500 text-xs font-bold flex items-center">
            See all <ChevronDown className="w-4 h-4 ml-0.5 -rotate-90" />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {(products.length > 0 ? products.slice(0, 4) : [
            { id: '1', name: 'Amul Taaza Milk', unit: '1L Tetra Pack', price: 7200, images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=200&auto=format&fit=crop'] },
            { id: '2', name: 'Farm Fresh Eggs', unit: '12 pieces', price: 10000, images: ['https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=200&auto=format&fit=crop'] },
            { id: '3', name: 'Local Tomatoes', unit: '1 kg', price: 6000, images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200&auto=format&fit=crop'] }
          ]).map((item: any) => {
            const qty = getItemQty(item.id);
            return (
              <div key={item.id} onClick={() => router.push(`/product/${item.id}`)} className="min-w-[140px] bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col relative cursor-pointer">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 bg-gray-50">
                  <img 
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=200&auto=format&fit=crop'} 
                    alt={item.name}
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                  <div className="absolute bottom-0 left-0 bg-white/90 backdrop-blur text-[9px] font-bold text-gray-700 px-1.5 py-0.5 rounded-tr-lg">
                    {item.unit || '1 unit'}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight">
                    {item.name}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-sm text-gray-900">₹{item.price / 100}</span>
                  {qty > 0 ? (
                    <div onClick={(e) => e.stopPropagation()} className="flex items-center bg-rose-50 border border-rose-200 rounded-lg h-7">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-full flex items-center justify-center text-rose-600 font-bold">-</button>
                      <span className="w-5 text-center text-xs font-bold text-rose-600">{qty}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-full flex items-center justify-center text-rose-600 font-bold">+</button>
                    </div>
                  ) : (
                    <button 
                      onClick={(e) => handleAddToCart(item, e)}
                      className="px-4 h-7 bg-rose-50 text-rose-600 text-xs font-extrabold rounded-lg border border-rose-200 hover:bg-rose-100 transition-colors"
                    >
                      ADD
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Local Sellers Grid */}
      <div className="mt-2 px-4 py-6 bg-white space-y-4">
        <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Support Local
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {(sellers.length > 0 ? sellers : [1, 2, 3, 4].map(i => ({ user_id: i, store_name: `Store ${i}`, category: 'Groceries' }))).slice(0, 4).map((seller: any) => (
            <div key={seller.user_id} onClick={() => seller.store_slug && router.push(`/s/${seller.store_slug}`)} className="bg-gray-50 rounded-2xl p-3 flex items-center gap-3 cursor-pointer shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm overflow-hidden flex-shrink-0">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${seller.store_name}`} alt="Seller" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{seller.store_name}</p>
                <p className="text-[10px] font-medium text-gray-500 truncate">{seller.category || 'Local Shop'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav / Cart Popup */}
      {cartCount > 0 ? (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 p-4 pb-6 bg-gradient-to-t from-white via-white to-transparent">
          <div 
            onClick={() => router.push('/checkout')}
            className="w-full bg-rose-600 text-white rounded-xl p-4 flex items-center justify-between shadow-lg shadow-rose-600/20 cursor-pointer hover:bg-rose-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold">{cartCount} items</p>
                <p className="text-[10px] font-medium text-rose-100">Proceed to checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-2 font-bold text-sm">
              View Cart <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      ) : (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
          <button className="flex flex-col items-center gap-1 text-rose-600">
            <MapPin className="w-6 h-6" />
            <span className="text-[10px] font-extrabold">Teni</span>
          </button>
          <button onClick={() => router.push('/heritage')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
            <Sparkles className="w-6 h-6" />
            <span className="text-[10px] font-bold">Heritage</span>
          </button>
          <button onClick={() => router.push('/seller/dashboard')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold">Account</span>
          </button>
        </nav>
      )}

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
