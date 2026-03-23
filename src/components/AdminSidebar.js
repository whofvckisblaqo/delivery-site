'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  MessageSquare, 
  Truck, 
  LogOut, 
  Settings, 
  ExternalLink 
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: Package },
  { name: 'Tracking', href: '/admin/tracking', icon: MapPin },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
]

export default function AdminSidebar({ onClose }) {
  const pathname = usePathname()

  return (
    /* h-full and justify-between ensures the bottom section is pinned to the floor */
    <div className="flex flex-col h-full bg-[#0d1f3c] justify-between">
      
      {/* --- TOP SECTION --- */}
      <div>
        {/* Branding */}
        <div className="p-6 mb-4 flex items-center gap-3 border-b border-[#1A3A6B]/20">
          <div className="p-2 bg-[#F97316]/10 rounded-lg">
            <Truck size={24} className="text-[#F97316]" />
          </div>
          <span className="font-black text-xl tracking-tight text-white">FASTDROP</span>
        </div>

        {/* Links */}
        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  active 
                  ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/20' 
                  : 'text-slate-500 hover:text-white hover:bg-[#1A3A6B]/40'
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* --- BOTTOM SECTION (Pinned to bottom) --- */}
      <div className="p-4 border-t border-[#1A3A6B]/20 space-y-1">
        
        {/* Settings Link */}
        <Link 
          href="/admin/settings" 
          onClick={onClose}
          className="flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm text-slate-500 hover:text-white hover:bg-[#1A3A6B]/40 transition-all"
        >
          <Settings size={20} />
          Settings
        </Link>

        {/* View Website */}
        <Link 
          href="/" 
          className="flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm text-slate-500 hover:text-white hover:bg-[#1A3A6B]/40 transition-all"
        >
          <ExternalLink size={20} />
          View Website
        </Link>

        {/* Logout */}
        <button 
          onClick={() => {
            localStorage.removeItem('fastdropexpress_admin')
            window.location.href = '/admin'
          }}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

    </div>
  )
}