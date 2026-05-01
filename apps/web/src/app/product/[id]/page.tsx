"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@bazar/shared/src/supabase";
import { ArrowLeft, ShoppingCart, Share2, Truck, Star, Info, ShieldCheck, MapPin, Check, Minus, Plus } from "lucide-react";
import { formatPrice } from "@bazar/shared/src/supabase";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { cart, addItem, updateQuantity } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [justAdded, setJustAdded] = useState(false);
  const { scrollY } = useScroll();

  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const imageScale = useTransform(scrollY, [0, 300], [1, 1.15]);
  const imageY = useTransform(scrollY, [0, 300], [0, 50]);

  const cartItem = cart.find(i => i.id === id);
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  useEffect(() => {
    async function fetchProduct() {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id as string);
      
      if (!isUUID) {
        setProduct({
          id: id,
          name: id === '1' ? 'Amul Taaza Milk' : 'Farm Fresh Eggs',
          description: id === '1' 
            ? 'Fresh toned milk in a convenient tetra pack. Perfect for your daily chai and cooking needs.'
            : 'Locally sourced farm fresh eggs. Packed with protein and nutrition.',
          price: id === '1' ? 7200 : 10000,
          selling_price: id === '1' ? 7200 : 10000,
          unit: id === '1' ? '1L Tetra Pack' : '12 pieces',
          images: [id === '1' 
            ? 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=600&auto=format&fit=crop'
            : 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=600&auto=format&fit=crop'],
          category: 'Groceries',
        });
        setLoading(false);
        return;
      }

      let { data, error } = await supabase
        .from('products')
        .select('*, seller:seller_profiles(*)')
        .eq('id', id)
        .single();

      if (!data) {
        const { data: skuData } = await supabase
          .from('skus')
          .select('*')
          .eq('id', id)
          .single();
        data = skuData;
      }

      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const isDarkStore = !product.seller_id;
    addItem({
      id: product.id,
      name: product.name,
      quantity: 1,
      price: isDarkStore ? product.selling_price : product.price,
      type: isDarkStore ? 'dark_store' : 'seller',
      seller_id: product.seller_id || undefined,
      image: product.images?.[0] || product.image_url || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=200&auto=format&fit=crop',
      unit: product.unit || '1 unit',
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  if (loading) return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-8 text-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full mb-4" />
      <span className="font-black text-neutral-400 tracking-widest uppercase text-sm">Loading</span>
    </div>
  );
  
  if (!product) return <div className="min-h-screen bg-neutral-50 flex items-center justify-center font-black">Product not found.</div>;

  const isDarkStore = !product.seller_id;
  const productImage = product.images?.[0] || product.image_url || (isDarkStore 
    ? "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=600&auto=format&fit=crop" 
    : "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&auto=format&fit=crop");

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 pb-32 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Dynamic Header */}
      <motion.header 
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-neutral-100 z-30 flex items-center justify-center"
      >
        <span className="font-black text-neutral-900 truncate max-w-[200px]">{product.name}</span>
      </motion.header>

      {/* Floating Action Header */}
      <header className="fixed top-0 w-full p-4 flex items-center justify-between z-40 pointer-events-none">
        <motion.button 
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => router.back()} 
            className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-neutral-200 pointer-events-auto"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-800" />
        </motion.button>
        <div className="flex gap-3 pointer-events-auto">
          <motion.button 
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-neutral-200"
          >
            <Share2 className="w-5 h-5 text-neutral-800" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/checkout')} 
            className="relative w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-neutral-200"
          >
            <ShoppingCart className="w-5 h-5 text-neutral-800" />
            <AnimatePresence>
                {cartCount > 0 && (
                <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                >
                    {cartCount}
                </motion.span>
                )}
            </AnimatePresence>
          </motion.button>
        </div>
      </header>

      {/* Parallax Image Gallery */}
      <div className="w-full aspect-square md:aspect-[16/9] lg:aspect-[21/9] bg-neutral-200 relative overflow-hidden flex-shrink-0">
        <motion.img 
          style={{ scale: imageScale, y: imageY }}
          src={productImage} 
          alt={product.name} 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        {!isDarkStore && product.village_origin && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            className="absolute bottom-10 left-6 bg-white/90 backdrop-blur-md text-emerald-700 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 border border-white"
          >
            <MapPin className="w-4 h-4" /> 
            <span className="text-xs font-black uppercase tracking-widest">FROM {product.village_origin}</span>
          </motion.div>
        )}
      </div>

      {/* Content Container */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="max-w-3xl mx-auto w-full px-5 py-8 space-y-8 relative -mt-8 bg-white rounded-t-[40px] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)] z-20"
      >
        {/* Title & Price Row */}
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-2 flex-1">
            <h1 className="text-3xl font-black leading-tight text-neutral-900 tracking-tight">{product.name}</h1>
            <p className="text-sm font-bold text-neutral-400 bg-neutral-100 inline-block px-3 py-1 rounded-lg">{product.unit || '1 unit'}</p>
          </div>
          <div className="text-right space-y-1 bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100">
            <p className="text-3xl font-black text-emerald-600">{formatPrice(isDarkStore ? product.selling_price : product.price)}</p>
            <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">Incl. all taxes</p>
          </div>
        </div>

        {/* Delivery Info */}
        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-5 bg-gradient-to-r from-emerald-50 to-teal-50/30 p-5 rounded-[24px] border border-emerald-100/50 shadow-sm">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-emerald-100">
            <Truck className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-base font-black text-neutral-800">{isDarkStore ? 'Delivering in 15 mins ⚡' : 'Delivery by Tomorrow 📅'}</p>
            <p className="text-sm font-medium text-neutral-500 mt-0.5 flex items-center gap-1">To <span className="font-bold text-emerald-700">Mokokchung Sector A</span></p>
          </div>
        </motion.div>

        {/* Seller Info (Marketplace only) */}
        {!isDarkStore && product.seller && (
          <motion.div whileHover={{ scale: 1.01 }} className="bg-neutral-900 text-white p-6 rounded-[32px] shadow-2xl shadow-neutral-900/20 space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-[40px] -z-10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[30px] -z-10 translate-y-1/2 -translate-x-1/2" />
            
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 p-0.5 rounded-[20px] shadow-lg">
                <div className="w-full h-full bg-neutral-800 rounded-[18px] overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/faces/svg?seed=${product.seller_id}`} alt="Seller" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <p className="text-lg font-black flex items-center gap-2">
                  {product.seller.store_name} <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <p className="text-xs font-bold text-neutral-300 flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 4.9 (124 reviews)
                  </p>
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Verified</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 p-5 rounded-[20px] border border-white/10 relative group">
               <Info className="w-5 h-5 text-emerald-400/50 absolute top-5 right-5 group-hover:text-emerald-400 transition-colors" />
              <p className="text-sm text-neutral-300 leading-relaxed italic pr-8 font-medium">
                "{product.story || 'Freshly made with traditional methods, bringing the taste of our village to your home.'}"
              </p>
            </div>
          </motion.div>
        )}

        <div className="space-y-4 pt-4">
          <h3 className="font-black text-sm uppercase tracking-widest text-neutral-400 flex items-center gap-2">
             Product Details
          </h3>
          <p className="text-base text-neutral-600 leading-relaxed font-medium">
            {product.description || 'No description available for this item. Guaranteed fresh and quality checked by BAZAR.'}
          </p>
        </div>
      </motion.div>

      {/* Fixed Footer Action */}
      <motion.div 
        initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
        className="fixed bottom-0 left-0 right-0 max-w-3xl mx-auto p-5 bg-white/90 backdrop-blur-xl border-t border-neutral-200/60 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] flex items-center gap-4 z-50 rounded-t-[32px]"
      >
        {cartItem ? (
          <>
            <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-[20px] h-16 w-40 border border-neutral-200 shadow-inner">
               <button 
                 onClick={() => updateQuantity(cartItem.id, -1)}
                 className="w-12 h-full flex items-center justify-center font-black text-xl text-neutral-600 hover:bg-white rounded-[14px] transition-colors shadow-sm"
               ><Minus className="w-5 h-5" /></button>
               <span className="font-black text-xl text-neutral-900 w-8 text-center">{cartItem.quantity}</span>
               <button 
                 onClick={() => updateQuantity(cartItem.id, 1)}
                 className="w-12 h-full flex items-center justify-center font-black text-xl text-emerald-600 hover:bg-white rounded-[14px] transition-colors shadow-sm"
               ><Plus className="w-5 h-5" /></button>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/checkout')}
              className="flex-1 btn-primary h-16 rounded-[20px] text-base shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 uppercase tracking-wide font-black"
            >
              <ShoppingCart className="w-5 h-5" /> Checkout · {formatPrice(cartItem.price * cartItem.quantity)}
            </motion.button>
          </>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className={cn(
              "w-full h-16 rounded-[20px] text-base shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 uppercase tracking-wide font-black transition-all duration-300",
              justAdded ? 'bg-neutral-900 text-emerald-400 scale-95 shadow-none' : 'btn-primary'
            )}
          >
            {justAdded ? (
              <><Check className="w-6 h-6" /> Added to Cart</>
            ) : (
              <><ShoppingCart className="w-6 h-6" /> Add to Cart · {formatPrice(isDarkStore ? product.selling_price : product.price)}</>
            )}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
