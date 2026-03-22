'use client'

import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminGuard from './AdminGuard'
import { Menu, Bell, Search } from 'lucide-react'

export default function AdminShell({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#0A1628] flex">

        {/* Sidebar — desktop */}
        <div className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col">
          <div className="fixed top-0 left-0 h-full w-64">
            <AdminSidebar />
          </div>
        </div>

        {/* Sidebar — mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative w-64 h-full z-10">
              <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">

          {/* Top bar */}
          <header className="sticky top-0 z-40 bg-[#0A1628]/95 backdrop-blur-md border-b border-[#1A3A6B]/60 px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-400 hover:text-white transition-colors"
              >
                <Menu size={22} />
              </button>
              <h1 className="font-[family-name:var(--font-syne)] text-white font-bold text-lg">
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <button className="w-9 h-9 rounded-xl bg-[#0d1f3c] border border-[#1A3A6B]/60 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#F97316]/40 transition-all duration-200">
                <Search size={16} />
              </button>
              {/* Notifications */}
              <button className="relative w-9 h-9 rounded-xl bg-[#0d1f3c] border border-[#1A3A6B]/60 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#F97316]/40 transition-all duration-200">
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F97316] rounded-full" />
              </button>
              {/* Avatar */}
              <div className="w-9 h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white text-xs font-bold">
                AD
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}