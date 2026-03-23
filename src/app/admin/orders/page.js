'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ToastProvider'
import {
  PackageCheck, Truck, CheckCircle2, Clock, TrendingUp, Search, 
  Filter, Eye, X, Plus, Loader2, Mail, Phone, MapPin, 
  User, DollarSign, MessageSquare,
} from 'lucide-react'

// Styles for the status badges
const statusStyles = {
  'Out for Delivery': 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
  'In Transit':       'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  'Delivered':        'bg-green-500/10 text-green-400 border border-green-500/20',
  'Picked Up':        'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  'Pending':          'bg-slate-500/10 text-slate-400 border border-slate-500/20',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const [form, setForm] = useState({
    customer: '', email: '', phone: '', city: '',
    fromLocation: '', toLocation: '', service: 'Express',
    amount: '', description: '',
  })

  const toast = useToast()

  // 1. LOAD ORDERS ON MOUNT
  useEffect(() => { fetchOrders() }, [])

  async function fetchOrders() {
    setLoading(true)
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      // Show newest orders at the top
      setOrders(Array.isArray(data) ? data.sort((a, b) => b.id - a.id) : [])
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Database connection failed' })
    } finally { setLoading(false) }
  }

  // 2. CREATE ORDER + IMMEDIATE "PENDING" EMAIL
  async function handleCreateOrder() {
    if (!form.customer || !form.email || !form.amount) {
      toast({ type: 'error', title: 'Missing Info', message: 'Fill Name, Email, and Amount.' })
      return
    }

    setCreating(true)
    try {
      // Clean amount and add Dollar sign
      const cleanAmount = form.amount.replace(/[$,]/g, '');
      const formattedAmount = `$${cleanAmount}`;

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
          amount: formattedAmount,
          description: form.description,
          date: new Date().toLocaleDateString()
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Server rejected order')

      // TRIGGER IMMEDIATE EMAIL (Status: Pending)
      try {
        await fetch('/api/send-general', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: form.email,
            subject: `Shipment Confirmed: #${data.orderId}`,
            message: `Hello ${form.customer}, your shipment #${data.orderId} has been successfully registered. Currently, your package status is: PENDING. We will notify you once it is picked up.`
          }),
        })
      } catch (e) { console.error("Initial email dispatch failed") }

      setOrders(prev => [data, ...prev])
      setShowCreateForm(false)
      toast({ type: 'success', title: 'Order Live', message: `Order #${data.orderId} created & notified.` })
      
      // Reset Form
      setForm({ customer: '', email: '', phone: '', city: '', fromLocation: '', toLocation: '', service: 'Express', amount: '', description: '' })
    } catch (err) {
      toast({ type: 'error', title: 'Action Failed', message: err.message })
    } finally { setCreating(false) }
  }

  // 3. UPDATE STATUS + DYNAMIC TRACKING EMAIL
  async function updateStatus(orderId, newStatus) {
    setUpdating(orderId)
    try {
      // Update Database
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      })
      
      if (!res.ok) throw new Error('Database sync failed')

      // Find customer info from local state for the email
      const order = orders.find(o => o.orderId === orderId)

      // TRIGGER TRACKING EMAIL (Restored)
      if (order && (order.customerEmail || order.email)) {
        try {
          await fetch('/api/send-general', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: order.customerEmail || order.email,
              subject: `Tracking Update: #${orderId}`,
              message: `Hello ${order.customer}, the status of your shipment #${orderId} has been updated to: ${newStatus.toUpperCase()}. You can track your package live on our portal.`
            }),
          })
        } catch (e) { console.error("Status update email failed") }
      }

      // Update UI
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o))
      toast({ type: 'success', title: 'Status Updated', message: `Shipment #${orderId} is now ${newStatus}` })
      
    } catch (err) {
      toast({ type: 'error', title: 'Update Error', message: err.message })
    } finally { setUpdating(null) }
  }

  // 4. SEARCH & FILTER
  const filtered = orders.filter(o => 
    (o.orderId?.toLowerCase().includes(search.toLowerCase()) || 
     o.customer?.toLowerCase().includes(search.toLowerCase())) &&
    (filter === 'All' || o.status === filter)
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black font-syne uppercase italic tracking-tighter">Command <span className="text-orange-500">Orders</span></h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Global Logistics Management</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="bg-orange-500 px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-2 hover:bg-orange-600 shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
        >
          <Plus size={18} /> New Shipment
        </button>
      </div>

      {/* SEARCH/FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 transition-colors" size={18} />
          <input 
            className="w-full bg-[#0d1f3c] border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-orange-500/50 text-sm shadow-inner"
            placeholder="Search by Tracking ID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          className="bg-[#0d1f3c] border border-white/5 p-4 rounded-2xl outline-none text-slate-400 font-bold text-xs uppercase cursor-pointer hover:border-white/10"
        >
          {['All', 'Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'].map(s => (
            <option key={s} value={s}>{s} Status</option>
          ))}
        </select>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-[#0d1f3c] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-32 flex flex-col items-center gap-4 text-center">
            <Loader2 className="animate-spin text-orange-500" size={48} />
            <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Secure Node</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] text-[10px] uppercase font-black tracking-widest text-slate-500 border-b border-white/5">
                  <th className="p-6">Tracking ID</th>
                  <th className="p-6">Customer</th>
                  <th className="p-6">Route</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Total Cost</th>
                  <th className="p-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(order => (
                  <tr key={order.orderId} className="hover:bg-white/[0.01] transition-all group">
                    <td className="p-6 font-syne font-black text-orange-500 tracking-wider">#{order.orderId}</td>
                    <td className="p-6">
                       <div className="font-bold text-white text-sm">{order.customer}</div>
                       <div className="text-[10px] text-slate-600 font-bold uppercase">{order.customerEmail}</div>
                    </td>
                    <td className="p-6">
                       <div className="text-white text-xs font-medium">{order.fromLocation} → {order.toLocation}</div>
                    </td>
                    <td className="p-6">
                      <select 
                        value={order.status}
                        disabled={updating === order.orderId}
                        onChange={(e) => updateStatus(order.orderId, e.target.value)}
                        className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border outline-none bg-transparent transition-all cursor-pointer ${statusStyles[order.status] || statusStyles['Pending']}`}
                      >
                        {['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'].map(s => (
                          <option key={s} value={s} className="bg-[#0d1f3c]">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-6 font-syne font-black text-white text-sm italic">{order.amount}</td>
                    <td className="p-6 text-right">
                      <button onClick={() => setSelected(order)} className="p-3 bg-white/5 hover:bg-orange-500/20 rounded-xl text-slate-500 hover:text-orange-500 transition-all">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- CREATE ORDER MODAL --- */}
      {showCreateForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowCreateForm(false)} />
          <div className="relative bg-[#0d1f3c] border border-white/10 rounded-[3rem] p-10 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-black font-syne uppercase italic mb-8 border-b border-white/5 pb-4 tracking-tighter">New Shipment Entry</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Customer Full Name</label>
                <input placeholder="Name" className="w-full bg-[#0A1628] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-orange-500" value={form.customer} onChange={e => setForm({...form, customer: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Contact Email</label>
                <input placeholder="email@address.com" className="w-full bg-[#0A1628] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-orange-500" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Shipping Fee</label>
                <div className="relative">
                   <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={16} />
                   <input placeholder="0.00" className="w-full bg-[#0A1628] border border-white/5 p-4 pl-10 rounded-2xl text-white outline-none focus:border-orange-500" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Phone Number</label>
                <input placeholder="+1 000" className="w-full bg-[#0A1628] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-orange-500" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Origin Location</label>
                <input placeholder="City, State" className="w-full bg-[#0A1628] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-orange-500" value={form.fromLocation} onChange={e => setForm({...form, fromLocation: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Destination Location</label>
                <input placeholder="City, State" className="w-full bg-[#0A1628] border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-orange-500" value={form.toLocation} onChange={e => setForm({...form, toLocation: e.target.value})} />
              </div>
            </div>

            <button 
              disabled={creating}
              onClick={handleCreateOrder} 
              className="w-full bg-orange-500 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/40 active:scale-95 disabled:opacity-50"
            >
              {creating ? <Loader2 className="animate-spin" size={20} /> : "Finalize & Notify Client"}
            </button>
          </div>
        </div>
      )}

      {/* --- DETAIL MODAL --- */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelected(null)} />
          <div className="relative bg-[#0d1f3c] border border-white/10 rounded-[2.5rem] p-10 w-full max-w-md shadow-3xl">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
              <div className="font-syne font-black uppercase text-2xl text-orange-500 italic tracking-tighter">#{selected.orderId}</div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-5">
              <div className="flex justify-between"><span className="text-slate-500 text-[10px] uppercase font-black">Customer</span><span className="text-white font-bold">{selected.customer}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 text-[10px] uppercase font-black">Route</span><span className="text-white font-bold">{selected.fromLocation} → {selected.toLocation}</span></div>
              <div className="flex justify-between border-t border-white/5 pt-5"><span className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Amount Paid</span><span className="text-orange-500 font-black font-syne text-lg">{selected.amount}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}