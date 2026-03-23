'use client'

import { useState, useEffect, useMemo } from 'react'
// REMOVED: AdminShell import
import { useToast } from '@/components/ToastProvider'
import {
  MessageSquare, Mail, Phone, Clock, X, Circle,
  CheckCircle2, Loader2, Send, RefreshCw, Plus, Search, Trash2, AlertCircle, Eye
} from 'lucide-react'

export default function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const [isComposing, setIsComposing] = useState(false)
  const [newEmail, setNewEmail] = useState({ to: '', subject: '', message: '' })
  const [showConfirm, setShowConfirm] = useState({ show: false, type: null })
  
  const toast = useToast()

  // 1. Fetch Messages
  useEffect(() => { 
    fetchMessages() 
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setSelected(null)
        setIsComposing(false)
        setShowConfirm({ show: false, type: null })
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  async function fetchMessages() {
    setLoading(true)
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch {
      toast({ type: 'error', title: 'Error', message: 'Could not load messages' })
    } finally {
      setLoading(false)
    }
  }

  // 2. Email Logic
  async function sendEmailDirectly(recipient, subject, content) {
    setIsSending(true)
    try {
      const res = await fetch('/api/send-general', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: recipient, subject, message: content }),
      })
      return res.ok
    } catch { return false }
    finally { setIsSending(false) }
  }

  const executeSendManual = async () => {
    const success = await sendEmailDirectly(newEmail.to, newEmail.subject, newEmail.message)
    if (success) {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmail),
      })
      fetchMessages()
      setIsComposing(false)
      setShowConfirm({ show: false, type: null })
      setNewEmail({ to: '', subject: '', message: '' })
      toast({ type: 'success', title: 'Sent', message: 'Recorded successfully.' })
    }
  }

  const executeSendReply = async () => {
    const success = await sendEmailDirectly(selected.email, `Re: ${selected.subject || 'Inquiry'}`, reply)
    if (success) {
      setSelected(null)
      setShowConfirm({ show: false, type: null })
      setReply('')
      toast({ type: 'success', title: 'Sent', message: 'Reply delivered' })
    }
  }

  const filteredMessages = useMemo(() => {
    return messages.filter(m => 
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [messages, searchQuery])

  return (
    // Replaced <AdminShell> with a simple <div> container
    <div className="relative">
      {/* LOADING BAR AT TOP */}
      {isSending && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[2000] overflow-hidden bg-[#0A1628]">
          <div className="h-full bg-[#F97316] animate-progress-loading w-full" />
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-white font-bold text-2xl font-syne italic uppercase tracking-tight">Messages</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0d1f3c] border border-[#1A3A6B] text-white text-xs pl-9 pr-4 py-2 rounded-xl outline-none focus:border-[#F97316] w-48 md:w-64"
              />
            </div>
            <button onClick={() => setIsComposing(true)} className="bg-[#F97316] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition-all"><Plus size={14} /> Compose</button>
          </div>
        </div>

        {/* Message List */}
        <div className="grid gap-3">
          {loading ? (
             <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
                <Loader2 size={20} className="animate-spin text-orange-500" />
                <span className="text-xs font-bold tracking-widest uppercase">Loading Mailbox...</span>
             </div>
          ) : filteredMessages.length === 0 ? (
             <div className="text-center py-20 text-slate-600 italic">No messages found.</div>
          ) : filteredMessages.map((msg) => (
            <div 
              key={msg.messageId} 
              onClick={() => setSelected(msg)} 
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${msg.read ? 'bg-[#0d1f3c]/40 border-[#1A3A6B]/20' : 'bg-[#0d1f3c] border-[#1A3A6B]/60 shadow-lg shadow-orange-500/5 hover:border-[#F97316]/40'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-white font-semibold text-sm">{msg.name}</span>
                <span className="text-slate-600 text-[10px]">{msg.time}</span>
              </div>
              <p className="text-slate-500 text-sm truncate">{msg.message}</p>
            </div>
          ))}
        </div>

        {/* --- MODALS --- */}
        {isComposing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsComposing(false)} />
            <div className="relative z-[101] bg-[#0d1f3c] border border-[#1A3A6B] rounded-3xl p-6 w-full max-w-lg shadow-2xl">
               <h3 className="text-white font-bold mb-4">New Email</h3>
               <input placeholder="To" className="w-full bg-[#0A1628] border border-[#1A3A6B] text-white p-3 rounded-xl mb-3 outline-none" value={newEmail.to} onChange={e => setNewEmail({...newEmail, to: e.target.value})} />
               <textarea placeholder="Message..." rows={5} className="w-full bg-[#0A1628] border border-[#1A3A6B] text-white p-3 rounded-xl mb-4 outline-none resize-none" value={newEmail.message} onChange={e => setNewEmail({...newEmail, message: e.target.value})} />
               <button onClick={() => setShowConfirm({ show: true, type: 'manual' })} className="w-full bg-[#F97316] text-white font-bold py-3 rounded-xl">Review & Send</button>
            </div>
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <div className="relative z-[101] bg-[#0d1f3c] border border-[#1A3A6B] rounded-3xl p-6 w-full max-w-lg shadow-2xl">
              <div className="flex justify-between mb-4"><h3 className="text-white font-bold">Details</h3><button onClick={() => setSelected(null)}><X size={20} className="text-slate-500"/></button></div>
              <div className="bg-[#0A1628] p-4 rounded-xl mb-4 text-sm text-slate-300">{selected.message}</div>
              <textarea placeholder="Reply..." className="w-full bg-[#0A1628] border border-[#1A3A6B] text-white p-3 rounded-xl mb-4 outline-none" value={reply} onChange={e => setReply(e.target.value)} />
              <button onClick={() => setShowConfirm({ show: true, type: 'reply' })} className="w-full bg-[#F97316] text-white font-bold py-3 rounded-xl">Send Reply</button>
            </div>
          </div>
        )}

        {showConfirm.show && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0A1628]/95 backdrop-blur-md" />
            <div className="relative z-[201] bg-[#0d1f3c] border border-[#F97316]/30 rounded-[2.5rem] p-8 w-full max-w-sm text-center">
              <AlertCircle size={40} className="text-[#F97316] mx-auto mb-4" />
              <h4 className="text-white font-bold text-xl mb-2">Confirm Send</h4>
              <p className="text-slate-400 text-sm mb-6 italic">"{showConfirm.type === 'manual' ? newEmail.message : reply}"</p>
              <div className="flex flex-col gap-3">
                <button onClick={showConfirm.type === 'manual' ? executeSendManual : executeSendReply} className="bg-[#F97316] text-white font-bold py-4 rounded-full">Yes, Send Now</button>
                <button onClick={() => setShowConfirm({ show: false, type: null })} className="text-slate-500">Back</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}