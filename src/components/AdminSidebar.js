'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, MapPin, MessageSquare, Settings, ExternalLink, LogOut, X, Truck } from 'lucide-react'

export default function AdminSidebar({ onClose }) {
  const pathname = usePathname()

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: Package },
    { name: 'Tracking', href: '/admin/tracking', icon: MapPin },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings }, // Added back
  ]

  return (
    <div className="flex flex-col h-full bg-[#0d1f3c] border-r border-white/5 shadow-2xl">
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <Truck className="text-orange-500" size={24} />
          <span className="font-bold text-white uppercase tracking-tighter">FastDrop</span>
        </div>
        <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              pathname === item.href ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={20} />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <Link href="/" className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white text-sm font-bold">
          <ExternalLink size={20} /> View Website
        </Link>
        <button className="w-full flex items-center gap-4 px-4 py-3 text-red-500/60 hover:text-red-500 text-sm font-bold">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  )
}