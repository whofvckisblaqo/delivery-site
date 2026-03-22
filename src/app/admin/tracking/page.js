'use client'

import { useState } from 'react'
import AdminShell from '@/components/AdminShell'
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  TrendingUp,
  PackageCheck,
  Save,
  CheckCheck,
} from 'lucide-react'

const initialOrders = [
  { id: 'SD123456', customer: 'Amara Okafor', from: 'Lagos Island', to: 'Lagos Mainland', status: 'Out for Delivery' },
  { id: 'EX789012', customer: 'David Mensah', from: 'Abuja Wuse', to: 'Port Harcourt', status: 'In Transit' },
  { id: 'SD345678', customer: 'Fatima Bello', from: 'Kano City', to: 'Kaduna', status: 'Delivered' },
  { id: 'EX901234', customer: 'Chidi Okonkwo', from: 'Enugu GRA', to: 'Onitsha', status: 'Picked Up' },
  { id: 'SC567890', customer: 'Ngozi Eze', from: 'Ibadan', to: 'Lagos', status: 'Pending' },
  { id: 'SD234567', customer: 'Emeka Obi', from: 'Lagos Ikeja', to: 'Lagos VI', status: 'Delivered' },
]

const allStatuses = ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']

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

export default function TrackingPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')
  const [saved, setSaved] = useState(null)

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase())
  )

  function updateStatus(id, newStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    )
    setSaved(id)
    setTimeout(() => setSaved(null), 2000)
  }

  return (
    <AdminShell title="Tracking Updates">
      <div className="flex flex-col gap-6">

        {/* Header */}
        <div>
          <h2 className="font-[family-name:var(--font-syne)] text-white font-bold text-2xl">
            Tracking Updates
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Update delivery statuses for active orders
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer..."
            className="w-full bg-[#0d1f3c] border border-[#1A3A6B]/60 hover:border-[#F97316]/40 focus:border-[#F97316] text-white placeholder-slate-600 text-sm pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-300"
          />
        </div>

        {/* Order Cards */}
        <div className="flex flex-col gap-4">
          {filtered.map((order) => {
            const StatusIcon = statusIcons[order.status]
            const isSaved = saved === order.id
            return (
              <div
                key={order.id}
                className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5 hover:border-[#F97316]/20 transition-all duration-300"
              >
                {/* Order Info */}
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="font-[family-name:var(--font-syne)] text-[#F97316] font-bold text-sm">
                      #{order.id}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[order.status]}`}>
                      <StatusIcon size={11} />
                      {order.status}
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium">{order.customer}</p>
                  <p className="text-slate-500 text-xs">{order.from} → {order.to}</p>
                </div>

                {/* Status Selector */}
                <div className="flex items-center gap-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="bg-[#0A1628] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] text-white text-sm px-4 py-2.5 rounded-xl outline-none transition-all duration-300 cursor-pointer"
                  >
                    {allStatuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  {/* Save feedback */}
                  <div className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-300 ${
                    isSaved ? 'text-green-400 opacity-100' : 'opacity-0'
                  }`}>
                    <CheckCheck size={14} />
                    Saved
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </AdminShell>
  )
}