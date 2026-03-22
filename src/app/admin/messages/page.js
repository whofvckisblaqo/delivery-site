'use client'

import { useState } from 'react'
import AdminShell from '@/components/AdminShell'
import { useToast } from '@/components/ToastProvider'
import { MessageSquare, Mail, Phone, Clock, X, Circle, CheckCircle2 } from 'lucide-react'

const allMessages = [
  { id: 'M001', name: 'Amara Okafor', email: 'amara@email.com', phone: '+234 801 234 5678', subject: 'Get a Quote', message: 'Hi, I run a small online store and would love to discuss bulk delivery pricing for about 50 packages per week. Can you help?', time: 'Today, 3:12 PM', read: false },
  { id: 'M002', name: 'David Mensah', email: 'david@email.com', phone: '+234 802 345 6789', subject: 'Tracking Issue', message: 'My package with tracking ID EX789012 has been showing "In Transit" for 2 days now. Please can you give me an update?', time: 'Today, 1:45 PM', read: false },
  { id: 'M003', name: 'Fatima Bello', email: 'fatima@email.com', phone: '+234 803 456 7890', subject: 'Delivery Support', message: 'The rider delivered my package to the wrong address yesterday. I need this resolved urgently. Please call me.', time: 'Today, 11:20 AM', read: false },
  { id: 'M004', name: 'Chidi Okonkwo', email: 'chidi@email.com', phone: '+234 804 567 8901', subject: 'Partnership', message: 'We are a logistics company looking to partner with SwiftDrop for last-mile delivery in the South-East. Interested in a meeting.', time: 'Yesterday, 4:30 PM', read: true },
  { id: 'M005', name: 'Ngozi Eze', email: 'ngozi@email.com', phone: '+234 805 678 9012', subject: 'Get a Quote', message: 'How much does it cost to send a package from Ibadan to Lagos on a Saturday morning?', time: 'Yesterday, 2:15 PM', read: true },
  { id: 'M006', name: 'Emeka Obi', email: 'emeka@email.com', phone: '+234 806 789 0123', subject: 'Other', message: 'I just wanted to say your service is excellent! My package arrived in perfect condition and the rider was very professional. 5 stars!', time: '2 days ago', read: true },
]

const subjectStyles = {
  'Get a Quote': 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20',
  'Tracking Issue': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  'Delivery Support': 'bg-red-500/10 text-red-400 border border-red-500/20',
  'Partnership': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  'Other': 'bg-green-500/10 text-green-400 border border-green-500/20',
}

export default function MessagesPage() {
  const [messages, setMessages] = useState(allMessages)
  const [selected, setSelected] = useState(null)
  const toast = useToast()

  function openMessage(msg) {
    setSelected(msg)
    if (!msg.read) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
      )
      toast({
        type: 'info',
        title: 'Message Opened',
        message: `From ${msg.name} — ${msg.subject}`,
      })
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <AdminShell title="Messages">
      <div className="flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-syne)] text-white font-bold text-2xl">
              Messages
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {messages.length} total — {unreadCount} unread
            </p>
          </div>
          {unreadCount > 0 && (
            <span className="bg-[#F97316] text-white text-xs font-bold px-3 py-1.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        {/* Messages List */}
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => openMessage(msg)}
              className={`group flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
                msg.read
                  ? 'bg-[#0d1f3c]/60 border-[#1A3A6B]/40 hover:border-[#F97316]/20'
                  : 'bg-[#0d1f3c] border-[#1A3A6B]/60 hover:border-[#F97316]/40'
              }`}
            >
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 group-hover:scale-110 ${
                msg.read
                  ? 'bg-[#1A3A6B]/50 text-slate-400'
                  : 'bg-[#F97316]/20 border border-[#F97316]/30 text-[#F97316]'
              }`}>
                {msg.name.split(' ').map(n => n[0]).join('')}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${msg.read ? 'text-slate-300' : 'text-white'}`}>
                      {msg.name}
                    </span>
                    {!msg.read && (
                      <span className="w-2 h-2 bg-[#F97316] rounded-full shrink-0" />
                    )}
                  </div>
                  <span className="text-slate-600 text-xs shrink-0">{msg.time}</span>
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${subjectStyles[msg.subject]}`}>
                    {msg.subject}
                  </span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed truncate">
                  {msg.message}
                </p>
              </div>

              {/* Read icon */}
              <div className="shrink-0 mt-1">
                {msg.read
                  ? <CheckCircle2 size={16} className="text-slate-600" />
                  : <Circle size={16} className="text-[#F97316]" />
                }
              </div>
            </div>
          ))}
        </div>

        {/* Message Detail Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <div className="relative bg-[#0d1f3c] border border-[#1A3A6B]/60 rounded-3xl p-8 w-full max-w-lg flex flex-col gap-6 shadow-2xl">

              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-[family-name:var(--font-syne)] text-white font-bold text-xl">
                  Message Details
                </h3>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-lg bg-[#1A3A6B]/50 hover:bg-red-500/20 hover:text-red-400 text-slate-400 flex items-center justify-center transition-all duration-200"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Sender Info */}
              <div className="flex items-center gap-4 p-4 bg-[#0A1628] rounded-2xl border border-[#1A3A6B]/40">
                <div className="w-12 h-12 rounded-full bg-[#F97316]/20 border border-[#F97316]/30 flex items-center justify-center text-[#F97316] font-bold">
                  {selected.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{selected.name}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="flex items-center gap-1 text-slate-400 text-xs">
                      <Mail size={11} /> {selected.email}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-xs">
                      <Phone size={11} /> {selected.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subject + Time */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${subjectStyles[selected.subject]}`}>
                  {selected.subject}
                </span>
                <span className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <Clock size={12} />
                  {selected.time}
                </span>
              </div>

              {/* Message Body */}
              <div className="bg-[#0A1628] rounded-2xl p-5 border border-[#1A3A6B]/40">
                <p className="text-slate-300 text-sm leading-relaxed">
                  {selected.message}
                </p>
              </div>

              {/* Reply Button */}
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject} — SwiftDrop`}
                className="flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95"
              >
                <Mail size={16} />
                Reply via Email
              </a>
            </div>
          </div>
        )}

      </div>
    </AdminShell>
  )
}