'use client'

import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminGuard from './AdminGuard'
import { Menu, X } from 'lucide-react'

export default function AdminShell({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#0A1628] text-white overflow-hidden">
        
        {/* --- MOBILE SIDEBAR (Drawer) --- */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <div className="absolute inset-0 bg-black/80" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-64 h-full bg-[#0d1f3c] border-r border-[#1A3A6B]/60">
               <button 
                 onClick={() => setSidebarOpen(false)} 
                 className="absolute top-4 right-[-45px] p-2 bg-[#F97316] text-white rounded-lg"
               >
                 <X size={20} />
               </button>
               <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* --- DESKTOP SIDEBAR (The Fix) --- */}
        {/* We use 'w-64' and 'shrink-0' to ensure it never disappears */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-[#0d1f3c] border-r border-[#1A3A6B]/60 h-screen sticky top-0">
          <AdminSidebar />
        </aside>

        {/* --- MAIN CONTENT (The Rest) --- */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          
          {/* Header */}
          <header className="h-16 border-b border-[#1A3A6B]/60 flex items-center justify-between px-6 bg-[#0A1628] shrink-0">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="lg:hidden p-2 text-slate-400 hover:text-white"
              >
                <Menu size={24} />
              </button>
              <h1 className="font-bold text-lg uppercase tracking-wider">{title}</h1>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#F97316] flex items-center justify-center font-bold text-xs shadow-lg shadow-orange-500/20">
              AD
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            {children}
          </main>
        </div>

      </div>
    </AdminGuard>
  )
}