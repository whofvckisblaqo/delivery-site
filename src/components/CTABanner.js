import Link from 'next/link'
import { ArrowRight, Truck } from 'lucide-react'

export default function CTABanner() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-br from-[#F97316] to-orange-600 rounded-3xl px-8 py-16 sm:px-16 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">

          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
            <Truck
              size={220}
              className="absolute -right-8 bottom-0 text-white/10"
              strokeWidth={1}
            />
          </div>

          {/* Text */}
          <div className="relative flex flex-col gap-4 text-center lg:text-left">
            <h2 className="font-[family-name:var(--font-syne)] text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              Ready to Ship?
            </h2>
            <p className="text-orange-100 text-lg max-w-lg leading-relaxed">
              Join thousands of businesses and individuals who trust SwiftDrop for fast, reliable deliveries every day.
            </p>
          </div>

          {/* Buttons */}
          <div className="relative flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 bg-white text-[#F97316] font-bold px-8 py-3.5 rounded-full transition-all duration-300 hover:bg-orange-50 hover:scale-105 hover:shadow-xl active:scale-95 group"
            >
              Get a Quote
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/tracking"
              className="flex items-center justify-center gap-2 border-2 border-white/60 hover:border-white text-white font-bold px-8 py-3.5 rounded-full transition-all duration-300 hover:bg-white/10 hover:scale-105 active:scale-95"
            >
              Track a Package
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
