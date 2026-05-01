"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@bazar/shared/src/supabase";
import { Search, X, ArrowLeft, Loader2 } from "lucide-react";
import { formatPrice } from "@bazar/shared/src/supabase";

interface SearchResult {
  id: string;
  name: string;
  price: number;
  unit?: string;
  image?: string;
  type: "product" | "seller";
  subtitle?: string;
}

export default function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);

      // Search products
      const { data: products } = await supabase
        .from("products")
        .select("id, name, price, unit, images")
        .ilike("name", `%${query}%`)
        .eq("is_active", true)
        .limit(6);

      // Search sellers
      const { data: sellers } = await supabase
        .from("seller_profiles")
        .select("user_id, store_name, store_slug, village_origin, locality")
        .ilike("store_name", `%${query}%`)
        .eq("is_approved", true)
        .limit(3);

      const productResults: SearchResult[] = (products || []).map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        unit: p.unit,
        image:
          p.images?.[0] ||
          "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=200&auto=format&fit=crop",
        type: "product" as const,
      }));

      const sellerResults: SearchResult[] = (sellers || []).map((s) => ({
        id: s.store_slug,
        name: s.store_name,
        price: 0,
        type: "seller" as const,
        subtitle: `${s.village_origin || ""} · ${s.locality || ""}`.replace(
          /^ · | · $/g,
          ""
        ),
        image: `https://api.dicebear.com/7.x/initials/svg?seed=${s.store_name}`,
      }));

      setResults([...sellerResults, ...productResults]);
      setLoading(false);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeout);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "seller") {
      router.push(`/s/${result.id}`);
    } else {
      router.push(`/product/${result.id}`);
    }
    onClose();
    setQuery("");
    setResults([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col font-sans animate-fade-in">
      {/* Search Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white">
        <button
          onClick={() => {
            onClose();
            setQuery("");
            setResults([]);
          }}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder='Search "smoked pork" or "Mary"'
            className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-xl text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
          </div>
        )}

        {!loading && query.length >= 2 && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center px-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-bold text-gray-600">
              No results for &quot;{query}&quot;
            </p>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Try a different search term
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="divide-y divide-gray-50">
            {results.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {result.name}
                  </p>
                  {result.type === "seller" ? (
                    <p className="text-xs text-emerald-600 font-bold mt-0.5">
                      🏪 Seller · {result.subtitle}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {result.unit} · {formatPrice(result.price)}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && query.length < 2 && (
          <div className="p-6 space-y-4">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Smoked Pork",
                "King Chili",
                "Bamboo Shoot",
                "Axone",
                "Sticky Rice",
                "Tree Tomato",
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 bg-gray-100 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
