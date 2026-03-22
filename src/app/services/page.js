import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import {
  Zap,
  Rocket,
  CalendarClock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

const services = [
  {
    icon: Zap,
    badge: 'Most Popular',
    title: 'Same-Day Delivery',
    description:
      'Need it there today? We pick up and deliver within hours — perfect for urgent packages across the city.',
    price: 'From $25.00',
    features: [
      'Pickup within 1 hour',
      'Delivered same day',
      'Real-time GPS tracking',
      'Available 7 days a week',
      'City-wide coverage',
    ],
    highlight: true,
  },
  {
    icon: Rocket,
    badge: 'Best Value',
    title: 'Express Delivery',
    description:
      'Next business day delivery anywhere in the country. Fast, affordable, and fully tracked from start to finish.',
    price: 'From $12.00',
    features: [
      'Next business day delivery',
      'Nationwide coverage',
      'SMS & email notifications',
      'Door-to-door service',
      'Insured shipments',
    ],
    highlight: false,
  },
  {
    icon: CalendarClock,
    badge: 'Most Flexible',
    title: 'Scheduled Delivery',
    description:
      'Pick your own delivery window — morning, afternoon, or evening. You stay in control of when it arrives.',
    price: 'From $8.00',
    features: [
      'Choose your time window',
      'Morning, afternoon & evening slots',
      'Advance booking up to 7 days',
      'Rescheduling available',
      'Perfect for businesses',
    ],
    highlight: false,
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen">

      {/* Page Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#1A3A6B] to-transparent" />
          <div className="absolute -top-40 left-0 w-80 h-80 bg-[#F97316]/8 rounded-full blur-3xl" />
          <div className="absolute top-20 right-0 w-80 h-80 bg-[#1A3A6B]/40 rounded-full blur-3xl" />
        </div>

        <ScrollReveal direction="up">
          <div className="max-w-7xl mx-auto relative text-center flex flex-col items-center gap-5">
            <span className="text-[#F97316] text-sm font-semibold uppercase tracking-widest">
              Our Services
            </span>
            <h1 className="font-[family-name:var(--font-syne)] text-5xl sm:text-6xl font-extrabold text-white max-w-2xl leading-tight">
              Delivery That Fits{' '}
              <span className="text-[#F97316]">Your Schedule</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
              Whether you need it in hours or want to plan ahead,
              FastDropExpress has a delivery option built just for you.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Service Cards */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {services.map(
            ({ icon: Icon, badge, title, description, price, features, highlight }, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 120}>
                <div
                  className={`group relative flex flex-col gap-6 rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl h-full ${
                    highlight
                      ? 'bg-[#F97316] border-orange-400 hover:shadow-orange-500/30'
                      : 'bg-[#0d1f3c]/80 border-[#1A3A6B]/60 hover:border-[#F97316]/40 hover:shadow-[#F97316]/5'
                  }`}
                >
                  {/* Badge */}
                  <span
                    className={`absolute top-5 right-5 text-xs font-bold px-3 py-1 rounded-full ${
                      highlight
                        ? 'bg-white/20 text-white'
                        : 'bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316]'
                    }`}
                  >
                    {badge}
                  </span>

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      highlight
                        ? 'bg-white/20 group-hover:bg-white/30'
                        : 'bg-[#F97316]/10 border border-[#F97316]/20 group-hover:bg-[#F97316] group-hover:shadow-lg group-hover:shadow-orange-500/30'
                    }`}
                  >
                    <Icon
                      size={26}
                      className={`transition-colors duration-300 ${
                        highlight
                          ? 'text-white'
                          : 'text-[#F97316] group-hover:text-white'
                      }`}
                    />
                  </div>

                  {/* Title & Description */}
                  <div className="flex flex-col gap-2">
                    <h3
                      className={`font-[family-name:var(--font-syne)] text-2xl font-extrabold ${
                        highlight
                          ? 'text-white'
                          : 'text-white group-hover:text-[#F97316] transition-colors duration-300'
                      }`}
                    >
                      {title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        highlight ? 'text-orange-100' : 'text-slate-400'
                      }`}
                    >
                      {description}
                    </p>
                  </div>

                  {/* Price */}
                  <div
                    className={`text-3xl font-[family-name:var(--font-syne)] font-extrabold ${
                      highlight ? 'text-white' : 'text-[#F97316]'
                    }`}
                  >
                    {price}
                  </div>

                  {/* Features */}
                  <ul className="flex flex-col gap-3 flex-1">
                    {features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <CheckCircle2
                          size={17}
                          className={`shrink-0 ${
                            highlight ? 'text-white' : 'text-[#F97316]'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            highlight ? 'text-orange-100' : 'text-slate-300'
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href="/contact"
                    className={`mt-2 flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 group/btn ${
                      highlight
                        ? 'bg-white text-[#F97316] hover:bg-orange-50 hover:shadow-lg'
                        : 'bg-[#F97316] text-white hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/30'
                    }`}
                  >
                    Book Now
                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover/btn:translate-x-1"
                    />
                  </Link>
                </div>
              </ScrollReveal>
            )
          )}
        </div>
      </section>

      {/* Bottom Trust Strip */}
      <ScrollReveal direction="up" delay={100}>
        <section className="py-16 px-6 bg-[#060e1a] border-t border-[#1A3A6B]/40">
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: '50K+', label: 'Deliveries Completed' },
              { value: '50+', label: 'States Covered' },
              { value: '98%', label: 'On-Time Rate' },
              { value: '24/7', label: 'Customer Support' },
            ].map(({ value, label }, i) => (
              <ScrollReveal key={label} direction="up" delay={i * 100}>
                <div className="group flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-[#0d1f3c] transition-all duration-300">
                  <span className="font-[family-name:var(--font-syne)] text-3xl font-extrabold text-[#F97316] group-hover:scale-110 transition-transform duration-300 inline-block">
                    {value}
                  </span>
                  <span className="text-slate-400 text-sm">{label}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

    </div>
  )
}