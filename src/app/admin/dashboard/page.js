'use client'

import { useState, useEffect } from 'react'
import {
  PackageCheck, Users, TrendingUp, MessageSquare,
  Truck, Loader2
} from 'lucide-react'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getStats() {
      try {
        const res = await fetch('/api/admin/stats')
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error("Failed to load stats")
      } finally {
        setLoading(false)
      }
    }
    getStats()
  }, [])

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-[#F97316]" size={40} />
    </div>
  )

  const liveStats = [
    { icon: PackageCheck, label: 'Total Orders', value: data?.totalOrders || 0, change: 'Live from DB', positive: true },
    { icon: TrendingUp, label: 'Revenue', value: `₦${(data?.totalRevenue || 0).toLocaleString()}`, change: 'Total value', positive: true },
    { icon: MessageSquare, label: 'New Messages', value: data?.totalMessages || 0, change: 'Unread', positive: false },
    { icon: Users, label: 'Customers', value: data?.totalOrders || 0, change: 'Unique leads', positive: true },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome - Clean Title */}
      <div className="flex flex-col gap-1">
        <h2 className="font-syne text-white font-bold text-2xl italic uppercase tracking-tight">
          Live Overview 👋
        </h2>
        <p className="text-slate-400 text-sm">Real-time data from SwiftDrop Database.</p>
      </div>

      {/* Stat Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {liveStats.map(({ icon: Icon, label, value, change, positive }, i) => (
          <div key={i} className="bg-[#0d1f3c] border border-white/5 rounded-2xl p-6 hover:border-[#F97316]/30 transition-all shadow-xl">
            <div className="flex justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
                <Icon size={18} className="text-[#F97316]" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${positive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {change}
              </span>
            </div>
            <h4 className="text-3xl font-black text-white font-syne italic">{value}</h4>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#0d1f3c] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <h3 className="text-white font-bold text-lg font-syne uppercase tracking-tight">Recent Orders</h3>
          <a href="/admin/orders" className="text-[#F97316] text-sm font-bold hover:underline">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 text-[10px] uppercase font-black tracking-widest bg-white/[0.01]">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.recentOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-[#F97316] font-black italic">#{order.orderId}</td>
                  <td className="px-6 py-4 text-white text-sm font-medium">{order.customer}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{order.fromLocation} → {order.toLocation}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-lg">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}