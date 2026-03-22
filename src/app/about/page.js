import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Heart,
  Users,
  TrendingUp,
  Globe,
} from 'lucide-react'

const values = [
  {
    icon: Zap,
    title: 'Speed',
    description:
      'We obsess over every minute. Our systems, drivers, and processes are built around one goal — getting your package there faster than you expect.',
  },
  {
    icon: ShieldCheck,
    title: 'Integrity',
    description:
      'We handle every package like it belongs to us. Transparent communication, honest pricing, and zero hidden fees — always.',
  },
  {
    icon: Heart,
    title: 'Care',
    description:
      'Behind every delivery is a person who cares. Our team goes the extra mile to ensure every customer feels valued and heard.',
  },
]

const team = [
  {
    name: 'Michael Reynolds',
    role: 'CEO & Co-Founder',
    avatar: 'MR',
    color: 'bg-[#F97316]',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
  },
  {
    name: 'Ashley Thompson',
    role: 'Head of Operations',
    avatar: 'AT',
    color: 'bg-[#1A3A6B]',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
  },
  {
    name: 'Daniel Kim',
    role: 'Lead Engineer',
    avatar: 'DK',
    color: 'bg-purple-600',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  },
  {
    name: 'Jessica Parker',
    role: 'Customer Experience',
    avatar: 'JP',
    color: 'bg-green-600',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
  },
]

const stats = [
  { icon: TrendingUp, value: '50K+', label: 'Deliveries Made' },
  { icon: Globe, value: '50+', label: 'States Covered' },
  { icon: Users, value: '20K+', label: 'Happy Customers' },
  { icon: ShieldCheck, value: '98%', label: 'On-Time Rate' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#1A3A6B] to-transparent" />
          <div className="absolute -top-40 right-0 w-96 h-96 bg-[#F97316]/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-20 left-0 w-80 h-80 bg-[#1A3A6B]/40 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <span className="text-[#F97316] text-sm font-semibold uppercase tracking-widest">
              About FastDropExpress
            </span>
            <h1 className="font-[family-name:var(--font-syne)] text-5xl sm:text-6xl font-extrabold text-white leading-tight">
              We Deliver More Than{' '}
              <span className="text-[#F97316]">Packages</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              FastDropExpress was founded in 2020 with one simple belief — delivery
              should be something you never have to worry about. What started as a
              small operation in New York has grown into a nationwide service trusted
              by thousands of businesses and individuals across the US.
            </p>
            <p className="text-slate-400 text-base leading-relaxed">
              We combine smart technology, dedicated drivers, and a relentless
              focus on the customer to make every delivery feel effortless.
            </p>
            <Link
              href="/contact"
              className="flex items-center gap-2 w-fit bg-[#F97316] hover:bg-orange-400 text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 active:scale-95 group"
            >
              Work With Us
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="relative">
            <div className="bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-3xl p-8 flex flex-col gap-6">
              <span className="text-[#F97316] text-xs font-bold uppercase tracking-widest">
                Our Mission
              </span>
              <p className="font-[family-name:var(--font-syne)] text-white text-2xl font-bold leading-snug">
                "To make reliable delivery accessible to every person and business — no matter where they are in the United States."
              </p>
              <div className="h-px bg-gradient-to-r from-[#F97316]/40 to-transparent" />
              <p className="text-slate-400 text-sm leading-relaxed">
                We believe logistics shouldn't be a luxury. FastDropExpress is on a
                mission to democratize delivery — making speed and reliability
                available to everyone, from the small local business to the
                large enterprise.
              </p>
            </div>
            <div className="absolute -top-4 -right-4 bg-[#F97316] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-orange-500/30">
              Est. 2020 🚀
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-[#060e1a] border-y border-[#1A3A6B]/40">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="group flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-[#0d1f3c] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center transition-all duration-300 group-hover:bg-[#F97316]/20 group-hover:scale-110">
                <Icon size={20} className="text-[#F97316]" />
              </div>
              <span className="font-[family-name:var(--font-syne)] text-3xl font-extrabold text-[#F97316] group-hover:scale-110 transition-transform duration-300 inline-block">
                {value}
              </span>
              <span className="text-slate-400 text-sm">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F97316]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative flex flex-col gap-16">
          <div className="text-center flex flex-col items-center gap-4">
            <span className="text-[#F97316] text-sm font-semibold uppercase tracking-widest">
              What Drives Us
            </span>
            <h2 className="font-[family-name:var(--font-syne)] text-4xl sm:text-5xl font-extrabold text-white max-w-xl leading-tight">
              Our Core Values
            </h2>
            <p className="text-slate-400 max-w-lg text-base leading-relaxed">
              These aren't just words on a wall — they're the principles every
              FastDropExpress team member lives by every single day.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, description }, i) => (
              <div
                key={i}
                className="group flex flex-col gap-5 bg-[#0d1f3c]/80 border border-[#1A3A6B]/60 rounded-2xl p-8 hover:border-[#F97316]/40 hover:bg-[#0d1f3c] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#F97316]/5"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center transition-all duration-300 group-hover:bg-[#F97316] group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/30">
                  <Icon size={26} className="text-[#F97316] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-white font-bold text-xl group-hover:text-[#F97316] transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 bg-[#060e1a] border-t border-[#1A3A6B]/40">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          <div className="text-center flex flex-col items-center gap-4">
            <span className="text-[#F97316] text-sm font-semibold uppercase tracking-widest">
              The People Behind FastDropExpress
            </span>
            <h2 className="font-[family-name:var(--font-syne)] text-4xl sm:text-5xl font-extrabold text-white max-w-xl leading-tight">
              Meet Our Team
            </h2>
            <p className="text-slate-400 max-w-lg text-base leading-relaxed">
              A small but mighty team of passionate people working hard to
              make every delivery count.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(({ name, role, avatar, color, image }, i) => (
              <div
                key={i}
                className="group flex flex-col items-center text-center gap-4 p-8 bg-[#0d1f3c]/80 border border-[#1A3A6B]/60 rounded-2xl hover:border-[#F97316]/40 hover:bg-[#0d1f3c] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#F97316]/5"
              >
                <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-[#1A3A6B]/60 group-hover:ring-[#F97316]/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-[family-name:var(--font-syne)] text-white font-bold text-base group-hover:text-[#F97316] transition-colors duration-300">
                    {name}
                  </h4>
                  <p className="text-slate-500 text-xs">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <h2 className="font-[family-name:var(--font-syne)] text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Want to Join the{' '}
            <span className="text-[#F97316]">FastDropExpress</span> Family?
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
            Whether you're a business looking for a delivery partner or an
            individual with a package to send — we'd love to hear from you.
          </p>
          <Link
            href="/contact"
            className="flex items-center gap-2 bg-[#F97316] hover:bg-orange-400 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 active:scale-95 group"
          >
            Get in Touch
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

    </div>
  )
}