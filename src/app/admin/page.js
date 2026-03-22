'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Truck, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const ADMIN_PASSWORD = 'fastdrop2024'

  function handleLogin() {
    if (!password.trim()) return
    setLoading(true)
    setError(false)

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem('fastdropexpress_admin', 'true')
        router.push('/admin/dashboard')
      } else {
        setError(true)
        setLoading(false)
      }
    }, 1000)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen bg-[#060e1a] flex items-center justify-center px-6 relative overflow-hidden">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#1A3A6B]/60 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative w-full max-w-md flex flex-col gap-8">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center">
            <Truck size={32} className="text-[#F97316]" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-syne)] text-2xl font-extrabold text-white">
              FastDrop<span className="text-[#F97316]">Express</span> Admin
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Sign in to access your dashboard
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-3xl p-8 flex flex-col gap-6">

          <div className="flex items-center gap-3 bg-[#F97316]/10 border border-[#F97316]/20 rounded-xl px-4 py-3">
            <ShieldCheck size={18} className="text-[#F97316] shrink-0" />
            <p className="text-slate-300 text-xs leading-relaxed">
              This area is restricted to FastDropExpress administrators only.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Admin Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(false)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Enter admin password"
                className={`w-full bg-[#0A1628] border text-white placeholder-slate-600 text-sm pl-10 pr-12 py-3.5 rounded-xl outline-none transition-all duration-300 ${
                  error
                    ? 'border-red-500/60 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/10'
                    : 'border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] focus:shadow-lg focus:shadow-[#F97316]/10'
                }`}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                Incorrect password. Please try again.
              </p>
            )}
          </div>

          <button
            onClick={handleLogin}
            disabled={loading || !password.trim()}
            className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95"
          >
            <Lock size={16} className={loading ? 'animate-pulse' : ''} />
            {loading ? 'Verifying...' : 'Sign In'}
          </button>

          <p className="text-center text-slate-600 text-xs">
            Not an admin?{' '}
            <a
              href="/"
              className="text-slate-400 hover:text-[#F97316] transition-colors duration-200"
            >
              Go back to FastDropExpress
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}