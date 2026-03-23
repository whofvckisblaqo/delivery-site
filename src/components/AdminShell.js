// File Path: src/components/AdminShell.js
'use client'

import AdminSidebar from './AdminSidebar' // Ensure this file also exists!

export default function AdminShell({ children }) {
  return (
    <div className="flex min-h-screen bg-[#050B14]">
      {/* Sidebar - Left side */}
      <AdminSidebar />
      
      {/* Main Content - Right side */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-white/5 bg-[#0A1628] flex items-center px-8 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-orange-500 font-syne">
              FastDrop Express <span className="text-white/40 text-sm font-normal ml-2">Admin Panel</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">Main Admin</p>
              <p className="text-xs text-white/40">super_admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#050B14]">
          {children}
        </main>
      </div>
    </div>
  )
}