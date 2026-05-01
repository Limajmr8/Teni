"use client";

import { useEffect, useState } from "react";
import { supabase } from "@bazar/shared/src/supabase";
import { OrderStatus, SubOrder } from "@bazar/shared/src/index";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Clock, CheckCircle, Package, TrendingUp, Users, MapPin, Search, Menu, Bell, ChevronDown } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    activeOrders: 0,
    dailyRevenue: 0,
    sellersActive: 0,
    pendingVerifications: 0
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      const { count: active } = await supabase
        .from('sub_orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'accepted', 'picking', 'packed']);
      
      const { data: rev } = await supabase
        .from('parent_orders')
        .select('total_amount')
        .gte('created_at', new Date().toISOString().split('T')[0]);
      
      const revenue = rev?.reduce((acc, order) => acc + order.total_amount, 0) || 0;

      const { count: sellers } = await supabase
        .from('seller_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', true);

      const { count: pending } = await supabase
        .from('seller_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false);

      setStats({
        activeOrders: active || 0,
        dailyRevenue: revenue,
        sellersActive: sellers || 0,
        pendingVerifications: pending || 0
      });

      const { data: orders } = await supabase
        .from('sub_orders')
        .select(`
          *,
          parent:parent_orders (
            total_amount,
            delivery_address
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (orders) setRecentOrders(orders);
    }

    loadStats();

    const channel = supabase.channel('admin_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sub_orders' }, () => loadStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'parent_orders' }, () => loadStats())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const data = [
    { time: "09:00", orders: 10 },
    { time: "11:00", orders: 25 },
    { time: "13:00", orders: 45 },
    { time: "15:00", orders: 30 },
    { time: "17:00", orders: 55 },
    { time: "19:00", orders: 70 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col shadow-sm relative z-10">
        <div className="p-6">
          <div className="flex items-center gap-2 text-rose-600">
            <MapPin className="w-6 h-6" />
            <h1 className="text-xl font-black tracking-tight text-gray-900">TENI HQ</h1>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {[
            { name: "Overview", icon: TrendingUp, active: true },
            { name: "Orders", icon: Package },
            { name: "Sellers", icon: Users },
            { name: "Live Operations", icon: Clock },
          ].map((item) => (
            <a key={item.name} href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${item.active ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <item.icon className={`w-5 h-5 ${item.active ? 'text-rose-600' : 'text-gray-400'}`} />
              {item.name}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-gray-900">Mokokchung Region</h2>
            <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Active
            </span>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search orders..." className="pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all w-64" />
            </div>
            <button className="relative text-gray-500 hover:text-gray-900">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300"></div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Active Orders", value: stats.activeOrders, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Today's Revenue", value: `₹${(stats.dailyRevenue / 100).toLocaleString()}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Active Sellers", value: stats.sellersActive, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Pending Verifications", value: stats.pendingVerifications, icon: Clock, color: "text-rose-600", bg: "bg-rose-50" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold text-gray-500">{stat.label}</p>
                  <div className={`p-2 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-black text-gray-900">Order Volume Today</h3>
                <button className="text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-gray-900">
                  Today <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e11d48" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 'bold' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 'bold' }} dx={-10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontWeight: 'bold', color: '#111827' }}
                    />
                    <Area type="monotone" dataKey="orders" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Actions & Approvals */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-base font-black text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-rose-600 text-white rounded-xl py-3 text-sm font-bold shadow-sm shadow-rose-600/20 hover:bg-rose-700 transition-colors">
                    Generate Payment Batch
                  </button>
                  <button className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl py-3 text-sm font-bold hover:bg-gray-50 transition-colors">
                    Review Sellers ({stats.pendingVerifications})
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
                <h3 className="text-base font-black text-gray-900 mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {recentOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                      <div>
                        <p className="text-xs font-bold text-gray-900 uppercase">#{order.id.slice(0, 8)}</p>
                        <p className="text-[10px] font-medium text-gray-500 mt-0.5">{new Date(order.created_at).toLocaleTimeString()}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                        order.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                  {recentOrders.length === 0 && (
                    <p className="text-xs font-medium text-gray-500 text-center py-4">No recent orders.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
