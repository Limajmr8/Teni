"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Package, 
  Clock, 
  CheckCircle, 
  WifiOff, 
  TrendingUp,
  MapPin,
  ChevronRight,
  Settings
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@bazar/shared/src/supabase";

export default function CounterDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"recent" | "pending">("recent");
  const [lrs, setLrs] = useState<any[]>([]);
  const isOffline = false;
  const unsyncedCount = lrs.filter(lr => lr.created_offline && !lr.synced_at).length;

  useEffect(() => {
    async function fetchLRs() {
      const { data } = await supabase.from('lorry_receipts').select('*').order('created_at', { ascending: false });
      if (data) setLrs(data);
    }
    fetchLRs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 pb-24 font-sans">
      {/* Header */}
      <div className="bg-neutral-900 px-5 pt-6 pb-6 rounded-b-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-neutral-400 font-medium tracking-wider uppercase">Counter Portal</p>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              Mokokchung Main
              {isOffline && <WifiOff className="w-4 h-4 text-red-400" />}
            </h1>
          </div>
          <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-2 text-neutral-400 mb-1">
              <Package className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Today's LRs</span>
            </div>
            <p className="text-2xl font-black text-white">{lrs.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Earnings</span>
            </div>
            <p className="text-2xl font-black text-white">₹{lrs.reduce((acc, curr) => acc + (curr.total_fee || 0), 0) / 100}</p>
          </div>
        </div>
      </div>

      {/* Sync Status Alert */}
      {unsyncedCount > 0 && (
        <div className="mx-5 mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-800">
              {unsyncedCount} LRs waiting to sync
            </span>
          </div>
          <button className="text-[10px] font-black uppercase text-amber-600 bg-amber-100 px-2 py-1 rounded-md">
            Sync Now
          </button>
        </div>
      )}

      {/* Search */}
      <div className="px-5 mt-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search LR Number or Phone..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl text-sm shadow-sm border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wide">
            Recent LRs
          </h2>
          <button className="text-xs font-bold text-emerald-600">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {lrs.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border-2 border-dashed border-neutral-200">
              <p className="text-neutral-400 font-bold">No Lorry Receipts yet.</p>
            </div>
          )}
          {lrs.map((lr) => (
            <div key={lr.id} className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm relative overflow-hidden group">
              {(lr.created_offline && !lr.synced_at) && (
                <div className="absolute top-0 right-0 w-2 h-full bg-amber-400" />
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-neutral-500 font-bold mb-0.5">{new Date(lr.created_at).toLocaleTimeString()}</p>
                  <p className="text-sm font-black font-mono text-neutral-900">{lr.lr_number}</p>
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                  lr.status === 'in_transit' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {lr.status.replace('_', ' ')}
                </div>
              </div>

              <div className="flex items-center gap-4 py-2 border-y border-neutral-100/60 mb-3">
                <div className="flex-1">
                  <p className="text-[10px] text-neutral-400 uppercase font-medium">To</p>
                  <p className="text-sm font-bold text-neutral-800 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-400" /> {lr.destination_district}
                  </p>
                </div>
                <div className="w-px h-8 bg-neutral-100" />
                <div className="flex-1">
                  <p className="text-[10px] text-neutral-400 uppercase font-medium">Receiver</p>
                  <p className="text-sm font-bold text-neutral-800">{lr.receiver_name}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-emerald-600">Fee: ₹{(lr.total_fee || 0) / 100}</p>
                <button 
                  onClick={() => router.push(`/logistics/track/${lr.lr_number}`)}
                  className="text-xs font-bold text-neutral-500 flex items-center gap-1 hover:text-neutral-900 transition-colors"
                >
                  Details <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => router.push('/logistics/create-lr')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center hover:bg-emerald-700 active:scale-95 transition-all z-50"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
