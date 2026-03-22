'use client'

import { useState } from 'react'
import AdminShell from '@/components/AdminShell'
import { Search, Users, PackageCheck, Eye, X } from 'lucide-react'

const allCustomers = [
  { id: 'C001', name: 'Amara Okafor', email: 'amara@email.com', phone: '+234 801 234 5678', city: 'Lagos', orders: 12, spent: '₦28,400', joined: 'Jan 2024', status: 'Active' },
  { id: 'C002', name: 'David Mensah', email: 'david@email.com', phone: '+234 802 345 6789', city: 'Abuja', orders: 8, spent: '₦9,600', joined: 'Feb 2024', status: 'Active' },
  { id: 'C003', name: 'Fatima Bello', email: 'fatima@email.com', phone: '+234 803 456 7890', city: 'Kano', orders: 5, spent: '₦6,500', joined: 'Mar 2024', status: 'Active' },
  { id: 'C004', name: 'Chidi Okonkwo', email: 'chidi@email.com', phone: '+234 804 567 8901', city: 'Enugu', orders: 20, spent: '₦24,000', joined: 'Jan 2024', status: 'Active' },
  { id: 'C005', name: 'Ngozi Eze', email: 'ngozi@email.com', phone: '+234 805 678 9012', city: 'Ibadan', orders: 3, spent: '₦2,400', joined: 'Apr 2024', status: 'Inactive' },
  { id: 'C006', name: 'Emeka Obi', email: 'emeka@email.com', phone: '+234 806 789 0123', city: 'Lagos', orders: 15, spent: '₦37,500', joined: 'Jan 2024', status: 'Active' },
  { id: 'C007', name: 'Aisha Suleiman', email: 'aisha@email.com', phone: '+234 807 890 1234', city: 'Kano', orders: 7, spent: '₦8,400', joined: 'Feb 2024', status: 'Active' },
  { id: 'C008', name: 'Tunde Adeyemi', email: 'tunde@email.com', phone: '+234 808 901 2345', city: 'Lagos', orders: 9, spent: '₦7,200', joined: 'Mar 2024', status: 'Inactive' },
]

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = allCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminShell title="Customers">
      <div className="flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-syne)] text-white font-bold text-2xl">
              All Customers
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {allCustomers.length} registered customers
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Users, label: 'Total Customers', value: allCustomers.length },
            { icon: PackageCheck, label: 'Active Customers', value: allCustomers.filter(c => c.status === 'Active').length },
            { icon: PackageCheck, label: 'Total Orders Placed', value: allCustomers.reduce((a, c) => a + c.orders, 0) },
          ].map(({ icon: Icon, label, value }, i) => (
            <div key={i} className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-2xl p-5 flex items-center gap-4 hover:border-[#F97316]/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center">
                <Icon size={18} className="text-[#F97316]" />
              </div>
              <div>
                <p className="font-[family-name:var(--font-syne)] text-white font-bold text-xl">{value}</p>
                <p className="text-slate-400 text-xs">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or city..."
            className="w-full bg-[#0d1f3c] border border-[#1A3A6B]/60 hover:border-[#F97316]/40 focus:border-[#F97316] text-white placeholder-slate-600 text-sm pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-300"
          />
        </div>

        {/* Table */}
        <div className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1A3A6B]/40">
                  {['Customer', 'Contact', 'City', 'Orders', 'Total Spent', 'Joined', 'Status', ''].map((h) => (
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
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-[#1A3A6B]/20 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#F97316]/20 border border-[#F97316]/20 flex items-center justify-center text-[#F97316] text-xs font-bold shrink-0">
                            {c.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-white text-sm font-medium whitespace-nowrap">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-300 text-sm">{c.email}</p>
                        <p className="text-slate-500 text-xs">{c.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">{c.city}</td>
                      <td className="px-6 py-4 text-white text-sm font-semibold">{c.orders}</td>
                      <td className="px-6 py-4 text-white text-sm font-semibold">{c.spent}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm whitespace-nowrap">{c.joined}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          c.status === 'Active'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelected(c)}
                          className="w-8 h-8 rounded-lg bg-[#1A3A6B]/50 hover:bg-[#F97316]/20 hover:text-[#F97316] text-slate-400 flex items-center justify-center transition-all duration-200"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Detail Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <div className="relative bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-3xl p-8 w-full max-w-md flex flex-col gap-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-[family-name:var(--font-syne)] text-white font-bold text-xl">
                  Customer Profile
                </h3>
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg bg-[#1A3A6B]/50 hover:bg-red-500/20 hover:text-red-400 text-slate-400 flex items-center justify-center transition-all duration-200">
                  <X size={16} />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#F97316]/20 border border-[#F97316]/30 flex items-center justify-center text-[#F97316] text-xl font-bold">
                  {selected.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-[family-name:var(--font-syne)] text-white font-bold text-lg">{selected.name}</p>
                  <p className="text-slate-400 text-sm">{selected.city}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Email', value: selected.email },
                  { label: 'Phone', value: selected.phone },
                  { label: 'Total Orders', value: selected.orders },
                  { label: 'Total Spent', value: selected.spent },
                  { label: 'Member Since', value: selected.joined },
                  { label: 'Status', value: selected.status },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-[#1A3A6B]/30 last:border-0">
                    <span className="text-slate-500 text-sm">{label}</span>
                    <span className="text-white text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminShell>
  )
}