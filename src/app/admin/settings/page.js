'use client'

import { useState } from 'react'
import { Lock, Save, ShieldCheck, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/ToastProvider'

export default function SettingsPage() {
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const toast = useToast()

  const handleUpdatePassword = async (e) => {
    e.preventDefault()

    // 1. Validation Logic
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
      // 2. ACTIVE API CALL: Updates the admin password in your database
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
          message: 'Admin credentials updated successfully.' 
        })
        setPasswords({ current: '', next: '', confirm: '' })
      } else {
        toast({ 
          type: 'error', 
          title: 'Update Failed', 
          message: data.message || 'Incorrect current password' 
        })
      }
    } catch (err) {
      toast({ 
        type: 'error', 
        title: 'Connection Error', 
        message: 'Could not reach the security server' 
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto lg:mx-0 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-white font-black text-3xl font-syne italic uppercase tracking-tighter">
          Security <span className="text-orange-500">&</span> Access
        </h2>
        <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-widest">
          Manage administrative credentials
        </p>
      </div>

      {/* Security Card */}
      <div className="bg-[#0d1f3c] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all" />
        
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
          <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Master Password</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Access Control Level 1</p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-8 relative z-10">
          {/* Current Password */}
          <div className="flex flex-col gap-3">
            <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Current Password</label>
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"}
                required
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className="w-full bg-[#0A1628] border border-white/5 text-white p-5 rounded-2xl outline-none focus:border-orange-500/50 transition-all font-mono"
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* New Passwords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">New Password</label>
              <input 
                type="password"
                required
                value={passwords.next}
                onChange={(e) => setPasswords({...passwords, next: e.target.value})}
                className="w-full bg-[#0A1628] border border-white/5 text-white p-5 rounded-2xl outline-none focus:border-orange-500/50 transition-all font-mono"
                placeholder="Min. 6 chars"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Confirm New</label>
              <input 
                type="password"
                required
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                className="w-full bg-[#0A1628] border border-white/5 text-white p-5 rounded-2xl outline-none focus:border-orange-500/50 transition-all font-mono"
                placeholder="Repeat new"
              />
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit"
            disabled={isSaving}
            className="w-full bg-orange-500 text-white font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-[0.98] disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <><Save size={20} /> Update Credentials</>
            )}
          </button>
        </form>
      </div>

      {/* Warning Alert */}
      <div className="mt-8 flex items-start gap-4 p-6 bg-orange-500/5 border border-orange-500/10 rounded-3xl">
        <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={20} />
        <p className="text-slate-500 text-xs leading-relaxed font-bold uppercase tracking-tight">
          Warning: Updating the master password will terminate all active admin sessions. 
          Ensure you have saved your new credentials before proceeding.
        </p>
      </div>
    </div>
  )
}