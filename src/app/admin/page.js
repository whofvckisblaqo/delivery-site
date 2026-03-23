'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Truck, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('') // singular
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (res.ok) {
        localStorage.setItem('fastdropexpress_admin', 'true')
        router.push('/admin/dashboard')
      } else {
        setError(true)
      }
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-6 font-[family-name:var(--font-inter)]">
      <div className="w-full max-w-md bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4 mb-10 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#F97316] flex items-center justify-center shadow-xl shadow-orange-500/20">
            <Truck size={32} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-white font-black text-2xl tracking-tight font-[family-name:var(--font-syne)] uppercase">Admin Access</h1>
            <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-medium">SwiftDrop Express</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Secure Password</label>
            <div className="relative group">
              <input 
                type={showPass ? "text" : "password"}
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Fixed: singular setPassword
                className={`w-full bg-[#0A1628] border ${error ? 'border-red-500/50' : 'border-[#1A3A6B]'} text-white p-4 rounded-2xl outline-none focus:border-[#F97316] transition-all pr-12`}
                placeholder="••••••••"
              />
              
              {/* Toggle Password Visibility */}
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 text-red-400 text-xs font-bold bg-red-500/5 p-4 rounded-xl border border-red-500/20 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} className="shrink-0" />
              <span>Authentication failed. Incorrect password.</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#F97316] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Lock size={18} />
                <span>Unlock Dashboard</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-slate-600 text-[10px] mt-8 uppercase tracking-widest">
          Authorized Personnel Only
        </p>

      </div>
    </div>
  )
}