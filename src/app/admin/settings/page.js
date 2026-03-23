'use client'

import { useState } from 'react'
// REMOVED: AdminShell import
import { Lock, Save, ShieldCheck, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/ToastProvider'

export default function SettingsPage() {
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const toast = useToast()

  const handleUpdatePassword = async (e) => {
    e.preventDefault()

    if (passwords.next !== passwords.confirm) {
      toast({ 
        type: 'error', 
        title: 'Validation Error', 
        message: 'New passwords do not match' 
      })
      return
    }

    if (passwords.next.length < 6) {
      toast({ 
        type: 'error', 
        title: 'Security Requirement', 
        message: 'New password must be at least 6 characters' 
      })
      return
    }

    setIsSaving(true)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current: passwords.current,
          new: passwords.next
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({ 
          type: 'success', 
          title: 'Success', 
          message: 'Admin password updated in database' 
        })
        setPasswords({ current: '', next: '', confirm: '' })
      } else {
        toast({ 
          type: 'error', 
          title: 'Update Failed', 
          message: data.message || 'Something went wrong' 
        })
      }
    } catch (err) {
      toast({ 
        type: 'error', 
        title: 'Connection Error', 
        message: 'Could not connect to the server' 
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    // Replaced <AdminShell> with a standard div
    <div className="max-w-2xl mx-auto lg:mx-0">
      
      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-white font-bold text-3xl font-syne italic uppercase tracking-tight">Account Settings</h2>
        <p className="text-slate-400 text-sm mt-2 font-medium">Manage your administrative security and access controls.</p>
      </div>

      {/* Security Card */}
      <div className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group hover:border-[#F97316]/20 transition-all duration-500">
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F97316]/5 rounded-full blur-3xl group-hover:bg-[#F97316]/10 transition-colors" />
        
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-[#1A3A6B]/30">
          <div className="p-3 bg-[#F97316]/10 rounded-2xl text-[#F97316]">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Change Password</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-tighter">Update your global admin credential</p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-8 relative z-10">
          {/* Current Password Field */}
          <div className="flex flex-col gap-3">
            <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Current Admin Password</label>
            <div className="relative group">
              <input 
                type={showPass ? "text" : "password"}
                required
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className="w-full bg-[#0A1628] border border-[#1A3A6B] text-white p-4 rounded-2xl outline-none focus:border-[#F97316] transition-all shadow-inner"
                placeholder="Enter current password"
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">New Password</label>
              <input 
                type="password"
                required
                value={passwords.next}
                onChange={(e) => setPasswords({...passwords, next: e.target.value})}
                className="w-full bg-[#0A1628] border border-[#1A3A6B] text-white p-4 rounded-2xl outline-none focus:border-[#F97316] transition-all shadow-inner"
                placeholder="At least 6 chars"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
              <input 
                type="password"
                required
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                className="w-full bg-[#0A1628] border border-[#1A3A6B] text-white p-4 rounded-2xl outline-none focus:border-[#F97316] transition-all shadow-inner"
                placeholder="Repeat new password"
              />
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#F97316] text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-[0.98] disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              <><Save size={20} /> Update Credentials</>
            )}
          </button>
        </form>
      </div>

      {/* Warning Information */}
      <div className="mt-8 flex items-start gap-4 p-5 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
        <AlertCircle className="text-[#F97316] shrink-0 mt-0.5" size={18} />
        <p className="text-slate-500 text-xs leading-relaxed font-medium">
          Changing your password will affect the <span className="text-slate-300 font-bold uppercase">/admin</span> login portal immediately. Please ensure you remember your new password before logging out of this session.
        </p>
      </div>
    </div>
  )
}