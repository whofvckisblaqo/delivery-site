'use client'

import { useState } from 'react'
import { Mail, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  }

  function handleSubmit() {
    if (!email.trim()) return
    if (!isValidEmail(email)) {
      setError(true)
      return
    }
    setLoading(true)
    setError(false)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <section className="py-24 px-6 relative overflow-hidden">

      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#1A3A6B] to-transparent" />
        <div className="absolute -top-20 right-0 w-80 h-80 bg-[#F97316]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1A3A6B]/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto relative">
        <div className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-3xl px-8 py-14 sm:px-14 flex flex-col items-center text-center gap-8">

          {submitted ? (
            /* Success State */
            <div className="flex flex-col items-center gap-5 py-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center animate-bounce">
                <CheckCircle2 size={32} className="text-green-400" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-[family-name:var(--font-syne)] text-white font-extrabold text-2xl">
                  You're on the list! 🎉
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                  Thanks for subscribing! You'll be the first to hear about
                  SwiftDrop news, offers, and delivery updates.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center">
                <Sparkles size={26} className="text-[#F97316]" />
              </div>

              {/* Text */}
              <div className="flex flex-col gap-3">
                <span className="text-[#F97316] text-sm font-semibold uppercase tracking-widest">
                  Newsletter
                </span>
                <h2 className="font-[family-name:var(--font-syne)] text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  Stay in the Loop with{' '}
                  <span className="text-[#F97316]">SwiftDrop</span>
                </h2>
                <p className="text-slate-400 text-base leading-relaxed max-w-lg">
                  Get delivery tips, exclusive offers, and company updates
                  delivered straight to your inbox. No spam — ever.
                </p>
              </div>

              {/* Perks */}
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  '🚚 Delivery tips',
                  '🎁 Exclusive offers',
                  '📦 New features',
                  '🔔 Service updates',
                ].map((perk) => (
                  <span
                    key={perk}
                    className="bg-[#1A3A6B]/50 border border-[#1A3A6B] text-slate-300 text-xs px-4 py-2 rounded-full"
                  >
                    {perk}
                  </span>
                ))}
              </div>

              {/* Input */}
              <div className="w-full flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError(false)
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your email address"
                    className={`w-full bg-[#0A1628] border text-white placeholder-slate-600 text-sm pl-10 pr-4 py-3.5 rounded-2xl outline-none transition-all duration-300 ${
                      error
                        ? 'border-red-500/60 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/10'
                        : 'border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] focus:shadow-lg focus:shadow-[#F97316]/10'
                    }`}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !email.trim()}
                  className="flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-7 py-3.5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95 group whitespace-nowrap"
                >
                  <Mail
                    size={16}
                    className={loading ? 'animate-pulse' : ''}
                  />
                  {loading ? 'Subscribing...' : 'Subscribe'}
                  {!loading && (
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}
                </button>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-400 text-xs -mt-4 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  Please enter a valid email address.
                </p>
              )}

              {/* Privacy note */}
              <p className="text-slate-600 text-xs">
                By subscribing you agree to our{' '}
                <a href="#" className="text-slate-500 hover:text-[#F97316] transition-colors duration-200">
                  Privacy Policy
                </a>
                . Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}