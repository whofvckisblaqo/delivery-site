'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Truck,
  LayoutDashboard,
  PackageCheck,
  Users,
  MapPin,
  MessageSquare,
  LogOut,
  X,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Orders', href: '/admin/orders', icon: PackageCheck },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Tracking', href: '/admin/tracking', icon: MapPin },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
]

export default function AdminSidebar({ onClose }) {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    localStorage.removeItem('fastdropexpress_admin')
    router.push('/admin')
  }

  return (
    <aside className="h-full bg-[#060e1a] border-r border-[#1A3A6B]/60 flex flex-col">

      {/* Logo */}
      <div className="px-6 py-6 flex items-center justify-between border-b border-[#1A3A6B]/40">
        <Link href="/admin/dashboard" className="flex items-center gap-2 group">
          <Truck
            size={24}
            className="text-[#F97316] transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-[family-name:var(--font-syne)] text-lg font-extrabold text-white">
            FastDrop<span className="text-[#F97316]">Express</span>
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
        <p className="text-slate-600 text-xs uppercase tracking-widest px-3 mb-3">
          Main Menu
        </p>
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-[#1A3A6B]/50'
              }`}
            >
              <Icon
                size={18}
                className={`transition-transform duration-200 ${
                  isActive ? 'text-white' : 'group-hover:scale-110'
                }`}
              />
              {label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-[#1A3A6B]/40">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
        >
          <LogOut size={18} className="transition-transform duration-200 group-hover:scale-110" />
          Sign Out
        </button>
        <p className="text-slate-600 text-xs text-center mt-4">
          FastDropExpress Admin v1.0
        </p>
      </div>
    </aside>
  )
}