'use client'

import { useState, useEffect } from 'react' // Added useEffect
import AdminShell from '@/components/AdminShell'
import {
  PackageCheck, Users, TrendingUp, MessageSquare,
  Clock, CheckCircle2, Truck, AlertCircle, Loader2
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

// ... (Keep your Tooltip, Legend, and Styles constants from your previous code)

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
    <AdminShell title="Dashboard">
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-[#F97316]" size={40} />
      </div>
    </AdminShell>
  )

  // Mapping live data to your UI format
  const liveStats = [
    { icon: PackageCheck, label: 'Total Orders', value: data?.totalOrders || 0, change: 'Live from DB', positive: true },
    { icon: TrendingUp, label: 'Revenue', value: `₦${(data?.totalRevenue || 0).toLocaleString()}`, change: 'Total value', positive: true },
    { icon: MessageSquare, label: 'New Messages', value: data?.totalMessages || 0, change: 'Unread', positive: false },
    { icon: Users, label: 'Customers', value: data?.totalOrders || 0, change: 'Unique leads', positive: true },
  ]

  return (
    <AdminShell title="Dashboard">
      <div className="flex flex-col gap-8">
        {/* Welcome */}
        <div className="flex flex-col gap-1">
          <h2 className="font-[family-name:var(--font-syne)] text-white font-bold text-2xl">
            Live Overview 👋
          </h2>
          <p className="text-slate-400 text-sm">Real-time data from SwiftDrop Database.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {liveStats.map(({ icon: Icon, label, value, change, positive }, i) => (
            <div key={i} className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-2xl p-6 hover:border-[#F97316]/30 transition-all">
              <div className="flex justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
                  <Icon size={18} className="text-[#F97316]" />
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full ${positive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {change}
                </span>
              </div>
              <h4 className="text-3xl font-extrabold text-white">{value}</h4>
              <p className="text-slate-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* You can keep your Trend Charts here - 
               For full 'Live' trends, you would need to group orders by date in the API */}
        </div>

        {/* Recent Orders Table (Now Live) */}
        <div className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[#1A3A6B]/40 flex items-center justify-between">
            <h3 className="text-white font-bold text-lg">Recent Orders</h3>
            <a href="/admin/orders" className="text-[#F97316] text-sm hover:underline">View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1A3A6B]/40 text-slate-500 text-[10px] uppercase">
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Route</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A3A6B]/30">
                {data?.recentOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-[#1A3A6B]/20 transition-colors">
                    <td className="px-6 py-4 text-[#F97316] font-bold">#{order.orderId}</td>
                    <td className="px-6 py-4 text-white text-sm">{order.customer}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{order.fromLocation} → {order.toLocation}</td>
                    <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] rounded-full">
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
    </AdminShell>
  )
}