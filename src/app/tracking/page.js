'use client'

import { useState, useEffect, useRef } from 'react'

export default function TrackingPage() {
  const [code,    setCode]    = useState('')
  const [data,    setData]    = useState(null)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [updated, setUpdated] = useState('')

  const poll    = useRef(null)
  const current = useRef('')

  useEffect(() => () => clearInterval(poll.current), [])

  // ── Fetch tracking data ─────────────────────────────────────────────────
  async function fetchData(id, quiet = false) {
    // Always strip # so both "FD278671" and "#FD278671" work
    const cleanId = id.replace('#', '').trim().toUpperCase()
    if (!cleanId) return

    try {
      const res  = await fetch(`/api/tracking/${cleanId}`)
      const json = await res.json()

      if (!res.ok) {
        if (!quiet) { setError(json.error || 'Tracking number not found'); setData(null) }
        return
      }

      // Force new object reference so React always re-renders on poll
      setData({ ...json, steps: Array.isArray(json.steps) ? json.steps : [] })
      setError('')
      setUpdated(new Date().toLocaleTimeString())

    } catch {
      if (!quiet) setError('Connection failed. Try again.')
    }
  }

  // ── Handle Track button ─────────────────────────────────────────────────
  async function handleTrack() {
    // Strip # in case user typed #FD278671
    const id = code.trim().toUpperCase().replace('#', '')
    if (!id) { setError('Please enter a tracking number'); return }

    clearInterval(poll.current)
    current.current = id
    setError('')
    setData(null)
    setLoading(true)
    await fetchData(id, false)
    setLoading(false)

    // Poll every 5 seconds for live updates
    poll.current = setInterval(() => fetchData(current.current, true), 5000)
  }

  const steps         = data?.steps || []
  const activeIndex   = steps.findIndex(s => s.active)
  const progressIndex = activeIndex >= 0
    ? activeIndex
    : steps.filter(s => s.done).length - 1

  return (
    <div className="min-h-screen">

      {/* ── Hero / Search ── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#1A3A6B] to-transparent" />
          <div className="absolute -top-40 right-0 w-80 h-80 bg-[#F97316]/8 rounded-full blur-3xl" />
          <div className="absolute top-10 left-0 w-80 h-80 bg-[#1A3A6B]/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-2xl mx-auto relative text-center flex flex-col items-center gap-5">
          <span className="text-[#F97316] text-xs font-bold uppercase tracking-[4px]">
            Package Tracking
          </span>
          <h1 className="font-[family-name:var(--font-syne)] text-4xl sm:text-5xl font-extrabold text-white">
            Track Your Package
          </h1>
          <p className="text-slate-400 text-base max-w-md">
            Enter your tracking number to see live delivery updates.
          </p>

          {/* Search input + button */}
          <div className="w-full flex flex-col sm:flex-row gap-3 mt-2">
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
              placeholder="Enter tracking number e.g. FD278671"
              className="flex-1 bg-[#0d1f3c] border border-[#1A3A6B] hover:border-[#F97316]/40 focus:border-[#F97316] text-white placeholder-slate-500 px-5 py-4 rounded-2xl outline-none transition-all text-sm"
            />
            <button
              onClick={handleTrack}
              disabled={loading}
              className="bg-[#F97316] hover:bg-orange-400 disabled:opacity-50 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              {loading ? 'Searching...' : 'Track Now'}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="w-full bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* ── Result ── */}
      {data && (
        <section className="px-6 pb-24">
          <div className="max-w-3xl mx-auto flex flex-col gap-4">

            {/* Order summary */}
            <div className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">
                    Tracking Number
                  </p>
                  <p className="font-[family-name:var(--font-syne)] text-[#F97316] font-extrabold text-xl tracking-widest">
                    {data.orderId}
                  </p>
                  {updated && (
                    <p className="text-slate-600 text-xs mt-1">
                      Live — last checked {updated}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1 sm:items-end text-slate-400 text-sm">
                  {data.fromLocation && data.toLocation && (
                    <span>{data.fromLocation} → {data.toLocation}</span>
                  )}
                  {data.driver   && <span>Driver: {data.driver}</span>}
                  {data.estimate && <span>ETA: {data.estimate}</span>}
                </div>
              </div>
            </div>

            {/* ── Horizontal timeline ── */}
            <div className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-2xl p-6 sm:p-10">

              {/* Header + status badge */}
              <div className="flex items-center justify-between mb-12">
                <h2 className="font-[family-name:var(--font-syne)] text-white font-bold text-lg">
                  Delivery Progress
                </h2>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                  data.status === 'Delivered'
                    ? 'text-green-400 bg-green-400/10 border-green-400/30'
                    : data.status === 'Pending'
                    ? 'text-slate-400 bg-slate-400/10 border-slate-500/30'
                    : 'text-[#F97316] bg-[#F97316]/10 border-[#F97316]/30'
                }`}>
                  {data.status}
                </span>
              </div>

              {steps.length > 0 && (
                <div className="relative px-2 sm:px-6">

                  {/* Grey background line */}
                  <div className="absolute top-5 left-2 right-2 sm:left-6 sm:right-6 h-[3px] bg-[#1A3A6B]/60 rounded-full" />

                  {/* Orange progress line — fills to current step */}
                  <div
                    className="absolute top-5 left-2 sm:left-6 h-[3px] bg-[#F97316] rounded-full transition-all duration-700"
                    style={{
                      width: steps.length > 1 && progressIndex >= 0
                        ? `${(progressIndex / (steps.length - 1)) * 100}%`
                        : '0%',
                    }}
                  />

                  {/* Dots + labels */}
                  <div className="relative flex justify-between">
                    {steps.map((step, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center"
                        style={{ width: `${100 / steps.length}%` }}
                      >
                        {/* Circle */}
                        <div className={`
                          relative z-10 w-10 h-10 rounded-full
                          flex items-center justify-center
                          transition-all duration-500
                          ${step.done
                            ? 'bg-[#F97316] shadow-lg shadow-orange-500/40'
                            : step.active
                            ? 'bg-[#F97316] shadow-xl shadow-orange-500/50 scale-125'
                            : 'bg-[#0d1f3c] border-2 border-[#1A3A6B]'
                          }
                        `}>
                          {/* Ping on active */}
                          {step.active && (
                            <div className="absolute inset-0 rounded-full bg-[#F97316]/40 animate-ping" />
                          )}

                          {/* Icon inside circle */}
                          {step.done || step.active ? (
                            <svg
                              className="w-5 h-5 text-white relative z-10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-[#1A3A6B]" />
                          )}
                        </div>

                        {/* Label below dot */}
                        <div className="mt-4 text-center px-1">
                          <div className={`w-px h-3 mx-auto mb-1 ${
                            step.done || step.active ? 'bg-[#F97316]' : 'bg-[#1A3A6B]'
                          }`} />
                          <p className={`text-xs font-semibold leading-tight ${
                            step.active ? 'text-[#F97316]'
                            : step.done  ? 'text-white'
                            :              'text-slate-500'
                          }`}>
                            {step.label}
                          </p>
                          {step.active && (
                            <span className="inline-block mt-1 text-[10px] font-extrabold bg-[#F97316] text-white px-2 py-0.5 rounded-full uppercase">
                              Now
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Current step description */}
                  {activeIndex >= 0 && steps[activeIndex] && (
                    <div className="mt-10 bg-[#F97316]/10 border border-[#F97316]/20 rounded-xl px-5 py-4 text-center">
                      <p className="text-[#F97316] text-xs font-bold uppercase tracking-widest mb-1">
                        Current Update
                      </p>
                      <p className="text-slate-300 text-sm">
                        {steps[activeIndex].desc}
                      </p>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Live notice */}
            <div className="flex items-center gap-3 bg-[#1A3A6B]/20 border border-[#1A3A6B]/30 rounded-xl px-4 py-3">
              <div className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse shrink-0" />
              <p className="text-slate-400 text-xs">
                Updates automatically every 5 seconds. You also receive an email on every status change.
              </p>
            </div>

          </div>
        </section>
      )}

      {/* ── Empty state ── */}
      {!data && !error && !loading && (
        <section className="px-6 pb-24">
          <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              ['1', 'Enter Number',    'Paste the tracking number from your confirmation email.'],
              ['2', 'See Live Status', 'Every step of your delivery shown in real time.'],
              ['3', 'Get Emails',      'Receive an email on every status change.'],
            ].map(([n, t, d]) => (
              <div key={n} className="flex flex-col items-center text-center gap-3 p-5 bg-[#0d1f3c]/60 border border-[#1A3A6B]/40 rounded-2xl">
                <div className="w-9 h-9 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center">
                  <span className="text-[#F97316] font-bold">{n}</span>
                </div>
                <p className="text-white font-semibold text-sm">{t}</p>
                <p className="text-slate-500 text-xs">{d}</p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}