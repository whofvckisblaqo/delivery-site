import { ClipboardList, PackageCheck, Smile } from 'lucide-react'

const steps = [
  {
    icon: ClipboardList,
    step: '01',
    title: 'Book a Delivery',
    description: 'Fill out our simple booking form with your pickup and drop-off details. Takes less than 2 minutes.',
  },
  {
    icon: PackageCheck,
    step: '02',
    title: 'We Pick It Up',
    description: 'Our rider arrives at your location on time, packages your item securely, and heads out.',
  },
  {
    icon: Smile,
    step: '03',
    title: 'Delivered With Care',
    description: 'Your package arrives safely at its destination. Track every step of the journey in real time.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-[#060e1a] relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F97316]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">

        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <span className="text-[#F97316] text-sm font-semibold uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="font-[family-name:var(--font-syne)] text-4xl sm:text-5xl font-extrabold text-white max-w-xl leading-tight">
            Delivery in 3 Simple Steps
          </h2>
          <p className="text-slate-400 max-w-lg text-base leading-relaxed">
            No complexity, no confusion — just a smooth experience from start to finish.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px bg-gradient-to-r from-[#1A3A6B] via-[#F97316]/40 to-[#1A3A6B]" />

          {steps.map(({ icon: Icon, step, title, description }, i) => (
            <div
              key={i}
              className="group relative flex flex-col items-center text-center gap-5 p-8 bg-[#0d1f3c]/50 border border-[#1A3A6B]/60 rounded-2xl hover:border-[#F97316]/40 hover:bg-[#0d1f3c] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#F97316]/5"
            >
              {/* Step number */}
              <span className="absolute top-4 right-5 font-[family-name:var(--font-syne)] text-5xl font-extrabold text-[#1A3A6B]/40 group-hover:text-[#F97316]/20 transition-colors duration-300 select-none">
                {step}
              </span>

              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center transition-all duration-300 group-hover:bg-[#F97316] group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/30">
                <Icon size={28} className="text-[#F97316] group-hover:text-white transition-colors duration-300" />
              </div>

              <h3 className="font-[family-name:var(--font-syne)] text-white font-bold text-xl group-hover:text-[#F97316] transition-colors duration-300">
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