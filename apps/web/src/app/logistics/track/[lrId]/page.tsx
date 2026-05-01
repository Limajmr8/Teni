"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  Shield,
  Phone,
  AlertCircle,
  Navigation,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@bazar/shared/src/supabase";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; bgIconColor: string }> = {
  created: { label: "Created", color: "text-blue-600 bg-blue-50 border-blue-200", bgIconColor: "bg-blue-100", icon: Package },
  in_transit: { label: "In Transit", color: "text-amber-600 bg-amber-50 border-amber-200", bgIconColor: "bg-amber-100", icon: Truck },
  at_checkpoint: { label: "At Checkpoint", color: "text-purple-600 bg-purple-50 border-purple-200", bgIconColor: "bg-purple-100", icon: MapPin },
  arrived: { label: "Arrived", color: "text-emerald-600 bg-emerald-50 border-emerald-200", bgIconColor: "bg-emerald-100", icon: CheckCircle },
  delivered: { label: "Delivered", color: "text-emerald-600 bg-emerald-50 border-emerald-200", bgIconColor: "bg-emerald-100", icon: CheckCircle },
  lost: { label: "Lost — Claim Filed", color: "text-red-600 bg-red-50 border-red-200", bgIconColor: "bg-red-100", icon: AlertCircle },
  claimed: { label: "Insurance Claim", color: "text-orange-600 bg-orange-50 border-orange-200", bgIconColor: "bg-orange-100", icon: Shield },
};

function formatPrice(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(paise / 100);
}

export default function TrackLRPage() {
  const params = useParams();
  const router = useRouter();
  const [lr, setLr] = useState<any>(null);
  const [checkpoints, setCheckpoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLR() {
      const { data } = await supabase
        .from('lorry_receipts')
        .select('*')
        .eq('lr_number', params.lrId)
        .single();

      if (data) {
        setLr(data);
        const { data: cps } = await supabase
          .from('lr_checkpoints')
          .select('*')
          .eq('lr_id', data.id)
          .order('created_at', { ascending: true });
        if (cps) setCheckpoints(cps);
      }
      setLoading(false);
    }
    fetchLR();
  }, [params.lrId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-4 border border-gray-100 shadow-sm animate-pulse">
          <Package className="w-8 h-8 text-emerald-500" />
        </div>
        <p className="text-xs font-bold text-gray-500">Fetching tracking details...</p>
      </div>
    );
  }

  if (!lr) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-gray-800">LR not found.</div>;

  const statusConfig = STATUS_CONFIG[lr.status] || STATUS_CONFIG.created;
  const StatusIcon = statusConfig.icon;
  const progressPct = checkpoints.length > 0 ? (checkpoints.length / 4) * 100 : 25;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 shadow-sm flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1 -ml-1 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
        <div>
          <h1 className="text-lg font-black text-gray-900 leading-tight">Track Parcel</h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase">ID: {lr.lr_number}</p>
        </div>
      </header>

      <div className="max-w-md mx-auto w-full pt-4 px-4 space-y-4">
        {/* Status Card */}
        <div className={cn("bg-white rounded-2xl p-4 shadow-sm border", statusConfig.color)}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", statusConfig.bgIconColor)}>
                        <StatusIcon className={cn("w-5 h-5", statusConfig.color.split(' ')[0])} />
                    </div>
                    <div>
                        <h2 className="text-base font-black text-gray-900">{statusConfig.label}</h2>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">Current Status</p>
                    </div>
                </div>
                <div className="bg-white rounded-full p-2 border border-gray-100 shadow-sm">
                    <Navigation className="w-5 h-5 text-emerald-500" />
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/50 rounded-full h-2 mb-1 border border-black/5 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(progressPct, 100)}%` }} />
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase">
                <span>Mokokchung</span>
                <span>{lr.destination_district}</span>
            </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" /> Live Updates
            </h3>
            
            {checkpoints.length === 0 && (
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
                        <Truck className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 font-bold">Awaiting first scan...</p>
                </div>
            )}
            
            <div className="space-y-0 pl-2">
                {checkpoints.map((cp, idx) => (
                    <div key={cp.id} className="flex gap-4 relative">
                        <div className="flex flex-col items-center relative">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100 z-10">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            {idx < checkpoints.length - 1 && (
                                <div className="w-0.5 h-full absolute top-8 bg-gray-100 my-1" />
                            )}
                        </div>
                        <div className="pb-6 pt-1 flex-1">
                            <h4 className="text-sm font-bold text-gray-900">{cp.location_name || cp.checkpoint_type}</h4>
                            {cp.notes && <p className="text-xs text-gray-500 mt-0.5 font-medium">{cp.notes}</p>}
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] font-bold text-gray-500">
                                    {new Date(cp.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400">
                                    {new Date(cp.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Parcel Details */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
            <h3 className="text-sm font-black text-gray-900 mb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" /> Manifest
            </h3>
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-500">Contents</span>
                <span className="text-sm font-black text-gray-900">{lr.parcel_description || 'Classified'}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-500">Form Factor</span>
                <span className="text-sm font-black text-gray-900 capitalize bg-gray-50 px-2 py-0.5 rounded">{lr.parcel_size}</span>
            </div>
            {lr.declared_value && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                    <span className="text-xs font-bold text-gray-500">Value</span>
                    <span className="text-sm font-black text-emerald-600">{formatPrice(lr.declared_value)}</span>
                </div>
            )}
            <div className="flex justify-between items-center pt-1">
                <span className="text-xs font-bold text-gray-500">Logistics Fee</span>
                <span className="text-base font-black text-gray-900">{formatPrice(lr.total_fee)}</span>
            </div>
        </div>

        {/* Personnel */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
            <h3 className="text-sm font-black text-gray-900 mb-2">Personnel</h3>
            
            {lr.driver_name && (
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100">
                            <Truck className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase">Pilot</p>
                            <p className="text-sm font-black text-gray-900">{lr.driver_name}</p>
                        </div>
                    </div>
                    {lr.driver_phone && (
                        <a href={`tel:${lr.driver_phone}`} className="w-10 h-10 bg-emerald-50 hover:bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 transition-colors">
                            <Phone className="w-4 h-4" />
                        </a>
                    )}
                </div>
            )}

            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100">
                        <MapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">Recipient</p>
                        <p className="text-sm font-black text-gray-900">{lr.receiver_name}</p>
                    </div>
                </div>
                {lr.receiver_phone && (
                    <a href={`tel:${lr.receiver_phone}`} className="w-10 h-10 bg-emerald-50 hover:bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 transition-colors">
                        <Phone className="w-4 h-4" />
                    </a>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}
