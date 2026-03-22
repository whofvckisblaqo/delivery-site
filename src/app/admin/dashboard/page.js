'use client'

import AdminShell from '@/components/AdminShell'
import {
  PackageCheck,
  Users,
  TrendingUp,
  MessageSquare,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const stats = [
  { icon: PackageCheck, label: 'Total Orders', value: '1,284', change: '+12% this week', positive: true },
  { icon: Users, label: 'Total Customers', value: '842', change: '+8% this week', positive: true },
  { icon: TrendingUp, label: 'On-Time Rate', value: '98%', change: '+2% this month', positive: true },
  { icon: MessageSquare, label: 'New Messages', value: '24', change: '6 unread today', positive: false },
]

const recentOrders = [
  { id: 'SD123456', customer: 'Amara Okafor', from: 'Lagos Island', to: 'Lagos Mainland', status: 'Out for Delivery', time: '2:45 PM' },
  { id: 'EX789012', customer: 'David Mensah', from: 'Abuja Wuse', to: 'Port Harcourt', status: 'In Transit', time: '11:30 AM' },
  { id: 'SD345678', customer: 'Fatima Bello', from: 'Kano City', to: 'Kaduna', status: 'Delivered', time: '9:15 AM' },
  { id: 'EX901234', customer: 'Chidi Okonkwo', from: 'Enugu GRA', to: 'Onitsha', status: 'Picked Up', time: '8:00 AM' },
  { id: 'SD567890', customer: 'Ngozi Eze', from: 'Ibadan', to: 'Lagos', status: 'Pending', time: 'Yesterday' },
]

const statusStyles = {
  'Out for Delivery': 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20',
  'In Transit': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  'Delivered': 'bg-green-500/10 text-green-400 border border-green-500/20',
  'Picked Up': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  'Pending': 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
}

const statusIcons = {
  'Out for Delivery': Truck,
  'In Transit': TrendingUp,
  'Delivered': CheckCircle2,
  'Picked Up': PackageCheck,
  'Pending': Clock,
}

// Chart data
const deliveryTrend = [
  { day: 'Mon', orders: 42, delivered: 38 },
  { day: 'Tue', orders: 58, delivered: 54 },
  { day: 'Wed', orders: 65, delivered: 60 },
  { day: 'Thu', orders: 51, delivered: 48 },
  { day: 'Fri', orders: 78, delivered: 72 },
  { day: 'Sat', orders: 90, delivered: 85 },
  { day: 'Sun', orders: 35, delivered: 33 },
]

const revenueData = [
  { month: 'Aug', revenue: 420000 },
  { month: 'Sep', revenue: 580000 },
  { month: 'Oct', revenue: 510000 },
  { month: 'Nov', revenue: 690000 },
  { month: 'Dec', revenue: 850000 },
  { month: 'Jan', revenue: 760000 },
]

const statusBreakdown = [
  { name: 'Delivered', value: 68, color: '#22c55e' },
  { name: 'In Transit', value: 14, color: '#3b82f6' },
  { name: 'Out for Delivery', value: 10, color: '#F97316' },
  { name: 'Pending', value: 5, color: '#64748b' },
  { name: 'Picked Up', value: 3, color: '#a855f7' },
]

// Custom tooltip for area/bar charts
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-slate-400 text-xs mb-2">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' && entry.value > 1000
              ? `₦${(entry.value / 1000).toFixed(0)}k`
              : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Custom legend for pie chart
function CustomLegend({ data }) {
  return (
    <div className="flex flex-col gap-2 mt-4">
      {data.map(({ name, value, color }) => (
        <div key={name} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-slate-400 text-xs">{name}</span>
          </div>
          <span className="text-white text-xs font-semibold">{value}%</span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AdminShell title="Dashboard">
      <div className="flex flex-col gap-8">

        {/* Welcome */}
        <div className="flex flex-col gap-1">
          <h2 className="font-[family-name:var(--font-syne)] text-white font-bold text-2xl">
            Good morning, Admin 👋
          </h2>
          <p className="text-slate-400 text-sm">
            Here's what's happening with SwiftDrop today.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map(({ icon: Icon, label, value, change, positive }, i) => (
            <div
              key={i}
              className="group bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-2xl p-6 flex flex-col gap-4 hover:border-[#F97316]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#F97316]/5"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center transition-all duration-300 group-hover:bg-[#F97316]/20">
                  <Icon size={18} className="text-[#F97316]" />
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  positive
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-[#F97316]/10 text-[#F97316]'
                }`}>
                  {change}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-[family-name:var(--font-syne)] text-3xl font-extrabold text-white">
                  {value}
                </span>
                <span className="text-slate-400 text-sm">{label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 — Area + Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Delivery Trend — Area Chart */}
          <div className="lg:col-span-2 bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-2xl p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-[family-name:var(--font-syne)] text-white font-bold text-base">
                  Delivery Trend
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">Orders vs delivered this week</p>
              </div>
              <span className="text-xs text-slate-500 bg-[#1A3A6B]/40 px-3 py-1 rounded-full">
                This Week
              </span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={deliveryTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="deliveredGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A3A6B" strokeOpacity={0.4} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#F97316"
                  strokeWidth={2}
                  fill="url(#ordersGrad)"
                  dot={{ fill: '#F97316', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: '#F97316' }}
                />
                <Area
                  type="monotone"
                  dataKey="delivered"
                  name="Delivered"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#deliveredGrad)"
                  dot={{ fill: '#22c55e', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: '#22c55e' }}
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex items-center gap-6">
              {[
                { color: '#F97316', label: 'Total Orders' },
                { color: '#22c55e', label: 'Delivered' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-3 h-0.5 rounded-full inline-block" style={{ backgroundColor: color }} />
                  <span className="text-slate-400 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Breakdown — Pie Chart */}
          <div className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <h3 className="font-[family-name:var(--font-syne)] text-white font-bold text-base">
                Order Status
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">Breakdown by status</p>
            </div>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {statusBreakdown.map(({ color }, i) => (
                      <Cell key={i} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-xl px-3 py-2 shadow-xl">
                            <p className="text-white text-xs font-semibold">{payload[0].name}</p>
                            <p className="text-slate-400 text-xs">{payload[0].value}%</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <CustomLegend data={statusBreakdown} />
          </div>
        </div>

        {/* Charts Row 2 — Bar Chart */}
        <div className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-[family-name:var(--font-syne)] text-white font-bold text-base">
                Revenue Overview
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">Monthly revenue for the last 6 months</p>
            </div>
            <span className="text-xs text-slate-500 bg-[#1A3A6B]/40 px-3 py-1 rounded-full">
              Last 6 Months
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A3A6B" strokeOpacity={0.4} vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="#F97316"
                radius={[6, 6, 0, 0]}
                maxBarSize={52}
              >
                {revenueData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === revenueData.length - 1 ? '#F97316' : '#1A3A6B'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-slate-600 text-xs text-right">
            Latest month highlighted in orange
          </p>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[#1A3A6B]/40 flex items-center justify-between">
            <h3 className="font-[family-name:var(--font-syne)] text-white font-bold text-lg">
              Recent Orders
            </h3>
            <a
              href="/admin/orders"
              className="text-[#F97316] hover:text-orange-400 text-sm font-medium transition-colors duration-200"
            >
              View all →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1A3A6B]/40">
                  {['Order ID', 'Customer', 'Route', 'Status', 'Time'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-slate-500 text-xs font-medium uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A3A6B]/30">
                {recentOrders.map(({ id, customer, from, to, status, time }) => {
                  const StatusIcon = statusIcons[status]
                  return (
                    <tr
                      key={id}
                      className="hover:bg-[#1A3A6B]/20 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <span className="font-[family-name:var(--font-syne)] text-[#F97316] font-bold text-sm">
                          #{id}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white text-sm font-medium">
                        {customer}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {from} → {to}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[status]}`}>
                          <StatusIcon size={11} />
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        {time}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alert */}
        <div className="flex items-start gap-4 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-6 py-4">
          <AlertCircle size={20} className="text-[#F97316] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <p className="text-white text-sm font-semibold">
              2 deliveries are running late today
            </p>
            <p className="text-slate-400 text-xs">
              Orders #SD123456 and #EX789012 may need immediate attention.
            </p>
          </div>
        </div>

      </div>
    </AdminShell>
  )
}