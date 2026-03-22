import Link from 'next/link'
import { Truck, ArrowRight, Home, PackageSearch } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#1A3A6B] to-transparent" />
        <div className="absolute -top-40 left-0 w-96 h-96 bg-[#F97316]/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#1A3A6B]/40 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative max-w-2xl mx-auto text-center flex flex-col items-center gap-8">

        {/* Animated truck icon */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center animate-bounce">
            <Truck size={52} className="text-[#F97316]" />
          </div>
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            Lost?
          </div>
        </div>

        {/* 404 */}
        <span className="font-[family-name:var(--font-syne)] text-[10rem] sm:text-[14rem] font-extrabold text-[#1A3A6B]/40 leading-none select-none">
          404
        </span>

        {/* Text */}
        <div className="flex flex-col gap-4 -mt-8">
          <h1 className="font-[family-name:var(--font-syne)] text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            This Page Got{' '}
            <span className="text-[#F97316]">Lost in Transit</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-md mx-auto">
            Looks like the page you're looking for took a wrong turn
            somewhere. Don't worry — FastDropExpress has got you covered.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-400 text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 active:scale-95"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <Link
            href="/tracking"
            className="flex items-center justify-center gap-2 border border-[#1A3A6B] hover:border-[#F97316] text-slate-300 hover:text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-[#1A3A6B]/30 group"
          >
            <PackageSearch size={18} />
            Track a Package
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 border-t border-[#1A3A6B]/40 w-full">
          <span className="text-slate-500 text-xs">Quick links:</span>
          {[
            { label: 'Services', href: '/services' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-slate-400 hover:text-[#F97316] text-xs transition-all duration-200 hover:translate-x-0.5 inline-block"
            >
              → {label}
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}