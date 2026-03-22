'use client'

import { useState } from 'react'
import AdminShell from '@/components/AdminShell'
import { useToast } from '@/components/ToastProvider'
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  TrendingUp,
  Search,
  Filter,
  Eye,
  X,
} from 'lucide-react'

const initialOrders = [
  { id: 'SD123456', customer: 'Amara Okafor', phone: '+234 801 234 5678', from: 'Lagos Island', to: 'Lagos Mainland', service: 'Same-Day', status: 'Out for Delivery', date: 'Today, 2:45 PM', amount: '₦2,500' },
  { id: 'EX789012', customer: 'David Mensah', phone: '+234 802 345 6789', from: 'Abuja Wuse', to: 'Port Harcourt', service: 'Express', status: 'In Transit', date: 'Today, 11:30 AM', amount: '₦1,200' },
  { id: 'SD345678', customer: 'Fatima Bello', phone: '+234 803 456 7890', from: 'Kano City', to: 'Kaduna', service: 'Same-Day', status: 'Delivered', date: 'Today, 9:15 AM', amount: '₦2,500' },
  { id: 'EX901234', customer: 'Chidi Okonkwo', phone: '+234 804 567 8901', from: 'Enugu GRA', to: 'Onitsha', service: 'Express', status: 'Picked Up', date: 'Today, 8:00 AM', amount: '₦1,200' },
  { id: 'SC567890', customer: 'Ngozi Eze', phone: '+234 805 678 9012', from: 'Ibadan', to: 'Lagos', service: 'Scheduled', status: 'Pending', date: 'Yesterday', amount: '₦800' },
  { id: 'SD234567', customer: 'Emeka Obi', phone: '+234 806 789 0123', from: 'Lagos Ikeja', to: 'Lagos VI', service: 'Same-Day', status: 'Delivered', date: 'Yesterday', amount: '₦2,500' },
  { id: 'EX890123', customer: 'Aisha Suleiman', phone: '+234 807 890 1234', from: 'Kano', to: 'Abuja', service: 'Express', status: 'Delivered', date: '2 days ago', amount: '₦1,200' },
  { id: 'SC456789', customer: 'Tunde Adeyemi', phone: '+234 808 901 2345', from: 'Lagos Lekki', to: 'Lagos Ajah', service: 'Scheduled', status: 'Pending', date: '2 days ago', amount: '₦800' },
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

const allStatuses = ['All', 'Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']
const editableStatuses = ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const toast = useToast()

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' || o.status === filter
    return matchesSearch && matchesFilter
  })

  function updateStatus(id, newStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    )
    if (selected?.id === id) {
      setSelected((prev) => ({ ...prev, status: newStatus }))
    }
    toast({
      type: 'success',
      title: 'Status Updated',
      message: `Order #${id} is now "${newStatus}"`,
    })
  }

  return (
    <AdminShell title="Orders">
      <div className="flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-syne)] text-white font-bold text-2xl">
              All Orders
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {orders.length} total orders
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID or customer name..."
              className="w-full bg-[#0d1f3c] border border-[#1A3A6B]/60 hover:border-[#F97316]/40 focus:border-[#F97316] text-white placeholder-slate-600 text-sm pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-300"
            />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#0d1f3c] border border-[#1A3A6B]/60 hover:border-[#F97316]/40 focus:border-[#F97316] text-white text-sm pl-10 pr-8 py-3 rounded-xl outline-none transition-all duration-300 cursor-pointer appearance-none"
            >
              {allStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1A3A6B]/40">
                  {['Order ID', 'Customer', 'Route', 'Service', 'Status', 'Amount', 'Date', ''].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-slate-500 text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A3A6B]/30">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500 text-sm">
                      No orders found matching your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => {
                    const StatusIcon = statusIcons[order.status]
                    return (
                      <tr key={order.id} className="hover:bg-[#1A3A6B]/20 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <span className="font-[family-name:var(--font-syne)] text-[#F97316] font-bold text-sm">
                            #{order.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white text-sm font-medium whitespace-nowrap">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-sm whitespace-nowrap">
                          {order.from} → {order.to}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-300 text-xs bg-[#1A3A6B]/50 px-2.5 py-1 rounded-full">
                            {order.service}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {/* Inline status dropdown */}
                          <select
                            value={order.status}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer outline-none transition-all duration-200 ${statusStyles[order.status]} bg-transparent`}
                          >
                            {editableStatuses.map((s) => (
                              <option key={s} value={s} className="bg-[#0d1f3c] text-white">
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-white text-sm font-semibold">
                          {order.amount}
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm whitespace-nowrap">
                          {order.date}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelected(order)}
                            className="w-8 h-8 rounded-lg bg-[#1A3A6B]/50 hover:bg-[#F97316]/20 hover:text-[#F97316] text-slate-400 flex items-center justify-center transition-all duration-200"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <div className="relative bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-3xl p-8 w-full max-w-md flex flex-col gap-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-[family-name:var(--font-syne)] text-white font-bold text-xl">
                  Order #{selected.id}
                </h3>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-lg bg-[#1A3A6B]/50 hover:bg-red-500/20 hover:text-red-400 text-slate-400 flex items-center justify-center transition-all duration-200"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  { label: 'Customer', value: selected.customer },
                  { label: 'Phone', value: selected.phone },
                  { label: 'From', value: selected.from },
                  { label: 'To', value: selected.to },
                  { label: 'Service', value: selected.service },
                  { label: 'Amount', value: selected.amount },
                  { label: 'Date', value: selected.date },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-[#1A3A6B]/30 last:border-0">
                    <span className="text-slate-500 text-sm">{label}</span>
                    <span className="text-white text-sm font-medium">{value}</span>
                  </div>
                ))}

                {/* Status update inside modal */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500 text-sm">Status</span>
                  <select
                    value={selected.status}
                    onChange={(e) => updateStatus(selected.id, e.target.value)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border cursor-pointer outline-none transition-all duration-200 ${statusStyles[selected.status]} bg-transparent`}
                  >
                    {editableStatuses.map((s) => (
                      <option key={s} value={s} className="bg-[#0d1f3c] text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminShell>
  )
}