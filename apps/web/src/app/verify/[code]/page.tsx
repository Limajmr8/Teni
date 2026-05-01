"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  CheckCircle,
  MapPin,
  User,
  Package,
  Truck,
  Calendar,
  ArrowRight,
  ExternalLink,
  Award,
  QrCode,
  Scan,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

// Mock verification data
const MOCK_VERIFICATION = {
  code: "BZR-V7K2-M9N4",
  serialNumber: "NAG-2026-001547",
  product: {
    name: "Ao Naga Warrior Shawl",
    category: "Heritage Textiles",
    giTag: "Chakhesang Shawls",
    giStatus: "registered",
    image: "https://images.unsplash.com/photo-1583743089695-4b816a340f82?q=80&w=400&auto=format&fit=crop",
  },
  artisan: {
    id: "1",
    name: "Imna Longchar",
    tribe: "Ao Naga",
    village: "Ungma",
    district: "Mokokchung",
    portrait: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    verified: true,
  },
  provenanceChain: [
    {
      step: "Artisan Production",
      date: "2026-04-10",
      description: "Hand-woven on traditional loin loom by Imna Longchar",
      location: "Ungma Village, Mokokchung",
      icon: "user",
    },
    {
      step: "BAZAR Quality Check",
      date: "2026-04-15",
      description: "Inspected for weave consistency, dye quality, and pattern accuracy",
      location: "BAZAR QC Hub, Mokokchung",
      icon: "check",
    },
    {
      step: "Packaging & Sealing",
      date: "2026-04-16",
      description: "Vacuum-sealed with Certificate of Authenticity and holographic seal",
      location: "BAZAR Packaging Center",
      icon: "package",
    },
    {
      step: "Shipped",
      date: "2026-04-17",
      description: "Dispatched via BAZAR Logistics — Insured transit",
      location: "Mokokchung → Destination",
      icon: "truck",
    },
  ],
  scanCount: 3,
  lastScanned: "2026-04-20T14:30:00",
  isAuthentic: true,
};

const iconMap: Record<string, React.ReactNode> = {
  user: <User className="w-4 h-4" />,
  check: <CheckCircle className="w-4 h-4" />,
  package: <Package className="w-4 h-4" />,
  truck: <Truck className="w-4 h-4" />,
};

export default function VerifyPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState<typeof MOCK_VERIFICATION | null>(null);

  useEffect(() => {
    // Simulate API lookup
    const timer = setTimeout(() => {
      setVerification(MOCK_VERIFICATION);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [params.code]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-heritage-50 p-6">
        <div className="w-20 h-20 bg-heritage-100 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
          <Scan className="w-10 h-10 text-heritage-400" />
        </div>
        <h2 className="text-lg font-black text-heritage-900 mb-2">Verifying Authenticity</h2>
        <p className="text-sm text-heritage-500 text-center">
          Checking provenance records for code <br />
          <span className="font-mono font-bold text-heritage-700">{params.code}</span>
        </p>
        <div className="mt-6 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-heritage-300 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-heritage-50 p-6">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
          <Shield className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-lg font-black text-heritage-900 mb-2">Verification Failed</h2>
        <p className="text-sm text-heritage-500 text-center">
          This code could not be verified. The product may be counterfeit.
        </p>
      </div>
    );
  }

  const v = verification;

  return (
    <div className="flex flex-col min-h-screen bg-heritage-50 pb-8">
      {/* Success Header */}
      <div className="bg-gradient-to-b from-emerald-600 via-emerald-500 to-emerald-400 px-6 pt-12 pb-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-emerald-800/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-800/30">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1">Authentic Product</h1>
          <p className="text-sm text-emerald-100 font-medium">
            This product is verified by BAZAR
          </p>
        </div>
      </div>

      {/* Verification Code */}
      <div className="mx-5 -mt-5 bg-white rounded-2xl p-4 border border-heritage-100 shadow-lg shadow-heritage-200/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-heritage-400 uppercase tracking-wider font-medium">
              Verification Code
            </p>
            <p className="text-lg font-mono font-black text-heritage-900 mt-0.5">
              {v.code}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-heritage-400 uppercase tracking-wider font-medium">
              Serial
            </p>
            <p className="text-sm font-mono font-bold text-heritage-600 mt-0.5">
              {v.serialNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-heritage-100">
          <QrCode className="w-4 h-4 text-heritage-400" />
          <span className="text-xs text-heritage-400">
            Scanned {v.scanCount} times · Last: {new Date(v.lastScanned).toLocaleDateString("en-IN")}
          </span>
        </div>
      </div>

      {/* Product */}
      <div className="px-5 py-5">
        <h2 className="text-sm font-bold text-heritage-500 uppercase tracking-wider mb-3">Product</h2>
        <div className="bg-white rounded-2xl p-4 border border-heritage-100 flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <img src={v.product.image} alt={v.product.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-base font-bold text-heritage-900">{v.product.name}</h3>
            <p className="text-xs text-heritage-500 mt-0.5">{v.product.category}</p>
            {v.product.giTag && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded-full mt-2">
                <Award className="w-3 h-3 text-amber-600" />
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                  GI: {v.product.giTag}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Artisan */}
      <div className="px-5 pb-5">
        <h2 className="text-sm font-bold text-heritage-500 uppercase tracking-wider mb-3">Made By</h2>
        <button
          onClick={() => router.push(`/heritage/artisan/${v.artisan.id}`)}
          className="w-full bg-white rounded-2xl p-4 border border-heritage-100 flex items-center gap-4 hover:shadow-lg transition-shadow text-left group"
        >
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-xl overflow-hidden">
              <img src={v.artisan.portrait} alt={v.artisan.name} className="w-full h-full object-cover" />
            </div>
            {v.artisan.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-md flex items-center justify-center border-2 border-white">
                <Shield className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-heritage-900 group-hover:text-heritage-700 transition-colors">
              {v.artisan.name}
            </h3>
            <p className="text-xs text-heritage-500 mt-0.5">{v.artisan.tribe}</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-heritage-400" />
              <span className="text-xs text-heritage-400">{v.artisan.village}, {v.artisan.district}</span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-heritage-300 group-hover:text-heritage-500 transition-colors" />
        </button>
      </div>

      {/* Provenance Chain */}
      <div className="px-5 pb-5">
        <h2 className="text-sm font-bold text-heritage-500 uppercase tracking-wider mb-3">
          Provenance Chain
        </h2>
        <div className="bg-white rounded-2xl p-5 border border-heritage-100">
          <div className="space-y-0">
            {v.provenanceChain.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    idx === v.provenanceChain.length - 1
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-heritage-100 text-heritage-600"
                  }`}>
                    {iconMap[step.icon]}
                  </div>
                  {idx < v.provenanceChain.length - 1 && (
                    <div className="w-0.5 h-12 bg-heritage-200 my-1" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-6">
                  <h4 className="text-sm font-bold text-heritage-900">{step.step}</h4>
                  <p className="text-xs text-heritage-500 mt-0.5">{step.description}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-heritage-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(step.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span className="text-[10px] text-heritage-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {step.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5">
        <button
          onClick={() => router.push("/heritage")}
          className="w-full py-4 bg-heritage-900 text-white rounded-2xl text-sm font-black hover:bg-heritage-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-heritage-900/20"
        >
          Explore Heritage Gallery
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
