'use client'
import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import { Menu } from 'lucide-react'

export default function AdminShell({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#050B14]">
      {/* SIDEBAR: lg:static makes it stay on the left on Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300
        lg:static lg:translate-x-0 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <AdminSidebar onClose={() => setIsOpen(false)} />
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <header className="h-16 border-b border-white/5 bg-[#0A1628] flex items-center px-4 lg:px-8">
          <button onClick={() => setIsOpen(true)} className="lg:hidden p-2 text-slate-400 mr-4">
            <Menu size={24} />
          </button>
          <h1 className="text-orange-500 font-bold uppercase text-lg tracking-widest font-syne italic">FastDrop Admin</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-10">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}