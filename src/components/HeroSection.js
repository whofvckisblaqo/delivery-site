import Link from 'next/link'
import { ArrowRight, PackageSearch, MapPin, Clock, ShieldCheck } from 'lucide-react'

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{
        backgroundImage: "url('/hero-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-[#0A1628]/75 z-[1]" />

      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 right-0 w-80 h-80 bg-[#1A3A6B]/60 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-64 bg-[#F97316]/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-[3] max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left: Text Content */}
        <div className="flex flex-col gap-6">

          {/* Badge */}
          <div className="w-fit flex items-center gap-2 bg-[#1A3A6B]/50 border border-[#1A3A6B] px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-[#F97316] rounded-full animate-pulse" />
            <span className="text-slate-300 text-xs font-medium tracking-wide">
              Nation wide #1 Delivery Service
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-[family-name:var(--font-syne)] text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
            Fast.{' '}
            <span className="text-[#F97316]">Reliable.</span>
            <br />
            Delivered.
          </h1>

          {/* Subtext */}
          <p className="text-slate-300 text-lg leading-relaxed max-w-lg">
            FastDropExpress gets your packages where they need to go — safely,
            on time, every time. Same-day, express, or scheduled delivery
            across all 50 states.
          </p>

          {/* Perks row */}
          <div className="flex flex-wrap gap-4">
            {[
              { icon: Clock, text: 'Same-Day Available' },
              { icon: MapPin, text: 'Nationwide Coverage' },
              { icon: ShieldCheck, text: 'Fully Insured' },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 bg-[#0A1628]/60 backdrop-blur-sm border border-[#1A3A6B]/60 px-3 py-1.5 rounded-full"
              >
                <Icon size={13} className="text-[#F97316]" />
                <span className="text-slate-300 text-xs font-medium">{text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              href="/tracking"
              className="flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-400 text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 active:scale-95 group"
            >
              <PackageSearch
                size={18}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              Track a Package
            </Link>
            <Link
              href="/services"
              className="flex items-center justify-center gap-2 border border-white/20 hover:border-[#F97316] bg-white/5 backdrop-blur-sm hover:bg-[#1A3A6B]/30 text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-300 group"
            >
              Our Services
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-4 pt-6 border-t border-white/10">
            {[
              { value: '50K+', label: 'Deliveries Made' },
              { value: '50', label: 'States Covered' },
              { value: '98%', label: 'On-Time Rate' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="font-[family-name:var(--font-syne)] text-2xl font-extrabold text-[#F97316]">
                  {value}
                </span>
                <span className="text-slate-400 text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Tracking Card */}
        <div className="hidden lg:flex justify-center items-center">
          <div className="relative w-full max-w-md">

            {/* Main Card */}
            <div className="bg-[#0A1628]/90 backdrop-blur-md border border-[#1A3A6B] rounded-3xl p-8 shadow-2xl">

              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-0.5">
                  <span className="font-[family-name:var(--font-syne)] text-white font-bold text-lg">
                    Live Tracking
                  </span>
                  <span className="text-slate-500 text-xs">
                    Order #FD123456
                  </span>
                </div>
                <span className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Active
                </span>
              </div>

              {/* Route */}
              <div className="flex items-center gap-3 mb-6 p-3 bg-[#0A1628]/60 rounded-xl border border-[#1A3A6B]/40">
                <div className="flex flex-col items-center gap-1">
                  <MapPin size={14} className="text-[#F97316]" />
                  <div className="w-px h-6 bg-[#1A3A6B]" />
                  <MapPin size={14} className="text-green-400" />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <div>
                    <p className="text-white text-xs font-medium">Manhattan, NY</p>
                    <p className="text-slate-500 text-xs">Pickup location</p>
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">Brooklyn, NY</p>
                    <p className="text-slate-500 text-xs">Delivery address</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#F97316] text-xs font-bold">ETA</p>
                  <p className="text-white text-xs font-semibold">4:00 PM</p>
                </div>
              </div>

              {/* Tracking Steps */}
              {[
                { label: 'Order Placed', time: '9:00 AM', done: true },
                { label: 'Picked Up', time: '10:30 AM', done: true },
                { label: 'In Transit', time: '12:00 PM', done: true },
                { label: 'Out for Delivery', time: '2:45 PM', active: true },
                { label: 'Delivered', time: 'Pending', done: false },
              ].map(({ label, time, done, active }, i) => (
                <div key={i} className="flex items-center gap-4 mb-4 last:mb-0">
                  <div className={`w-3 h-3 rounded-full shrink-0 transition-all duration-300 ${
                    done
                      ? 'bg-green-400 shadow-sm shadow-green-400/50'
                      : active
                      ? 'bg-[#F97316] animate-pulse scale-125 shadow-sm shadow-orange-500/50'
                      : 'bg-[#1A3A6B]'
                  }`} />
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${
                      active ? 'text-[#F97316]' : done ? 'text-white' : 'text-slate-500'
                    }`}>
                      {label}
                    </div>
                  </div>
                  <span className={`text-xs ${
                    done || active ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {time}
                  </span>
                </div>
              ))}
            </div>

            {/* Driver card */}
            <div className="absolute -bottom-5 left-4 right-4 bg-[#0A1628]/90 backdrop-blur-md border border-[#1A3A6B]/60 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
              <div className="w-8 h-8 rounded-full bg-[#F97316] flex items-center justify-center text-white text-xs font-bold shrink-0">
                MD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold">Marcus D.</p>
                <p className="text-slate-500 text-xs">Your driver • 2.3 miles away</p>
              </div>
              <span className="bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                On the way 🚚
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}