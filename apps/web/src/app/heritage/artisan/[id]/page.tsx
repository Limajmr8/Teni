"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Shield,
  MapPin,
  Award,
  Star,
  ChevronRight,
  ExternalLink,
  Phone,
  Heart,
  Share2,
  CheckCircle,
  Package,
  Calendar,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@bazar/shared/src/supabase";

function formatPrice(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(paise / 100);
}

export default function ArtisanProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [showFullStory, setShowFullStory] = useState(false);
  const [artisan, setArtisan] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArtisan() {
      const { data } = await supabase
        .from('artisan_profiles')
        .select('*')
        .eq('id', params.id)
        .single();

      if (data) {
        setArtisan(data);
        // Fetch their products
        const { data: prods } = await supabase
          .from('heritage_products')
          .select('*')
          .eq('artisan_id', data.id)
          .eq('status', 'active');
        if (prods) setProducts(prods);
      } else {
        // Fallback to mock for demo
        setArtisan({
          artisan_name: "Imna Longchar",
          tribe: "Ao Naga",
          village: "Ungma",
          district: "Mokokchung",
          craft_type: "Traditional Weaving",
          craft_specialization: "Warrior Shawls & Ceremonial Textiles",
          bio: "Third-generation weaver from Ungma village, one of the oldest Ao Naga villages in Mokokchung district.",
          story: "Imna learned the art of loin-loom weaving from her grandmother at age 12. In the Ao Naga tradition, each pattern on a shawl tells a story — of the wearer's clan, their achievements in the community, and their connection to the land.\n\nThe warrior shawl, or Tsüngkotepsu, was traditionally earned by men who proved their valor. Today, Imna adapts these sacred patterns into contemporary wearable art, ensuring each piece maintains the symbolic integrity of the original designs.\n\nHer workshop in Ungma uses only locally sourced Mithun wool and natural dyes derived from tree bark, indigo plants, and turmeric. Each shawl takes 15-25 days to complete on the traditional loin loom.",
          portrait_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
          workshop_photos: [
            "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=400&auto=format&fit=crop",
          ],
          workshop_lat: 26.3267,
          workshop_lng: 94.5244,
          is_bazar_verified: true,
          verified_at: "2026-03-15",
          pm_vishwakarma_status: "toolkit_received",
          total_products_sold: 156,
          avg_rating: 4.9,
          repeat_buyer_rate: 34,
          months_active: 8,
        });
        setProducts([
          { id: "1", name: "Ao Naga Warrior Shawl", selling_price: 499900, images: ["https://images.unsplash.com/photo-1583743089695-4b816a340f82?q=80&w=300&auto=format&fit=crop"], gi_tag_status: "registered" },
          { id: "5", name: "Naga Tree Tomato Chutney", selling_price: 34900, images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=300&auto=format&fit=crop"], gi_tag_status: "registered" },
          { id: "7", name: "Ceremonial Shoulder Cloth", selling_price: 349900, images: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=300&auto=format&fit=crop"], gi_tag_status: "bazar_verified" },
        ]);
      }
      setLoading(false);
    }
    fetchArtisan();
  }, [params.id]);

  if (loading) return <div className="min-h-screen bg-heritage-50 flex items-center justify-center font-black animate-pulse">Loading artisan...</div>;
  if (!artisan) return <div className="min-h-screen bg-heritage-50 flex items-center justify-center font-black">Artisan not found.</div>;

  const workshopPhotos = artisan.workshop_photos || [
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=400&auto=format&fit=crop",
  ];
  const portrait = artisan.portrait_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop";
  const storyText = artisan.story || artisan.bio || "A talented artisan from the hills of Nagaland.";

  return (
    <div className="flex flex-col min-h-screen bg-heritage-50 pb-24">
      {/* ===== HERO ===== */}
      <div className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-heritage-950 to-heritage-800" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("${workshopPhotos[0]}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-heritage-950 via-heritage-950/60 to-transparent" />

        {/* Nav */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-5">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
              <Share2 className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
              <Heart className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Profile */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-6">
          <div className="flex items-end gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden ring-3 ring-amber-400/50 ring-offset-2 ring-offset-heritage-950 shadow-xl">
                <img
                  src={portrait}
                  alt={artisan.artisan_name}
                  className="w-full h-full object-cover"
                />
              </div>
              {artisan.is_bazar_verified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center border-2 border-heritage-950 shadow-lg">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-black text-white leading-tight">
                {artisan.artisan_name}
              </h1>
              <p className="text-sm text-heritage-300 font-medium mt-0.5">
                {artisan.tribe} · {artisan.craft_type}
              </p>
              <div className="flex items-center gap-1 mt-1.5">
                <MapPin className="w-3 h-3 text-heritage-400" />
                <span className="text-xs text-heritage-400">
                  {artisan.village}, {artisan.district || 'Mokokchung'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STATS BAR ===== */}
      <div className="bg-white border-b border-heritage-100 px-6 py-4 grid grid-cols-4 gap-2">
        <div className="text-center">
          <p className="text-lg font-black text-heritage-900">{products.length}</p>
          <p className="text-[10px] text-heritage-400 uppercase tracking-wider font-medium">Products</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-heritage-900">{artisan.total_products_sold || 0}</p>
          <p className="text-[10px] text-heritage-400 uppercase tracking-wider font-medium">Sold</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <p className="text-lg font-black text-heritage-900">{artisan.avg_rating || '4.9'}</p>
          </div>
          <p className="text-[10px] text-heritage-400 uppercase tracking-wider font-medium">Rating</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-heritage-900">{artisan.repeat_buyer_rate || 0}%</p>
          <p className="text-[10px] text-heritage-400 uppercase tracking-wider font-medium">Repeat</p>
        </div>
      </div>

      {/* ===== VERIFICATION BADGE ===== */}
      <div className="mx-5 mt-5 p-4 bg-gradient-to-r from-amber-50 to-heritage-50 rounded-2xl border border-amber-200/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-heritage-900">BAZAR Verified Artisan</h3>
            <p className="text-xs text-heritage-500 mt-0.5">
              Verified on {artisan.verified_at ? new Date(artisan.verified_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : 'March 2026'}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-full text-[10px] font-bold text-heritage-700 border border-heritage-200">
                <Shield className="w-3 h-3" /> Identity Verified
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-full text-[10px] font-bold text-heritage-700 border border-heritage-200">
                <MapPin className="w-3 h-3" /> Workshop Verified
              </span>
              {artisan.pm_vishwakarma_status && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded-full text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  <Award className="w-3 h-3" /> PM Vishwakarma
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== ARTISAN STORY ===== */}
      <div className="px-5 py-6">
        <h2 className="text-lg font-black text-heritage-900 mb-3">
          The Artisan&apos;s Story
        </h2>
        <div className="bg-white rounded-2xl p-5 border border-heritage-100">
          <p className="text-sm text-heritage-700 leading-relaxed italic mb-1">
            &ldquo;{artisan.bio}&rdquo;
          </p>
          <div className="mt-4">
            <p className="text-sm text-heritage-600 leading-relaxed whitespace-pre-line">
              {showFullStory
                ? storyText
                : storyText.substring(0, 250) + "..."}
            </p>
            <button
              onClick={() => setShowFullStory(!showFullStory)}
              className="mt-2 text-xs font-bold text-heritage-500 hover:text-heritage-700 flex items-center gap-1 transition-colors"
            >
              {showFullStory ? "Show less" : "Read full story"}
              <ChevronRight className={`w-3 h-3 transition-transform ${showFullStory ? "rotate-90" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ===== WORKSHOP PHOTOS ===== */}
      <div className="px-5 pb-6">
        <h2 className="text-lg font-black text-heritage-900 mb-3">
          Workshop
        </h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5">
          {workshopPhotos.map((photo: string, idx: number) => (
            <div
              key={idx}
              className="flex-shrink-0 w-48 h-32 rounded-2xl overflow-hidden"
            >
              <img
                src={photo}
                alt={`Workshop ${idx + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ===== PRODUCTS ===== */}
      <div className="px-5 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-black text-heritage-900">
            Products by {(artisan.artisan_name || '').split(" ")[0]}
          </h2>
          <span className="text-xs text-heritage-400 font-medium">
            {products.length} items
          </span>
        </div>
        <div className="space-y-3">
          {products.map((product: any) => (
            <button
              key={product.id}
              onClick={() => router.push(`/heritage/${product.id}`)}
              className="w-full flex items-center gap-4 bg-white rounded-2xl p-3 border border-heritage-100 hover:shadow-lg hover:shadow-heritage-200/30 transition-all duration-300 text-left group"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1583743089695-4b816a340f82?q=80&w=300&auto=format&fit=crop'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-heritage-900 truncate group-hover:text-heritage-700 transition-colors">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  {product.gi_tag_status === "registered" ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 border border-amber-200 rounded text-[9px] font-bold text-amber-700">
                      <Award className="w-2.5 h-2.5" /> GI
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-heritage-50 border border-heritage-200 rounded text-[9px] font-bold text-heritage-700">
                      <Shield className="w-2.5 h-2.5" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-base font-black text-heritage-900 mt-1.5">
                  {formatPrice(product.selling_price)}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-heritage-300 group-hover:text-heritage-500 transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* ===== PROVENANCE MAP ===== */}
      <div className="px-5 pb-6">
        <h2 className="text-lg font-black text-heritage-900 mb-3">
          Origin
        </h2>
        <div className="bg-white rounded-2xl overflow-hidden border border-heritage-100">
          <div className="h-40 bg-heritage-200 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-heritage-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-heritage-600">{artisan.village}, {artisan.district || 'Mokokchung'}</p>
              <p className="text-xs text-heritage-400 mt-0.5">Nagaland, India</p>
              {(artisan.workshop_lat && artisan.workshop_lng) && (
                <p className="text-[10px] text-heritage-300 mt-1">
                  {Number(artisan.workshop_lat).toFixed(4)}°N, {Number(artisan.workshop_lng).toFixed(4)}°E
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTACT CTA ===== */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-lg border-t border-heritage-100 px-5 py-4 flex items-center gap-3 z-50">
        <button className="flex-1 py-3.5 bg-heritage-900 text-white rounded-2xl text-sm font-black hover:bg-heritage-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-heritage-900/20">
          <Package className="w-4 h-4" />
          Shop All Products
        </button>
        <button className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-200 hover:bg-emerald-100 transition-colors">
          <Phone className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
