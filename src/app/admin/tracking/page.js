'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ToastProvider'
import {
  Search, Truck, CheckCircle2, Clock, TrendingUp,
  PackageCheck, CheckCheck, Loader2, Mail, MessageSquare,
  X, Send,
} from 'lucide-react'

const allStatuses = ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']

const statusStyles = {
  'Out for Delivery': 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
  'In Transit':       'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  'Delivered':        'bg-green-500/10 text-green-400 border border-green-500/20',
  'Picked Up':        'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  'Pending':          'bg-slate-500/10 text-slate-400 border border-slate-500/20',
}

export default function AdminTrackingPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [saved, setSaved] = useState(null)
  const [search, setSearch] = useState('')
  const [messageModal, setMessageModal] = useState(null)
  const [adminMessage, setAdminMessage] = useState('')
  const [sending, setSending] = useState(false)

  const toast = useToast()

  useEffect(() => { fetchTracking() }, [])

  async function fetchTracking() {
    setLoading(true)
    try {
      const res = await fetch('/api/tracking')
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch {
      toast({ type: 'error', title: 'Error', message: 'Failed to load tracking' })
    } finally { setLoading(false) }
  }

  async function updateStatus(order_id, newStatus) {
    setUpdating(order_id)
    try {
      const res = await fetch('/api/tracking', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id, status: newStatus }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      setOrders(prev => prev.map(o => o.orderId === order_id ? { ...o, status: newStatus } : o))
      setSaved(order_id)
      setTimeout(() => setSaved(null), 2000)
      toast({ type: 'success', title: 'Updated', message: `Customer notified of ${newStatus} status.` })
    } catch (err) {
      toast({ type: 'error', title: 'Failed', message: err.message })
    } finally { setUpdating(null) }
  }

  async function sendMessage() {
    if (!adminMessage.trim()) return
    setSending(true)
    try {
      const res = await fetch('/api/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: messageModal.orderId, message: adminMessage }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setMessageModal(null)
      setAdminMessage('')
      toast({ type: 'success', title: 'Sent', message: 'Email delivered to customer.' })
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: err.message })
    } finally { setSending(false) }
  }

  const filtered = orders.filter(o => 
    o.orderId?.toLowerCase().includes(search.toLowerCase()) || 
    o.customer?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-black font-syne uppercase italic">Live Tracking Updates</h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            className="w-full bg-[#0d1f3c] border border-white/5 p-3 pl-10 rounded-xl outline-none focus:border-orange-500"
            placeholder="Search Order ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>
        ) : filtered.map(order => (
          <div key={order.orderId} className="bg-[#0d1f3c] p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1">
              <span className="text-orange-500 font-bold font-syne">#{order.orderId}</span>
              <h4 className="text-white font-bold">{order.customer}</h4>
              <p className="text-slate-500 text-xs">{order.fromLocation} → {order.toLocation}</p>
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={order.status}
                onChange={e => updateStatus(order.orderId, e.target.value)}
                disabled={updating === order.orderId}
                className={`bg-[#0A1628] p-3 rounded-xl text-xs font-bold uppercase outline-none border border-white/5 ${statusStyles[order.status]}`}
              >
                {allStatuses.map(s => <option key={s} value={s} className="bg-[#0d1f3c]">{s}</option>)}
              </select>
              <button onClick={() => setMessageModal(order)} className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-orange-500 transition-all"><MessageSquare size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Message Modal */}
      {messageModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMessageModal(null)} />
          <div className="relative bg-[#0d1f3c] p-8 rounded-[2rem] border border-white/10 w-full max-w-md">
            <h3 className="text-lg font-black font-syne mb-4 uppercase">Message to {messageModal.customer}</h3>
            <textarea 
              className="w-full bg-[#0A1628] p-4 rounded-xl text-white outline-none border border-white/5 mb-4 h-32"
              placeholder="Your custom update message..."
              value={adminMessage}
              onChange={e => setAdminMessage(e.target.value)}
            />
            <button 
              disabled={sending}
              onClick={sendMessage}
              className="w-full bg-orange-500 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {sending ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Update Email</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}