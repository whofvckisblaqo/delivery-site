'use client'

import { useState } from 'react'
import {
  Search,
  PackageSearch,
  CheckCircle2,
  Circle,
  Truck,
  MapPin,
  Clock,
} from 'lucide-react'

const mockTrackingData = {
  FD123456: {
    status: 'Out for Delivery',
    estimate: 'Today by 4:00 PM',
    from: 'Manhattan, NY',
    to: 'Brooklyn, NY',
    rider: 'Marcus D.',
    steps: [
      { label: 'Order Placed', time: '9:00 AM', desc: 'Your delivery was booked successfully.', done: true },
      { label: 'Picked Up', time: '10:30 AM', desc: 'Driver picked up your package.', done: true },
      { label: 'In Transit', time: '12:15 PM', desc: 'Your package is on its way.', done: true },
      { label: 'Out for Delivery', time: '2:45 PM', desc: 'Your driver is heading to you now.', active: true },
      { label: 'Delivered', time: 'Pending', desc: 'Package will be delivered shortly.', done: false },
    ],
  },
  FD789012: {
    status: 'In Transit',
    estimate: 'Tomorrow by 12:00 PM',
    from: 'Chicago, IL',
    to: 'Detroit, MI',
    rider: 'Tyler R.',
    steps: [
      { label: 'Order Placed', time: 'Yesterday 3:00 PM', desc: 'Your delivery was booked successfully.', done: true },
      { label: 'Picked Up', time: 'Yesterday 5:00 PM', desc: 'Driver picked up your package.', done: true },
      { label: 'In Transit', time: 'Today 8:00 AM', desc: 'Package is in transit to destination city.', active: true },
      { label: 'Out for Delivery', time: 'Pending', desc: 'Driver will be assigned soon.', done: false },
      { label: 'Delivered', time: 'Pending', desc: 'Package will be delivered shortly.', done: false },
    ],
  },
}

export default function TrackingPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleTrack() {
    if (!input.trim()) return
    setLoading(true)
    setError(false)
    setResult(null)

    setTimeout(() => {
      const data = mockTrackingData[input.trim().toUpperCase()]
      if (data) {
        setResult(data)
      } else {
        setError(true)
      }
      setLoading(false)
    }, 1200)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleTrack()
  }

  return (
    <div className="min-h-screen">

      {/* Page Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#1A3A6B] to-transparent" />
          <div className="absolute -top-40 right-0 w-80 h-80 bg-[#F97316]/8 rounded-full blur-3xl" />
          <div className="absolute top-10 left-0 w-80 h-80 bg-[#1A3A6B]/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto relative text-center flex flex-col items-center gap-5">
          <span className="text-[#F97316] text-sm font-semibold uppercase tracking-widest">
            Package Tracking
          </span>
          <h1 className="font-[family-name:var(--font-syne)] text-5xl sm:text-6xl font-extrabold text-white leading-tight">
            Where Is Your{' '}
            <span className="text-[#F97316]">Package?</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
            Enter your FastDropExpress tracking number below to get a
            real-time update on your delivery status.
          </p>

          {/* Search Bar */}
          <div className="w-full mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <PackageSearch
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. FD123456 or FD789012"
                className="w-full bg-[#0d1f3c] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] text-white placeholder-slate-500 text-sm pl-12 pr-4 py-4 rounded-2xl outline-none transition-all duration-300 focus:shadow-lg focus:shadow-[#F97316]/10"
              />
            </div>
            <button
              onClick={handleTrack}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95"
            >
              <Search size={18} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </div>

          {/* Hint */}
          <p className="text-slate-600 text-xs">
            Try:{' '}
            <button
              onClick={() => setInput('FD123456')}
              className="text-[#F97316] hover:underline transition-all"
            >
              FD123456
            </button>
            {' '}or{' '}
            <button
              onClick={() => setInput('FD789012')}
              className="text-[#F97316] hover:underline transition-all"
            >
              FD789012
            </button>
          </p>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center flex flex-col items-center gap-3">
            <PackageSearch size={40} className="text-red-400" />
            <h3 className="font-[family-name:var(--font-syne)] text-white font-bold text-xl">
              Tracking Number Not Found
            </h3>
            <p className="text-slate-400 text-sm">
              We couldn't find a package with that tracking number.
              Please double-check and try again.
            </p>
          </div>
        </section>
      )}

      {/* Tracking Result */}
      {result && (
        <section className="px-6 pb-24">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">

            {/* Status Card */}
            <div className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-3xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-slate-400 text-xs uppercase tracking-widest">
                  Current Status
                </span>
                <span className="font-[family-name:var(--font-syne)] text-2xl font-extrabold text-[#F97316]">
                  {result.status}
                </span>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Clock size={14} />
                  <span>Estimated: {result.estimate}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:items-end">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <MapPin size={14} className="text-[#F97316]" />
                  <span>{result.from} → {result.to}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Truck size={14} className="text-[#F97316]" />
                  <span>Driver: {result.rider}</span>
                </div>
                <span className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-3 py-1 rounded-full w-fit">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Live Tracking Active
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-3xl p-8">
              <h3 className="font-[family-name:var(--font-syne)] text-white font-bold text-lg mb-8">
                Delivery Timeline
              </h3>

              <div className="flex flex-col gap-0">
                {result.steps.map(({ label, time, desc, done, active }, i) => (
                  <div key={i} className="flex gap-5 group">

                    {/* Line + Dot */}
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full shrink-0 mt-1 transition-all duration-300 ${
                        done
                          ? 'bg-green-400 shadow-md shadow-green-400/30'
                          : active
                          ? 'bg-[#F97316] animate-pulse shadow-md shadow-orange-500/40 scale-125'
                          : 'bg-[#1A3A6B] border-2 border-[#1A3A6B]'
                      }`} />
                      {i < result.steps.length - 1 && (
                        <div className={`w-0.5 flex-1 my-1 min-h-[40px] transition-all duration-300 ${
                          done ? 'bg-green-400/40' : 'bg-[#1A3A6B]/60'
                        }`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`pb-8 flex-1 flex flex-col gap-1 ${
                      i === result.steps.length - 1 ? 'pb-0' : ''
                    }`}>
                      <div className="flex items-center justify-between gap-4">
                        <span className={`font-semibold text-sm transition-colors duration-300 ${
                          active ? 'text-[#F97316]' : done ? 'text-white' : 'text-slate-500'
                        }`}>
                          {label}
                        </span>
                        <span className="text-slate-500 text-xs shrink-0">{time}</span>
                      </div>
                      <p className={`text-xs leading-relaxed ${
                        active ? 'text-slate-300' : done ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Empty State */}
      {!result && !error && !loading && (
        <section className="px-6 pb-24">
          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Search, title: 'Enter Tracking Number', desc: 'Type your unique FastDropExpress tracking ID in the search bar above.' },
              { icon: Truck, title: 'See Live Status', desc: 'Get real-time updates on where your package is right now.' },
              { icon: CheckCircle2, title: 'Stay Informed', desc: 'Know the exact moment your delivery arrives at its destination.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="group flex flex-col items-center text-center gap-3 p-6 bg-[#0d1f3c]/50 border border-[#1A3A6B]/40 rounded-2xl hover:border-[#F97316]/30 hover:bg-[#0d1f3c] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center transition-all duration-300 group-hover:bg-[#F97316]/20 group-hover:scale-110">
                  <Icon size={20} className="text-[#F97316]" />
                </div>
                <h4 className="font-[family-name:var(--font-syne)] text-white font-bold text-sm">
                  {title}
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}