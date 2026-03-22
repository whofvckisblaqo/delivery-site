import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Small Business Owner',
    review: 'FastDropExpress has completely transformed how I handle deliveries for my store. Fast, reliable, and the tracking is incredible.',
    rating: 5,
    avatar: 'SM',
  },
  {
    name: 'James Carter',
    role: 'E-commerce Seller',
    review: 'I ship over 100 packages a week and FastDropExpress has never let me down. My customers always receive their orders on time.',
    rating: 5,
    avatar: 'JC',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Online Shopper',
    review: 'The real-time tracking gave me so much peace of mind. I knew exactly when my package would arrive. Absolutely love it!',
    rating: 5,
    avatar: 'ER',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#1A3A6B] to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <span className="text-[#F97316] text-sm font-semibold uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="font-[family-name:var(--font-syne)] text-4xl sm:text-5xl font-extrabold text-white max-w-xl leading-tight">
            What Our Customers Say
          </h2>
          <p className="text-slate-400 max-w-lg text-base leading-relaxed">
            Don't just take our word for it — here's what real FastDropExpress customers have to say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, review, rating, avatar }, i) => (
            <div
              key={i}
              className="group flex flex-col gap-5 bg-[#0d1f3c]/80 border border-[#1A3A6B]/60 rounded-2xl p-7 hover:border-[#F97316]/40 hover:bg-[#0d1f3c] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#F97316]/5"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: rating }).map((_, j) => (
                  <Star key={j} size={16} className="text-[#F97316] fill-[#F97316]" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed flex-1">"{review}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#1A3A6B]/40">
                <div className="w-10 h-10 rounded-full bg-[#F97316]/20 border border-[#F97316]/30 flex items-center justify-center text-[#F97316] text-xs font-bold transition-all duration-300 group-hover:bg-[#F97316] group-hover:text-white">
                  {avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{name}</p>
                  <p className="text-slate-500 text-xs">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}