'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Truck, Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Tracking', href: '/tracking' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A1628]/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-[#1A3A6B]/60'
          : 'bg-[#0A1628] border-b border-[#1A3A6B]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Truck
            className="text-[#F97316] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            size={28}
          />
          <span className="font-[family-name:var(--font-syne)] text-xl font-extrabold text-white tracking-tight">
            FastDrop<span className="text-[#F97316] transition-colors duration-300 group-hover:text-orange-400">Express</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`relative text-sm font-medium transition-colors duration-200 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#F97316] after:transition-all after:duration-300 ${
                  isActive
                    ? 'text-[#F97316] after:w-full'
                    : 'text-slate-300 hover:text-white after:w-0 hover:after:w-full'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className={`relative text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95 ${
              pathname === '/contact'
                ? 'bg-orange-400 shadow-lg shadow-orange-500/30'
                : 'bg-[#F97316] hover:bg-orange-400'
            }`}
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-1 rounded-md transition-all duration-200 hover:bg-[#1A3A6B] active:scale-90"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block transition-all duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </span>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#0A1628] border-t border-[#1A3A6B] px-6 py-4 flex flex-col gap-1">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`text-sm font-medium px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20'
                    : 'text-slate-300 hover:text-white hover:bg-[#1A3A6B]'
                }`}
              >
                {label}
              </Link>
            )
          })}
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="mt-2 bg-[#F97316] hover:bg-orange-400 text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95"
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </nav>
  )
}