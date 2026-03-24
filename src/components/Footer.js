import Link from 'next/link'
import { Truck, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#060e1a] border-t border-[#1A3A6B]/60 mt-auto">

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <Truck
              className="text-[#F97316] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              size={26}
            />
            <span className="font-[family-name:var(--font-syne)] text-xl font-extrabold text-white tracking-tight">
              FastDrop<span className="text-[#F97316] transition-colors duration-300 group-hover:text-orange-400">Express</span>
            </span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">
            Fast, reliable, and secure delivery services across the United States. We bring your packages home — on time, every time.
          </p>
          <div className="flex items-center gap-3 mt-2">
            {[
              { icon: Facebook, href: '#' },
              { icon: Twitter, href: '#' },
              { icon: Instagram, href: '#' },
              { icon: Linkedin, href: '#' },
            ].map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="w-9 h-9 rounded-full bg-[#1A3A6B]/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#F97316] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/20"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h3 className="font-[family-name:var(--font-syne)] text-white font-bold text-sm uppercase tracking-widest">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-2">
            {[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/services' },
              { label: 'Track a Package', href: '/tracking' },
              { label: 'About Us', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-slate-400 hover:text-[#F97316] text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  → {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="flex flex-col gap-4">
          <h3 className="font-[family-name:var(--font-syne)] text-white font-bold text-sm uppercase tracking-widest">
            Our Services
          </h3>
          <ul className="flex flex-col gap-2">
            {[
              'Same-Day Delivery',
              'Express Delivery',
              'Scheduled Delivery',
              'Nationwide Coverage',
              'Secure Handling',
            ].map((service) => (
              <li key={service}>
                <Link
                  href="/services"
                  className="text-slate-400 hover:text-[#F97316] text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  → {service}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <h3 className="font-[family-name:var(--font-syne)] text-white font-bold text-sm uppercase tracking-widest">
            Contact Us
          </h3>
          <ul className="flex flex-col gap-3">
            {[
              { icon: Phone, text: '+1 (800) 327-8376' },
              { icon: Mail, text: 'fastsdropexpress@gmail.com' },
              { icon: MapPin, text: '123 Express Ave, New York, NY' },
            ].map(({ icon: Icon, text }, i) => (
              <li key={i} className="flex items-start gap-3 group">
                <Icon
                  size={16}
                  className="text-[#F97316] mt-0.5 shrink-0 transition-transform duration-300 group-hover:scale-110"
                />
                <span className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-200">
                  {text}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-2 w-fit bg-[#F97316] hover:bg-orange-400 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95"
          >
            Get a Quote
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1A3A6B]/40 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FastDropExpress. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="hover:text-slate-300 transition-colors duration-200">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}