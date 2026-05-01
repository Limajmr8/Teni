"use client";

import { useEffect, useState } from "react";
import { supabase } from "@bazar/shared/src/supabase";
import { SubOrder, OrderStatus } from "@bazar/shared/src/index";
import { Package, CheckCircle, AlertCircle, Clock, Activity, Boxes, Truck, ChevronDown, Check, Zap } from "lucide-react";

export default function WarehouseDashboard() {
  const [orders, setOrders] = useState<SubOrder[]>([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchOrders() {
      const { data } = await supabase
        .from('sub_orders')
        .select('*')
        .eq('source', 'dark_store')
        .in('status', ['pending', 'accepted', 'picking', 'packed'])
        .order('created_at', { ascending: true });
      if (data) setOrders(data);
    }

    fetchOrders();

    const channel = supabase
      .channel('warehouse_orders')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'sub_orders',
        filter: 'source=eq.dark_store'
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setOrders(prev => [...prev, payload.new as SubOrder]);
        } else if (payload.eventType === 'UPDATE') {
          setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new as SubOrder : o));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    await supabase
      .from('sub_orders')
      .update({ status })
      .eq('id', orderId);
  };

  const pending = orders.filter(o => ['pending', 'accepted'].includes(o.status));
  const picking = orders.filter(o => o.status === 'picking');
  const packed = orders.filter(o => o.status === 'packed');

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center border border-rose-100">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900">Warehouse Ops</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                Mokokchung Dark Store
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-bold text-gray-700">
                {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-xs font-black text-green-700 uppercase">{orders.length} Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Strip */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'To Pick', value: pending.length, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Picking', value: picking.length, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Ready', value: packed.length, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Avg Pick', value: '4m 20s', color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
              <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3-Column Kanban */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TO PICK */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1 mb-2">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" /> To Pick
              </h2>
              <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">{pending.length}</span>
            </div>
            {pending.map(order => (
              <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-black tracking-widest uppercase text-gray-900 bg-gray-50 px-2 py-1 rounded border border-gray-100">#{order.id.slice(0, 8)}</span>
                  <div className="flex items-center gap-1 bg-rose-50 text-rose-600 px-2 py-1 rounded text-[10px] font-black">
                    <Zap className="w-3 h-3 fill-rose-600" /> 15m
                  </div>
                </div>
                <div className="space-y-2.5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                      <span className="text-gray-800 font-bold">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                      <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">A-04</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => updateStatus(order.id, 'picking')}
                  className="w-full bg-blue-50 text-blue-600 border border-blue-200 py-3 rounded-xl text-xs font-black uppercase tracking-wide hover:bg-blue-100 active:scale-95 transition-all"
                >
                  Start Picking
                </button>
              </div>
            ))}
            {pending.length === 0 && (
              <div className="border border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50/50">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Queue empty</p>
              </div>
            )}
          </div>

          {/* PICKING */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1 mb-2">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" /> Picking
              </h2>
              <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg">{picking.length}</span>
            </div>
            {picking.map(order => (
              <div key={order.id} className="bg-amber-50/30 border border-amber-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-black tracking-widest uppercase text-amber-900 bg-amber-100 px-2 py-1 rounded">#{order.id.slice(0, 8)}</span>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-2 py-1 rounded-md animate-pulse">In Progress</span>
                </div>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <label key={idx} className="flex items-center gap-4 p-3 bg-white border border-amber-100 rounded-xl cursor-pointer hover:border-amber-300 transition-colors shadow-sm">
                      <input type="checkbox" className="w-5 h-5 text-amber-500 rounded border-amber-300 focus:ring-amber-500" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">{item.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">QTY: {item.quantity} · SHELF A-04</p>
                      </div>
                    </label>
                  ))}
                </div>
                <button 
                  onClick={() => updateStatus(order.id, 'packed')}
                  className="w-full bg-amber-500 text-white shadow-lg shadow-amber-500/20 py-3 rounded-xl text-xs font-black uppercase tracking-wide hover:bg-amber-600 active:scale-95 transition-all"
                >
                  Hand to Packer
                </button>
              </div>
            ))}
            {picking.length === 0 && (
              <div className="border border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50/50">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">No active picks</p>
              </div>
            )}
          </div>

          {/* READY */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1 mb-2">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> Ready
              </h2>
              <span className="text-xs font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded-lg">{packed.length}</span>
            </div>
            {packed.map(order => (
              <div key={order.id} className="bg-white border border-green-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-black tracking-widest uppercase text-gray-900 bg-gray-50 px-2 py-1 rounded border border-gray-100">#{order.id.slice(0, 8)}</span>
                  <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded uppercase tracking-widest">Packed</span>
                </div>
                <div className="border border-green-100 bg-green-50/50 p-4 rounded-xl">
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Runner Assigned</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-sm font-black text-gray-900">Bendang Ao</p>
                  </div>
                </div>
                <button 
                  onClick={() => updateStatus(order.id, 'out_for_delivery')}
                  className="w-full bg-green-600 text-white shadow-lg shadow-green-600/20 py-3 rounded-xl text-xs font-black uppercase tracking-wide hover:bg-green-700 active:scale-95 transition-all"
                >
                  Dispatch Order
                </button>
              </div>
            ))}
            {packed.length === 0 && (
              <div className="border border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50/50">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">No packed orders</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
