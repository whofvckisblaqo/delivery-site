'use client'

import { useState, useEffect } from 'react'
// REMOVED: AdminShell import
import { useToast } from '@/components/ToastProvider'
import {
  Search, Truck, CheckCircle2, Clock, TrendingUp,
  PackageCheck, CheckCheck, Loader2, Mail, MessageSquare,
  X, Send,
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
    // REPLACED AdminShell with a standard div
    <div className="flex flex-col gap-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-syne text-white font-bold text-2xl uppercase italic tracking-tight">
              Tracking Updates
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Change status below — customer is emailed automatically
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 px-4 py-2 rounded-xl w-fit shadow-lg shadow-orange-500/5">
            <Mail size={14} className="text-[#F97316]" />
            <span className="text-[#F97316] text-xs font-bold uppercase tracking-wider">
              Auto-Notification Active
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
            className="w-full bg-[#0d1f3c] border border-[#1A3A6B]/60 hover:border-[#F97316]/40 focus:border-[#F97316] text-white placeholder-slate-600 text-sm pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-300 shadow-xl"
          />
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2 size={24} className="text-[#F97316] animate-spin" />
            <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Loading Live Data...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-[#0d1f3c]/30 rounded-3xl border border-dashed border-[#1A3A6B]/40">
            <p className="text-slate-500 text-sm font-medium italic">No tracking records found.</p>
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
                  className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5 hover:border-[#F97316]/30 transition-all duration-300 shadow-xl group"
                >
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-syne text-[#F97316] font-bold text-sm tracking-widest">
                        #{order.orderId}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${
                        statusStyles[order.status] || statusStyles['Pending']
                      }`}>
                        <StatusIcon size={10} />
                        {order.status}
                      </span>
                      {order.customerEmail && (
                        <span className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase tracking-tighter">
                          <Mail size={10} />
                          {order.customerEmail}
                        </span>
                      )}
                    </div>
                    <p className="text-white text-base font-bold">{order.customer}</p>
                    <p className="text-slate-500 text-xs font-medium">
                      {order.fromLocation} <span className="text-orange-500 px-1">→</span> {order.toLocation}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.orderId, e.target.value)}
                        disabled={isUpdating}
                        className="bg-[#0A1628] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] disabled:opacity-50 text-white text-xs font-bold px-4 py-3 pr-8 rounded-xl outline-none transition-all cursor-pointer appearance-none shadow-inner"
                      >
                        {allStatuses.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {isUpdating ? (
                        <Loader2 size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#F97316] animate-spin" />
                      ) : (
                        <TrendingUp size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                      )}
                    </div>

                    <button
                      onClick={() => { setMessageModal(order); setAdminMessage('') }}
                      className="w-10 h-10 rounded-xl bg-[#1A3A6B]/50 hover:bg-[#F97316]/20 hover:text-[#F97316] text-slate-400 flex items-center justify-center transition-all shrink-0 border border-white/5"
                    >
                      <MessageSquare size={16} />
                    </button>

                    <div className={`flex items-center gap-1 text-[10px] font-black uppercase text-green-400 transition-all duration-500 ${
                      isSaved ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
                    }`}>
                      <CheckCheck size={14} /> Saved
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Message Modal ── */}
        {messageModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setMessageModal(null)} />
            <div className="relative bg-[#0d1f3c] border border-white/5 rounded-3xl p-8 w-full max-w-md flex flex-col gap-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-syne text-white font-bold text-xl uppercase tracking-tight">Direct Message</h3>
                <button onClick={() => setMessageModal(null)} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors"><X size={20} /></button>
              </div>

              <div className="bg-[#0A1628] rounded-2xl p-4 border border-white/5 space-y-2">
                <div className="flex justify-between"><span className="text-slate-500 text-[10px] uppercase font-black">ID</span><span className="text-orange-500 font-bold text-xs">#{messageModal.orderId}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 text-[10px] uppercase font-black">To</span><span className="text-white font-bold text-xs">{messageModal.customer}</span></div>
              </div>

              <textarea
                value={adminMessage}
                onChange={e => setAdminMessage(e.target.value)}
                rows={4}
                placeholder="Type your update here..."
                className="bg-[#0A1628] border border-[#1A3A6B] focus:border-[#F97316] text-white p-4 rounded-2xl outline-none transition-all resize-none text-sm shadow-inner"
              />

              <button
                onClick={sendMessage}
                disabled={sending || !adminMessage.trim()}
                className="flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-orange-500/20"
              >
                {sending ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Push Notification</>}
              </button>
            </div>
          </div>
        )}
    </div>
  )
}