'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/AdminShell'
import { useToast } from '@/components/ToastProvider'
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  TrendingUp,
  PackageCheck,
  CheckCheck,
  Loader2,
  Mail,
  MessageSquare,
  X,
  Send,
} from 'lucide-react'

const allStatuses = [
  'Pending',
  'Picked Up',
  'In Transit',
  'Out for Delivery',
  'Delivered',
]

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

export default function AdminTrackingPage() {
  const [orders,       setOrders]       = useState([])
  const [loading,      setLoading]      = useState(true)
  const [updating,     setUpdating]     = useState(null)
  const [saved,        setSaved]        = useState(null)
  const [search,       setSearch]       = useState('')
  const [messageModal, setMessageModal] = useState(null)
  const [adminMessage, setAdminMessage] = useState('')
  const [sending,      setSending]      = useState(false)

  const toast = useToast()

  useEffect(() => { fetchTracking() }, [])

  // ── Fetch all tracking records ─────────────────────────────────────────
  async function fetchTracking() {
    try {
      const res  = await fetch('/api/tracking')
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch {
      toast({ type: 'error', title: 'Error', message: 'Could not load tracking data' })
    } finally {
      setLoading(false)
    }
  }

  // ── Update status → saves to DB + emails customer ──────────────────────
  async function updateStatus(order_id, newStatus) {
    setUpdating(order_id)
    try {
      const res    = await fetch('/api/tracking', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ order_id, status: newStatus }),
      })
      const result = await res.json()

      if (!res.ok) throw new Error(result.error || 'Update failed')

      // Update local state immediately so UI reflects change
      setOrders(prev =>
        prev.map(o => o.orderId === order_id ? { ...o, status: newStatus } : o)
      )

      setSaved(order_id)
      setTimeout(() => setSaved(null), 2500)

      toast({
        type:    'success',
        title:   'Status Updated',
        message: result.emailSent
          ? `Order #${order_id} → "${newStatus}" • Email sent ✉️`
          : `Order #${order_id} → "${newStatus}"`,
      })

    } catch (err) {
      toast({ type: 'error', title: 'Update Failed', message: err.message })
    } finally {
      setUpdating(null)
    }
  }

  // ── Send custom message to customer ────────────────────────────────────
  async function sendMessage() {
    if (!adminMessage.trim()) return
    setSending(true)
    try {
      const res    = await fetch('/api/tracking', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          order_id: messageModal.orderId,
          message:  adminMessage,
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to send')

      setMessageModal(null)
      setAdminMessage('')
      toast({
        type:    'success',
        title:   'Message Sent',
        message: `Message sent to ${messageModal.customerEmail} ✉️`,
      })
    } catch (err) {
      toast({ type: 'error', title: 'Failed', message: err.message })
    } finally {
      setSending(false)
    }
  }

  const filtered = orders.filter(o =>
    o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminShell title="Tracking Updates">
      <div className="flex flex-col gap-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-syne)] text-white font-bold text-2xl">
              Tracking Updates
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Change status below — customer is emailed automatically
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 px-4 py-2 rounded-full w-fit">
            <Mail size={14} className="text-[#F97316]" />
            <span className="text-slate-300 text-xs font-medium">
              Auto email on every update
            </span>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or customer..."
            className="w-full bg-[#0d1f3c] border border-[#1A3A6B]/60 hover:border-[#F97316]/40 focus:border-[#F97316] text-white placeholder-slate-600 text-sm pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-300"
          />
        </div>

        {/* ── Loading ── */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2 size={20} className="text-[#F97316] animate-spin" />
            <span className="text-slate-400 text-sm">Loading...</span>
          </div>

        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-sm">No orders found.</p>
          </div>

        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(order => {
              const StatusIcon = statusIcons[order.status] || Clock
              const isSaved    = saved    === order.orderId
              const isUpdating = updating === order.orderId

              return (
                <div
                  key={order.orderId}
                  className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5 hover:border-[#F97316]/20 transition-all duration-300"
                >

                  {/* Order info */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-[family-name:var(--font-syne)] text-[#F97316] font-bold text-sm">
                        #{order.orderId}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                        statusStyles[order.status] || statusStyles['Pending']
                      }`}>
                        <StatusIcon size={11} />
                        {order.status}
                      </span>
                      {order.customerEmail && (
                        <span className="flex items-center gap-1 text-slate-500 text-xs">
                          <Mail size={10} />
                          {order.customerEmail}
                        </span>
                      )}
                    </div>
                    <p className="text-white text-sm font-medium">{order.customer}</p>
                    <p className="text-slate-500 text-xs">
                      {order.fromLocation} → {order.toLocation}
                    </p>
                    {order.estimate && (
                      <p className="text-slate-600 text-xs">ETA: {order.estimate}</p>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-3">

                    {/* Status dropdown */}
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.orderId, e.target.value)}
                        disabled={isUpdating}
                        className="bg-[#0A1628] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm px-4 py-2.5 pr-8 rounded-xl outline-none transition-all duration-300 cursor-pointer appearance-none"
                      >
                        {allStatuses.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {isUpdating && (
                        <Loader2
                          size={14}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#F97316] animate-spin pointer-events-none"
                        />
                      )}
                    </div>

                    {/* Message button */}
                    <button
                      onClick={() => { setMessageModal(order); setAdminMessage('') }}
                      className="w-9 h-9 rounded-xl bg-[#1A3A6B]/50 hover:bg-[#F97316]/20 hover:text-[#F97316] text-slate-400 flex items-center justify-center transition-all duration-200 shrink-0"
                      title="Send message to customer"
                    >
                      <MessageSquare size={15} />
                    </button>

                    {/* Saved confirmation */}
                    <div className={`flex items-center gap-1.5 text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                      isSaved ? 'text-green-400 opacity-100' : 'opacity-0 pointer-events-none'
                    }`}>
                      <CheckCheck size={14} />
                      Saved
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}

        {/* ── Message Modal ── */}
        {messageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMessageModal(null)}
            />
            <div className="relative bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-3xl p-8 w-full max-w-md flex flex-col gap-5 shadow-2xl">

              {/* Modal header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-[family-name:var(--font-syne)] text-white font-bold text-xl">
                    Message Customer
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    This message will be emailed to the customer
                  </p>
                </div>
                <button
                  onClick={() => setMessageModal(null)}
                  className="w-8 h-8 rounded-lg bg-[#1A3A6B]/50 hover:bg-red-500/20 hover:text-red-400 text-slate-400 flex items-center justify-center transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Order info */}
              <div className="bg-[#0A1628] rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs">Order</span>
                  <span className="text-[#F97316] font-bold text-sm">
                    #{messageModal.orderId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs">Customer</span>
                  <span className="text-white text-sm">{messageModal.customer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs">Email</span>
                  <span className="text-slate-300 text-xs">{messageModal.customerEmail}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs">Status</span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    statusStyles[messageModal.status] || statusStyles['Pending']
                  }`}>
                    {messageModal.status}
                  </span>
                </div>
              </div>

              {/* Message textarea */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                  Your Message
                </label>
                <textarea
                  value={adminMessage}
                  onChange={e => setAdminMessage(e.target.value)}
                  rows={4}
                  placeholder="e.g. Your package is delayed due to weather. We expect delivery by tomorrow morning."
                  className="bg-[#0A1628] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] text-white placeholder-slate-600 text-sm px-4 py-3 rounded-xl outline-none transition-all resize-none"
                />
              </div>

              {/* Send button */}
              <button
                onClick={sendMessage}
                disabled={sending || !adminMessage.trim()}
                className="flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95"
              >
                {sending ? (
                  <><Loader2 size={16} className="animate-spin" /> Sending...</>
                ) : (
                  <><Send size={16} /> Send Message</>
                )}
              </button>

            </div>
          </div>
        )}

      </div>
    </AdminShell>
  )
}