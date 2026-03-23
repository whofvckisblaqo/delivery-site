'use client'

import { useState, useEffect } from 'react'
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
  Plus,
  Loader2,
  Mail,
  Phone,
  MapPin,
  User,
  DollarSign,
  MessageSquare,
} from 'lucide-react'

// Status badge styles for each delivery status
const statusStyles = {
  'Out for Delivery': 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20',
  'In Transit':       'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  'Delivered':        'bg-green-500/10 text-green-400 border border-green-500/20',
  'Picked Up':        'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  'Pending':          'bg-slate-500/10 text-slate-400 border border-slate-500/20',
}

// Icon for each delivery status
const statusIcons = {
  'Out for Delivery': Truck,
  'In Transit':       TrendingUp,
  'Delivered':        CheckCircle2,
  'Picked Up':        PackageCheck,
  'Pending':          Clock,
}

// Filter options for the status dropdown
const allStatuses = ['All', 'Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']

// Options admin can set when updating status
const editableStatuses = ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']

// Service type options
const serviceTypes = ['Same-Day', 'Express', 'Scheduled']

export default function OrdersPage() {
  // All orders fetched from the database
  const [orders, setOrders] = useState([])

  // True while fetching orders from database
  const [loading, setLoading] = useState(true)

  // True while creating a new order
  const [creating, setCreating] = useState(false)

  // True while updating an order status
  const [updating, setUpdating] = useState(null)

  // Current search input value
  const [search, setSearch] = useState('')

  // Current status filter value
  const [filter, setFilter] = useState('All')

  // The order currently shown in the detail modal
  const [selected, setSelected] = useState(null)

  // Whether the Create Order form modal is open
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Form fields for creating a new order
  const [form, setForm] = useState({
    customer: '',        // Receiver name
    email: '',           // Receiver email — tracking code sent here
    phone: '',           // Receiver phone number
    city: '',            // Receiver city
    fromLocation: '',    // Pickup address
    toLocation: '',      // Destination address
    service: 'Express',  // Service type
    amount: '',          // Delivery price
    description: '',     // Order description / comment
  })

  // Get toast notification function from context
  const toast = useToast()

  // Fetch all orders from database when page loads
  useEffect(() => {
    fetchOrders()
  }, [])

  // ─── Fetch all orders from the API ──────────────────────────────────────────
  async function fetchOrders() {
    try {
      // Call GET /api/orders — returns all orders from database
      const res = await fetch('/api/orders')
      const data = await res.json()
      // Make sure it is an array before setting state
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load orders' })
    } finally {
      setLoading(false) // Always stop spinner
    }
  }

  // ─── Handle form field changes ───────────────────────────────────────────────
  function handleFormChange(e) {
    // Update only the field that changed
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // ─── Create a new order ──────────────────────────────────────────────────────
  // This sends the form data to the API which:
  // 1. Auto-generates a tracking code like FD847392
  // 2. Saves order to database
  // 3. Creates tracking record in database
  // 4. Sends confirmation email to customer with their tracking code
  async function handleCreateOrder() {
    // Validate required fields before submitting
    if (
      !form.customer ||
      !form.email ||
      !form.phone ||
      !form.fromLocation ||
      !form.toLocation ||
      !form.amount
    ) {
      toast({
        type: 'error',
        title: 'Missing Fields',
        message: 'Please fill in all required fields marked with *',
      })
      return
    }

    setCreating(true) // Show spinner on submit button

    try {
      // Call POST /api/orders with the form data
      const res = await fetch('/api/orders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer:      form.customer,
          customerEmail: form.email,       // Email where tracking code is sent
          phone:         form.phone,
          city:          form.city,
          fromLocation:  form.fromLocation,
          toLocation:    form.toLocation,
          service:       form.service,
          amount:        form.amount,
          description:   form.description,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to create order')

      // Add the new order to the top of the local list
      // so it appears immediately without refetching
      setOrders((prev) => [data, ...prev])

      // Show success message with the generated tracking code
      toast({
        type:    'success',
        title:   'Order Created!',
        message: `Tracking code ${data.orderId} sent to ${form.email} ✉️`,
      })

      // Reset the form fields
      setForm({
        customer: '', email: '', phone: '', city: '',
        fromLocation: '', toLocation: '', service: 'Express',
        amount: '', description: '',
      })

      // Close the create form modal
      setShowCreateForm(false)

    } catch (err) {
      toast({ type: 'error', title: 'Failed', message: err.message })
    } finally {
      setCreating(false) // Always stop spinner
    }
  }

  // ─── Update an order's status ────────────────────────────────────────────────
  async function updateStatus(orderId, newStatus) {
    setUpdating(orderId) // Show spinner on this specific row

    try {
      // Call PATCH /api/orders to update the status in database
      const res = await fetch('/api/orders', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ orderId, status: newStatus }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Update failed')

      // Update local state so UI reflects change immediately
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
      )

      // Also update the selected modal if it is open for this order
      if (selected?.orderId === orderId) {
        setSelected((prev) => ({ ...prev, status: newStatus }))
      }

      toast({
        type:    'success',
        title:   'Status Updated',
        message: `Order #${orderId} is now "${newStatus}"`,
      })
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: err.message })
    } finally {
      setUpdating(null) // Always clear spinner
    }
  }

  // Filter orders based on search input and status filter
  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' || o.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <AdminShell title="Orders">
      <div className="flex flex-col gap-6">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-syne)] text-white font-bold text-2xl">
              All Orders
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {/* Show count from database */}
              {loading ? 'Loading...' : `${orders.length} total orders`}
            </p>
          </div>

          {/* Create Order button — opens the form modal */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-[#F97316] hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95"
          >
            <Plus size={18} />
            Create Order
          </button>
        </div>

        {/* ── Search and Filter ── */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search input */}
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

          {/* Status filter dropdown */}
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

        {/* ── Orders Table ── */}
        <div className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-2xl overflow-hidden">

          {/* Show spinner while loading */}
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3">
              <Loader2 size={20} className="text-[#F97316] animate-spin" />
              <span className="text-slate-400 text-sm">Loading orders...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1A3A6B]/40">
                    {['Order ID', 'Customer', 'Route', 'Service', 'Status', 'Amount', 'Date', ''].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-slate-500 text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A3A6B]/30">
                  {filtered.length === 0 ? (
                    // Empty state
                    <tr>
                      <td colSpan={8} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <PackageCheck size={32} className="text-slate-600" />
                          <p className="text-slate-500 text-sm">No orders found</p>
                          <button
                            onClick={() => setShowCreateForm(true)}
                            className="text-[#F97316] text-xs hover:underline"
                          >
                            + Create your first order
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order) => {
                      // Get icon for this order's status
                      const StatusIcon = statusIcons[order.status] || Clock
                      // Whether this row is currently updating
                      const isUpdating = updating === order.orderId

                      return (
                        <tr
                          key={order.orderId}
                          className="hover:bg-[#1A3A6B]/20 transition-colors duration-200"
                        >
                          {/* Order ID */}
                          <td className="px-6 py-4">
                            <span className="font-[family-name:var(--font-syne)] text-[#F97316] font-bold text-sm">
                              #{order.orderId}
                            </span>
                          </td>

                          {/* Customer name */}
                          <td className="px-6 py-4 text-white text-sm font-medium whitespace-nowrap">
                            {order.customer}
                          </td>

                          {/* Route from → to */}
                          <td className="px-6 py-4 text-slate-400 text-sm whitespace-nowrap">
                            {order.fromLocation} → {order.toLocation}
                          </td>

                          {/* Service type badge */}
                          <td className="px-6 py-4">
                            <span className="text-slate-300 text-xs bg-[#1A3A6B]/50 px-2.5 py-1 rounded-full">
                              {order.service}
                            </span>
                          </td>

                          {/* Status dropdown — inline editable */}
                          <td className="px-6 py-4">
                            <div className="relative">
                              <select
                                value={order.status}
                                onChange={(e) => updateStatus(order.orderId, e.target.value)}
                                disabled={isUpdating} // Disable while saving
                                className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer outline-none transition-all duration-200 disabled:opacity-50 ${
                                  statusStyles[order.status] || statusStyles['Pending']
                                } bg-transparent`}
                              >
                                {editableStatuses.map((s) => (
                                  <option key={s} value={s} className="bg-[#0d1f3c] text-white">
                                    {s}
                                  </option>
                                ))}
                              </select>
                              {/* Spinner while this row is updating */}
                              {isUpdating && (
                                <Loader2 size={10} className="absolute -right-4 top-1/2 -translate-y-1/2 text-[#F97316] animate-spin" />
                              )}
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="px-6 py-4 text-white text-sm font-semibold">
                            {order.amount}
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 text-slate-500 text-sm whitespace-nowrap">
                            {order.date}
                          </td>

                          {/* View detail button */}
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
          )}
        </div>

        {/* ── Create Order Modal ── */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Dark backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowCreateForm(false)}
            />

            {/* Modal card */}
            <div className="relative bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-3xl p-8 w-full max-w-2xl flex flex-col gap-6 shadow-2xl max-h-[90vh] overflow-y-auto">

              {/* Modal header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-[family-name:var(--font-syne)] text-white font-bold text-xl">
                    Create New Order
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Tracking code will be auto-generated and emailed to the customer
                  </p>
                </div>
                {/* Close button */}
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="w-8 h-8 rounded-lg bg-[#1A3A6B]/50 hover:bg-red-500/20 hover:text-red-400 text-slate-400 flex items-center justify-center transition-all duration-200"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Email notice */}
              <div className="flex items-center gap-3 bg-[#F97316]/10 border border-[#F97316]/20 rounded-xl px-4 py-3">
                <Mail size={16} className="text-[#F97316] shrink-0" />
                <p className="text-slate-300 text-xs leading-relaxed">
                  Once you create this order, the customer will automatically receive an email
                  with their unique tracking code to track their delivery.
                </p>
              </div>

              {/* ── Form Fields ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Receiver Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <User size={11} />
                    Receiver Name <span className="text-[#F97316]">*</span>
                  </label>
                  <input
                    type="text"
                    name="customer"
                    value={form.customer}
                    onChange={handleFormChange}
                    placeholder="e.g. John Smith"
                    className="bg-[#0A1628] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] text-white placeholder-slate-600 text-sm px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:shadow-lg focus:shadow-[#F97316]/10"
                  />
                </div>

                {/* Receiver Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <Mail size={11} />
                    Receiver Email <span className="text-[#F97316]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    placeholder="customer@email.com"
                    className="bg-[#0A1628] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] text-white placeholder-slate-600 text-sm px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:shadow-lg focus:shadow-[#F97316]/10"
                  />
                </div>

                {/* Receiver Phone */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <Phone size={11} />
                    Receiver Phone <span className="text-[#F97316]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    placeholder="+1 (555) 000-0000"
                    className="bg-[#0A1628] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] text-white placeholder-slate-600 text-sm px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:shadow-lg focus:shadow-[#F97316]/10"
                  />
                </div>

                {/* Receiver City */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={11} />
                    Receiver City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleFormChange}
                    placeholder="e.g. New York, NY"
                    className="bg-[#0A1628] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] text-white placeholder-slate-600 text-sm px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:shadow-lg focus:shadow-[#F97316]/10"
                  />
                </div>

                {/* Pickup Address */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={11} className="text-green-400" />
                    Pickup Address <span className="text-[#F97316]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fromLocation"
                    value={form.fromLocation}
                    onChange={handleFormChange}
                    placeholder="e.g. Manhattan, NY"
                    className="bg-[#0A1628] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] text-white placeholder-slate-600 text-sm px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:shadow-lg focus:shadow-[#F97316]/10"
                  />
                </div>

                {/* Destination Address */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={11} className="text-[#F97316]" />
                    Destination <span className="text-[#F97316]">*</span>
                  </label>
                  <input
                    type="text"
                    name="toLocation"
                    value={form.toLocation}
                    onChange={handleFormChange}
                    placeholder="e.g. Brooklyn, NY"
                    className="bg-[#0A1628] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] text-white placeholder-slate-600 text-sm px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:shadow-lg focus:shadow-[#F97316]/10"
                  />
                </div>

                {/* Service Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <Truck size={11} />
                    Service Type <span className="text-[#F97316]">*</span>
                  </label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleFormChange}
                    className="bg-[#0A1628] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] text-white text-sm px-4 py-3 rounded-xl outline-none transition-all duration-300 cursor-pointer"
                  >
                    {serviceTypes.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign size={11} />
                    Amount <span className="text-[#F97316]">*</span>
                  </label>
                  <input
                    type="text"
                    name="amount"
                    value={form.amount}
                    onChange={handleFormChange}
                    placeholder="e.g. $25.00"
                    className="bg-[#0A1628] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] text-white placeholder-slate-600 text-sm px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:shadow-lg focus:shadow-[#F97316]/10"
                  />
                </div>
              </div>

              {/* Description / Comment — full width */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare size={11} />
                  Description / Comment
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Any special instructions or notes about this delivery..."
                  className="bg-[#0A1628] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] text-white placeholder-slate-600 text-sm px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:shadow-lg focus:shadow-[#F97316]/10 resize-none"
                />
              </div>

              {/* Form action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">

                {/* Cancel button */}
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 border border-[#1A3A6B] hover:border-[#F97316]/40 text-slate-300 hover:text-white font-semibold py-3 rounded-full transition-all duration-300 hover:bg-[#1A3A6B]/30"
                >
                  Cancel
                </button>

                {/* Submit button — shows spinner while creating */}
                <button
                  onClick={handleCreateOrder}
                  disabled={creating}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95"
                >
                  {creating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <Mail size={16} />
                      Create & Send Tracking Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Order Detail Modal ── */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <div className="relative bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-3xl p-8 w-full max-w-md flex flex-col gap-6 shadow-2xl">

              {/* Modal header */}
              <div className="flex items-center justify-between">
                <h3 className="font-[family-name:var(--font-syne)] text-white font-bold text-xl">
                  Order #{selected.orderId}
                </h3>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-lg bg-[#1A3A6B]/50 hover:bg-red-500/20 hover:text-red-400 text-slate-400 flex items-center justify-center transition-all duration-200"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Tracking code box — shows the code customer uses */}
              <div className="bg-[#0A1628] border border-[#F97316]/30 rounded-2xl p-4 text-center">
                <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">
                  Tracking Code
                </p>
                {/* Big bold tracking code */}
                <p className="font-[family-name:var(--font-syne)] text-[#F97316] text-2xl font-extrabold tracking-widest">
                  {selected.orderId}
                </p>
                <p className="text-slate-600 text-xs mt-1">
                  Customer uses this to track their order
                </p>
              </div>

              {/* Order details list */}
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Customer',     value: selected.customer },
                  { label: 'Email',        value: selected.customerEmail },
                  { label: 'Phone',        value: selected.phone },
                  { label: 'From',         value: selected.fromLocation },
                  { label: 'To',           value: selected.toLocation },
                  { label: 'Service',      value: selected.service },
                  { label: 'Amount',       value: selected.amount },
                  { label: 'Date',         value: selected.date },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2 border-b border-[#1A3A6B]/30 last:border-0"
                  >
                    <span className="text-slate-500 text-sm">{label}</span>
                    <span className="text-white text-sm font-medium text-right max-w-[60%] truncate">
                      {value || '—'}
                    </span>
                  </div>
                ))}

                {/* Status dropdown inside modal */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500 text-sm">Status</span>
                  <select
                    value={selected.status}
                    onChange={(e) => updateStatus(selected.orderId, e.target.value)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border cursor-pointer outline-none transition-all duration-200 ${
                      statusStyles[selected.status] || statusStyles['Pending']
                    } bg-transparent`}
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