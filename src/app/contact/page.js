'use client'

import { useForm, ValidationError } from '@formspree/react'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

const contactInfo = [
  {
    icon: Phone,
    title: 'Call Us',
    detail: '+1 (800) 327-8376',
    sub: 'Mon – Sat, 8AM to 8PM EST',
  },
  {
    icon: Mail,
    title: 'Email Us',
    detail: 'fastsdropexpress@gmail.com',
    sub: 'We reply within 2 hours',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    detail: '123 Express Ave, New York',
    sub: 'NY 10001, United States',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    detail: 'Mon – Sun: 7AM – 10PM EST',
    sub: 'Including public holidays',
  },
]

export default function ContactPage() {
  // 🔴 Replace with your actual Formspree form ID
  const [state, handleSubmit] = useForm('xxxxxxxxxxx')

  return (
    <div className="min-h-screen">

      {/* Page Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#1A3A6B] to-transparent" />
          <div className="absolute -top-40 left-0 w-96 h-96 bg-[#F97316]/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-10 right-0 w-80 h-80 bg-[#1A3A6B]/40 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto relative text-center flex flex-col items-center gap-5">
          <span className="text-[#F97316] text-sm font-semibold uppercase tracking-widest">
            Contact Us
          </span>
          <h1 className="font-[family-name:var(--font-syne)] text-5xl sm:text-6xl font-extrabold text-white leading-tight">
            Let's Get Your{' '}
            <span className="text-[#F97316]">Package Moving</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
            Have a question, want a quote, or need support? Our team is
            ready to help you every step of the way.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {contactInfo.map(({ icon: Icon, title, detail, sub }, i) => (
            <div
              key={i}
              className="group flex flex-col gap-4 p-6 bg-[#0d1f3c]/80 border border-[#1A3A6B]/60 rounded-2xl hover:border-[#F97316]/40 hover:bg-[#0d1f3c] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#F97316]/5"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center transition-all duration-300 group-hover:bg-[#F97316] group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/30">
                <Icon
                  size={20}
                  className="text-[#F97316] group-hover:text-white transition-colors duration-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-xs uppercase tracking-widest">
                  {title}
                </span>
                <span className="text-white font-semibold text-sm group-hover:text-[#F97316] transition-colors duration-300">
                  {detail}
                </span>
                <span className="text-slate-500 text-xs">{sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Contact Form */}
          <div className="lg:col-span-3 bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-3xl p-8 sm:p-10">

            {state.succeeded ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-12">
                <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center animate-bounce">
                  <CheckCircle2 size={36} className="text-green-400" />
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="font-[family-name:var(--font-syne)] text-white font-extrabold text-2xl">
                    Message Sent!
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                    Thanks for reaching out! Our team will get back to
                    you within 2 hours.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h2 className="font-[family-name:var(--font-syne)] text-white font-extrabold text-2xl">
                    Send Us a Message
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Fill out the form below and we'll get back to you shortly.
                  </p>
                </div>

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                      Full Name <span className="text-[#F97316]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="John Smith"
                      className="bg-[#0A1628] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] text-white placeholder-slate-600 text-sm px-4 py-3.5 rounded-xl outline-none transition-all duration-300 focus:shadow-lg focus:shadow-[#F97316]/10"
                    />
                    <ValidationError
                      prefix="Name"
                      field="name"
                      errors={state.errors}
                      className="text-red-400 text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                      Email Address <span className="text-[#F97316]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="john@email.com"
                      className="bg-[#0A1628] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] text-white placeholder-slate-600 text-sm px-4 py-3.5 rounded-xl outline-none transition-all duration-300 focus:shadow-lg focus:shadow-[#F97316]/10"
                    />
                    <ValidationError
                      prefix="Email"
                      field="email"
                      errors={state.errors}
                      className="text-red-400 text-xs"
                    />
                  </div>
                </div>

                {/* Phone + Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      className="bg-[#0A1628] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] text-white placeholder-slate-600 text-sm px-4 py-3.5 rounded-xl outline-none transition-all duration-300 focus:shadow-lg focus:shadow-[#F97316]/10"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                      Subject
                    </label>
                    <select
                      name="subject"
                      className="bg-[#0A1628] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] text-white text-sm px-4 py-3.5 rounded-xl outline-none transition-all duration-300 focus:shadow-lg focus:shadow-[#F97316]/10 cursor-pointer"
                    >
                      <option value="">Select a subject</option>
                      <option value="quote">Get a Quote</option>
                      <option value="support">Delivery Support</option>
                      <option value="tracking">Tracking Issue</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                    Message <span className="text-[#F97316]">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us what you need and we'll get back to you as soon as possible..."
                    className="bg-[#0A1628] border border-[#1A3A6B] hover:border-[#F97316]/50 focus:border-[#F97316] text-white placeholder-slate-600 text-sm px-4 py-3.5 rounded-xl outline-none transition-all duration-300 focus:shadow-lg focus:shadow-[#F97316]/10 resize-none"
                  />
                  <ValidationError
                    prefix="Message"
                    field="message"
                    errors={state.errors}
                    className="text-red-400 text-xs"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 active:scale-95 group w-full sm:w-fit"
                >
                  <Send
                    size={18}
                    className={`transition-all duration-300 ${
                      state.submitting
                        ? 'animate-pulse'
                        : 'group-hover:translate-x-1 group-hover:-translate-y-1'
                    }`}
                  />
                  {state.submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Google Map */}
            <div className="relative bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-3xl overflow-hidden flex-1 min-h-64 group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.0059731!3d40.7127753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sNew%20York%2C%20NY%2010007!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  minHeight: '260px',
                  filter: 'grayscale(100%) invert(92%) contrast(83%)',
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full transition-all duration-500 group-hover:filter-none"
              />
              <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                <div className="bg-[#0A1628]/90 backdrop-blur-sm border border-[#1A3A6B]/60 rounded-xl px-4 py-3 flex items-center gap-3">
                  <MapPin size={16} className="text-[#F97316] shrink-0" />
                  <div>
                    <p className="text-white text-xs font-semibold">
                      123 Express Ave
                    </p>
                    <p className="text-slate-500 text-xs">
                      New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Quote Card */}
            <div className="bg-gradient-to-br from-[#F97316] to-orange-600 rounded-3xl p-7 flex flex-col gap-4">
              <h3 className="font-[family-name:var(--font-syne)] text-white font-extrabold text-xl">
                Need a Quick Quote?
              </h3>
              <p className="text-orange-100 text-sm leading-relaxed">
                Call us directly and our team will give you an instant
                quote for your delivery — no waiting, no forms.
              </p>
              <a
                href="tel:+18003278376"
                className="flex items-center gap-2 bg-white text-[#F97316] font-bold text-sm px-5 py-3 rounded-full w-fit transition-all duration-300 hover:bg-orange-50 hover:scale-105 hover:shadow-lg active:scale-95 group"
              >
                <Phone size={16} />
                Call Now
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}