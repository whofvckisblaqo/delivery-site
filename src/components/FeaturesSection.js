import { Zap, MapPin, ShieldCheck, Clock, HeadphonesIcon, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Same-day delivery available across major cities. We move as fast as you need us to.',
  },
  {
    icon: MapPin,
    title: 'Real-Time Tracking',
    description: 'Know exactly where your package is at every step with live GPS tracking.',
  },
  {
    icon: ShieldCheck,
    title: 'Fully Insured',
    description: 'Every delivery is insured. Your package is protected from pickup to drop-off.',
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Choose a delivery window that works for you — mornings, afternoons, or evenings.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Our support team is always on standby to help with any delivery questions.',
  },
  {
    icon: BarChart3,
    title: 'Nationwide Coverage',
    description: 'Operating in 50+ cities and growing. We deliver wherever you need us.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">

      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#1A3A6B] to-transparent" />

      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <span className="text-[#F97316] text-sm font-semibold uppercase tracking-widest">
            Why SwiftDrop
          </span>
          <h2 className="font-[family-name:var(--font-syne)] text-4xl sm:text-5xl font-extrabold text-white max-w-xl leading-tight">
            Built for Speed. Designed for Trust.
          </h2>
          <p className="text-slate-400 max-w-lg text-base leading-relaxed">
            Everything we do is centered around getting your delivery there faster, safer, and smarter.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }, i) => (
            <div
              key={i}
              className="group bg-[#0d1f3c]/80 border border-[#1A3A6B]/60 rounded-2xl p-6 flex flex-col gap-4 hover:border-[#F97316]/50 hover:bg-[#0d1f3c] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#F97316]/5"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center transition-all duration-300 group-hover:bg-[#F97316]/20 group-hover:scale-110">
                <Icon size={22} className="text-[#F97316]" />
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-white font-bold text-lg group-hover:text-[#F97316] transition-colors duration-300">
                {title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}