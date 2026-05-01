"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Shield,
  MapPin,
  Award,
  ChevronRight,
  Star,
  ShoppingBag,
  Sparkles,
  Search,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@bazar/shared/src/supabase";

// Mock data — will be replaced by Supabase queries
const FEATURED_ARTISANS = [
  {
    id: "1",
    name: "Imna Longchar",
    tribe: "Ao Naga",
    village: "Ungma",
    craft: "Traditional Weaving",
    portrait: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    products: 12,
    rating: 4.9,
    verified: true,
  },
  {
    id: "2",
    name: "Ato Sema",
    tribe: "Sema Naga",
    village: "Zunheboto",
    craft: "Smoked Meats",
    portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    products: 8,
    rating: 4.8,
    verified: true,
  },
  {
    id: "3",
    name: "Temsüla Ao",
    tribe: "Ao Naga",
    village: "Mokokchung Town",
    craft: "King Chili Products",
    portrait: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    products: 6,
    rating: 5.0,
    verified: true,
  },
];

const HERITAGE_PRODUCTS = [
  {
    id: "1",
    name: "Ao Naga Warrior Shawl",
    artisan: "Imna Longchar",
    price: 499900,
    compareAt: 699900,
    category: "Heritage Textiles",
    giTag: "Chakhesang Shawls",
    giStatus: "registered",
    image: "https://images.unsplash.com/photo-1583743089695-4b816a340f82?q=80&w=400&auto=format&fit=crop",
    village: "Ungma",
    rating: 4.9,
    reviews: 23,
  },
  {
    id: "2",
    name: "Naga King Chili Hot Sauce",
    artisan: "Temsüla Ao",
    price: 49900,
    compareAt: 69900,
    category: "King Chili Products",
    giTag: "Naga Mircha",
    giStatus: "registered",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=400&auto=format&fit=crop",
    village: "Mokokchung Town",
    rating: 5.0,
    reviews: 47,
  },
  {
    id: "3",
    name: "Smoked Pork — Traditional Hearth-Dried",
    artisan: "Ato Sema",
    price: 79900,
    compareAt: null,
    category: "Smoked & Cured Meats",
    giTag: null,
    giStatus: "bazar_verified",
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=400&auto=format&fit=crop",
    village: "Zunheboto",
    rating: 4.8,
    reviews: 31,
  },
  {
    id: "4",
    name: "Bamboo Shoot Pickle — Fermented",
    artisan: "Temsüla Ao",
    price: 29900,
    compareAt: 39900,
    category: "Preserves & Pickles",
    giTag: null,
    giStatus: "bazar_verified",
    image: "https://images.unsplash.com/photo-1607530542923-dc0a58811db0?q=80&w=400&auto=format&fit=crop",
    village: "Mokokchung Town",
    rating: 4.7,
    reviews: 18,
  },
  {
    id: "5",
    name: "Naga Tree Tomato Chutney",
    artisan: "Imna Longchar",
    price: 34900,
    compareAt: null,
    category: "Preserves & Pickles",
    giTag: "Naga Tree Tomato",
    giStatus: "registered",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=400&auto=format&fit=crop",
    village: "Ungma",
    rating: 4.6,
    reviews: 12,
  },
  {
    id: "6",
    name: "Hand-Carved Mithun Horn Bowl",
    artisan: "Ato Sema",
    price: 249900,
    compareAt: 349900,
    category: "Bamboo & Woodcraft",
    giTag: null,
    giStatus: "bazar_verified",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=400&auto=format&fit=crop",
    village: "Zunheboto",
    rating: 4.9,
    reviews: 7,
  },
];

const HERITAGE_COLLECTION = {
  id: "naga-heritage-box",
  name: "The Naga Heritage Box",
  description: "A curated collection of Nagaland's finest — GI-tagged King Chili sauce, hand-woven textile, traditional smoked pork, and bamboo shoot pickle. Each item comes with the artisan's story.",
  price: 299900,
  compareAt: 459900,
  items: 4,
  image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=600&auto=format&fit=crop",
};

const CATEGORIES = [
  { name: "Heritage Textiles", emoji: "🧣", count: 24 },
  { name: "Smoked Meats", emoji: "🥩", count: 12 },
  { name: "King Chili", emoji: "🌶️", count: 8 },
  { name: "Preserves", emoji: "🫙", count: 15 },
  { name: "Woodcraft", emoji: "🪵", count: 10 },
  { name: "Gift Boxes", emoji: "🎁", count: 5 },
];

function formatPrice(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(paise / 100);
}

function GIBadge({ status, name }: { status: string; name?: string | null }) {
  if (status === "registered") {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded-full">
        <Award className="w-3 h-3 text-amber-600" />
        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
          GI Certified
        </span>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-heritage-50 border border-heritage-200 rounded-full">
      <Shield className="w-3 h-3 text-heritage-600" />
      <span className="text-[10px] font-bold text-heritage-800 uppercase tracking-wider">
        TENI Verified
      </span>
    </div>
  );
}

export default function HeritagePage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [featuredArtisans, setFeaturedArtisans] = useState<any[]>(FEATURED_ARTISANS);
  const [heritageProducts, setHeritageProducts] = useState<any[]>(HERITAGE_PRODUCTS);

  useEffect(() => {
    async function fetchData() {
      // Fetch artisans
      const { data: artisans } = await supabase
        .from('artisan_profiles')
        .select('*')
        .eq('is_bazar_verified', true)
        .limit(10);
        
      if (artisans && artisans.length > 0) {
        setFeaturedArtisans(artisans.map(a => ({
          id: a.id,
          name: a.artisan_name,
          tribe: a.tribe,
          village: a.village,
          craft: a.craft_type,
          portrait: a.portrait_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
          products: a.total_products_sold,
          rating: a.avg_rating,
          verified: a.is_bazar_verified,
        })));
      }

      // Fetch products
      const { data: products } = await supabase
        .from('heritage_products')
        .select('*, artisan_profiles(artisan_name)')
        .eq('status', 'active')
        .limit(20);

      if (products && products.length > 0) {
        setHeritageProducts(products.map(p => ({
          id: p.id,
          name: p.name,
          artisan: p.artisan_profiles?.artisan_name || "Unknown Artisan",
          price: p.selling_price,
          compareAt: p.compare_at_price,
          category: p.category,
          giTag: p.gi_tag_name,
          giStatus: p.gi_tag_status,
          image: p.images?.[0] || "https://images.unsplash.com/photo-1583743089695-4b816a340f82?q=80&w=400&auto=format&fit=crop",
          village: p.origin_village || "Nagaland",
          rating: 4.9,
          reviews: 0,
        })));
      }
    }
    fetchData();
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const filteredProducts =
    activeCategory === "All"
      ? heritageProducts
      : heritageProducts.filter((p) =>
          p.category.toLowerCase().includes(activeCategory.toLowerCase())
        );

  return (
    <div className="flex flex-col min-h-screen bg-heritage-50">
      {/* ===== HERO SECTION ===== */}
      <div className="relative h-[340px] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-heritage-950 via-heritage-900 to-heritage-800" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1583743089695-4b816a340f82?q=80&w=800&auto=format&fit=crop")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-heritage-950/90 via-heritage-950/40 to-transparent" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-5">
          <button
            onClick={() => router.push("/")}
            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
              <Search className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
              <ShoppingBag className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-6 pt-10 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-400/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs font-bold text-amber-200 uppercase tracking-widest">
              Heritage Gallery
            </span>
          </div>
          <h1 className="text-3xl font-black text-white leading-tight">
            Nagaland&apos;s Finest,
            <br />
            <span className="text-amber-300">Delivered to You</span>
          </h1>
          <p className="text-sm text-heritage-300 mt-3 leading-relaxed max-w-[280px]">
            GI-certified crafts, heritage foods, and artisan stories from the hills of Northeast India.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-around px-6 py-4 bg-heritage-950/60 backdrop-blur-md border-t border-white/5">
          <div className="text-center">
            <p className="text-lg font-black text-white">4</p>
            <p className="text-[10px] text-heritage-400 uppercase tracking-wider font-medium">
              GI Tags
            </p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-lg font-black text-white">30+</p>
            <p className="text-[10px] text-heritage-400 uppercase tracking-wider font-medium">
              Artisans
            </p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-lg font-black text-white">12</p>
            <p className="text-[10px] text-heritage-400 uppercase tracking-wider font-medium">
              Villages
            </p>
          </div>
        </div>
      </div>

      {/* ===== FEATURED COLLECTION ===== */}
      <div className="px-5 py-6 animate-slide-up">
        <button
          className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-heritage-900 via-heritage-800 to-heritage-950 p-5 text-left group"
          onClick={() => router.push("/heritage/collections")}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-lg">🎁</span>
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
              Featured Collection
            </span>
          </div>
          <h3 className="text-xl font-black text-white mb-1">
            {HERITAGE_COLLECTION.name}
          </h3>
          <p className="text-xs text-heritage-400 leading-relaxed mb-4 max-w-[250px]">
            {HERITAGE_COLLECTION.description}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-white">
              {formatPrice(HERITAGE_COLLECTION.price)}
            </span>
            {HERITAGE_COLLECTION.compareAt && (
              <span className="text-sm text-heritage-500 line-through">
                {formatPrice(HERITAGE_COLLECTION.compareAt)}
              </span>
            )}
          </div>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-heritage-950 rounded-xl text-xs font-black uppercase tracking-wider group-hover:bg-amber-400 transition-colors">
            Shop Collection
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* ===== MEET THE ARTISANS ===== */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-heritage-900">
            Meet the Artisans
          </h2>
          <button className="text-xs text-heritage-600 font-bold flex items-center gap-1 bg-heritage-100 px-3 py-1.5 rounded-full hover:bg-heritage-200 transition-colors">
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-5 px-5">
          {featuredArtisans.map((artisan) => (
            <button
              key={artisan.id}
              onClick={() => router.push(`/heritage/artisan/${artisan.id}`)}
              className="flex-shrink-0 w-[160px] bg-white rounded-2xl p-4 border border-heritage-100 hover:shadow-lg hover:shadow-heritage-200/50 transition-all duration-300 group text-left"
            >
              <div className="relative w-16 h-16 mx-auto mb-3">
                <div className="w-full h-full rounded-full overflow-hidden ring-2 ring-heritage-200 ring-offset-2">
                  <img
                    src={artisan.portrait}
                    alt={artisan.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {artisan.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <h4 className="text-sm font-bold text-heritage-900 text-center truncate">
                {artisan.name}
              </h4>
              <p className="text-[10px] text-heritage-500 text-center font-medium mt-0.5">
                {artisan.tribe} · {artisan.village}
              </p>
              <p className="text-[10px] text-heritage-400 text-center mt-1">
                {artisan.craft}
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-[11px] font-bold text-heritage-700">
                  {artisan.rating}
                </span>
                <span className="text-[10px] text-heritage-400">
                  · {artisan.products} items
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ===== CATEGORIES ===== */}
      <div className="px-5 py-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-3">
          <button
            onClick={() => setActiveCategory("All")}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeCategory === "All"
                ? "bg-heritage-900 text-white shadow-lg shadow-heritage-900/20"
                : "bg-white text-heritage-600 border border-heritage-200 hover:bg-heritage-100"
            }`}
          >
            All Products
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCategory === cat.name
                  ? "bg-heritage-900 text-white shadow-lg shadow-heritage-900/20"
                  : "bg-white text-heritage-600 border border-heritage-200 hover:bg-heritage-100"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ===== PRODUCT GRID ===== */}
      <div className="px-5 py-4 space-y-4 pb-28">
        <h2 className="text-lg font-black text-heritage-900">
          {activeCategory === "All" ? "All Heritage Products" : activeCategory}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => router.push(`/heritage/${product.id}`)}
              className="bg-white rounded-2xl overflow-hidden border border-heritage-100 hover:shadow-xl hover:shadow-heritage-200/50 transition-all duration-300 group text-left"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Wishlist */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      wishlist.includes(product.id)
                        ? "text-red-500 fill-red-500"
                        : "text-heritage-400"
                    }`}
                  />
                </button>
                {/* GI Badge */}
                <div className="absolute bottom-2 left-2">
                  <GIBadge status={product.giStatus} name={product.giTag} />
                </div>
              </div>
              <div className="p-3 space-y-1.5">
                <p className="text-[11px] text-heritage-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {product.village}
                </p>
                <h3 className="text-sm font-bold text-heritage-900 leading-tight line-clamp-2 group-hover:text-heritage-700 transition-colors">
                  {product.name}
                </h3>
                <p className="text-[10px] text-heritage-400">
                  by {product.artisan}
                </p>
                <div className="flex items-center gap-1 pt-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[11px] font-bold text-heritage-700">
                    {product.rating}
                  </span>
                  <span className="text-[10px] text-heritage-400">
                    ({product.reviews})
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-base font-black text-heritage-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAt && (
                    <span className="text-xs text-heritage-400 line-through">
                      {formatPrice(product.compareAt)}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ===== BOTTOM TRUST BAR ===== */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-heritage-900/95 backdrop-blur-lg text-white px-5 py-4 flex items-center justify-between border-t border-heritage-700/30 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-bold text-heritage-200">
              TENI Verified
            </span>
          </div>
          <div className="w-px h-4 bg-heritage-700" />
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-bold text-heritage-200">
              GI Protected
            </span>
          </div>
        </div>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-amber-500 text-heritage-950 rounded-xl text-xs font-black hover:bg-amber-400 transition-colors"
        >
          Daily Pulse →
        </button>
      </div>
    </div>
  );
}
