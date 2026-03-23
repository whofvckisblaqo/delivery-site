'use client'

import { useState, useEffect } from 'react'
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
  Plus,
  Loader2,
  Mail,
  Phone,
  MapPin,
  User,
  DollarSign,
  MessageSquare,
} from 'lucide-react'

// Status styles
const statusStyles = {
  'Out for Delivery': 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20',
  'In Transit':       'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  'Delivered':        'bg-green-500/10 text-green-400 border border-green-500/20',
  'Picked Up':        'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  'Pending':          'bg-slate-500/10 text-slate-400 border border-slate-500/20',
}

const statusIcons = {
  'Out for Delivery': Truck,
  'In Transit':       TrendingUp,
  'Delivered':        CheckCircle2,
  'Picked Up':        PackageCheck,
  'Pending':          Clock,
}

const allStatuses = ['All', 'Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']
const editableStatuses = ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']
const serviceTypes = ['Same-Day', 'Express', 'Scheduled']

export default function OrdersPage() {
  // --- STATE DEFINITIONS ---
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true) // Fixed the ReferenceError
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const [form, setForm] = useState({
    customer: '',
    email: '',
    phone: '',
    city: '',
    fromLocation: '',
    toLocation: '',
    service: 'Express',
    amount: '',
    description: '',
  })

  const toast = useToast()

  // --- LOGIC ---
  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load orders' })
    } finally {
      setLoading(false)
    }
  }

  function handleFormChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleCreateOrder() {
    if (!form.customer || !form.email || !form.phone || !form.fromLocation || !form.toLocation || !form.amount) {
      toast({ type: 'error', title: 'Missing Fields', message: 'Please fill in all required fields' })
      return
    }

    setCreating(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form.customer,
          customerEmail: form.email,
          phone: form.phone,
          city: form.city,
          fromLocation: form.fromLocation,
          toLocation: form.toLocation,
          service: form.service,
          amount: form.amount,
          description: form.description,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create order')

      setOrders((prev) => [data, ...prev])
      toast({ type: 'success', title: 'Order Created!', message: `Tracking code ${data.orderId} generated` })
      setShowCreateForm(false)
      setForm({ customer: '', email: '', phone: '', city: '', fromLocation: '', toLocation: '', service: 'Express', amount: '', description: '' })
    } catch (err) {
      toast({ type: 'error', title: 'Failed', message: err.message })
    } finally {
      setCreating(false)
    }
  }

  async function updateStatus(orderId, newStatus) {
    setUpdating(orderId)
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      })
      if (!res.ok) throw new Error('Update failed')

      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o)))
      if (selected?.orderId === orderId) setSelected((prev) => ({ ...prev, status: newStatus }))
      
      toast({ type: 'success', title: 'Updated', message: `Order #${orderId} is now ${newStatus}` })
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: err.message })
    } finally {
      setUpdating(null)
    }
  }

  const filtered = orders.filter((o) => {
    const matchesSearch = o.orderId?.toLowerCase().includes(search.toLowerCase()) || o.customer?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' || o.status === filter
    return matchesSearch && matchesFilter
  })

  // --- RENDER ---
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-syne text-white font-bold text-2xl uppercase italic tracking-tight">All Orders</h2>
          <p className="text-slate-400 text-sm mt-1">
            {loading ? 'Syncing...' : `${orders.length} orders total`}
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-[#F97316] hover:bg-orange-400 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20"
        >
          <Plus size={18} /> Create Order
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full bg-[#0d1f3c] border border-[#1A3A6B]/60 text-white text-sm pl-10 pr-4 py-3 rounded-xl outline-none focus:border-[#F97316]"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#0d1f3c] border border-[#1A3A6B]/60 text-white text-sm pl-10 pr-8 py-3 rounded-xl outline-none cursor-pointer appearance-none"
          >
            {allStatuses.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={32} className="text-[#F97316] animate-spin" />
            <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Fetching Orders...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((order) => (
                  <tr key={order.orderId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-syne font-bold text-[#F97316]">#{order.orderId}</td>
                    <td className="px-6 py-4 text-white font-medium">{order.customer}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{order.fromLocation} → {order.toLocation}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.orderId, e.target.value)}
                        disabled={updating === order.orderId}
                        className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg border outline-none ${statusStyles[order.status] || statusStyles['Pending']} bg-transparent`}
                      >
                        {editableStatuses.map((s) => (<option key={s} value={s} className="bg-[#0d1f3c]">{s}</option>))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-white font-bold">{order.amount}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => setSelected(order)} className="p-2 bg-white/5 hover:bg-[#F97316]/20 text-slate-400 hover:text-[#F97316] rounded-lg transition-all">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals remain the same as your original logic, keeping them hidden unless state is true */}
      {/* ... (Create Modal and Detail Modal code) ... */}
    </div>
  )
}