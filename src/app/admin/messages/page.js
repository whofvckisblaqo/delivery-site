'use client'

import { useState, useEffect, useMemo } from 'react'
import { useToast } from '@/components/ToastProvider'
import {
  MessageSquare, Mail, X, Plus, Search, Loader2, 
  Send, AlertCircle, User, Calendar, Eye
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

  // 1. FETCH MESSAGES
  useEffect(() => { 
    fetchMessages() 
  }, [])

  async function fetchMessages() {
    setLoading(true)
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()
      // Sort by the 'id' field from your Prisma schema (newest first)
      setMessages(Array.isArray(data) ? data.sort((a, b) => b.id - a.id) : [])
    } catch (err) {
      toast({ type: 'error', title: 'System Error', message: 'Could not load inbox' })
    } finally {
      setLoading(false)
    }
  }

  // 2. SEARCH FILTER LOGIC
  const filteredMessages = useMemo(() => {
    return messages.filter(m => 
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [messages, searchQuery])

  // 3. COMPOSE MESSAGE (ALIGNED WITH YOUR ROUTE.JS)
  const executeSendManual = async () => {
    if (!newEmail.to || !newEmail.message) {
      toast({ type: 'error', title: 'Missing Info', message: 'Recipient and Message are required.' })
      return
    }

    setIsSending(true)
    try {
      // Step A: Dispatch actual email via your send-general API
      const emailRes = await fetch('/api/send-general', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          to: newEmail.to, 
          subject: newEmail.subject || "Message from FastDrop Support", 
          message: newEmail.message 
        }),
      })

      if (!emailRes.ok) throw new Error("Email provider failed to dispatch")

      // Step B: RECORD IN DATABASE
      // We send ONLY 'to', 'subject', and 'message' because your route.js 
      // handles generating the messageId, name, and time.
      const dbRes = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: newEmail.to,
          subject: newEmail.subject || "Admin Update",
          message: newEmail.message
        }),
      })

      if (!dbRes.ok) {
        // This catch handles cases where the server returns non-JSON errors
        const contentType = dbRes.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await dbRes.json();
          throw new Error(errorData.error || "Database rejected the save");
        } else {
          throw new Error("Server Error: Check your VS Code terminal for Prisma logs");
        }
      }

      toast({ type: 'success', title: 'Dispatched', message: `Email delivered and recorded.` })
      
      // Step C: Cleanup & UI Refresh
      setIsComposing(false)
      setShowConfirm({ show: false, type: null })
      setNewEmail({ to: '', subject: '', message: '' })
      
      // Pull fresh data to show the new sent message in the list
      await fetchMessages() 

    } catch (err) {
      toast({ type: 'error', title: 'Action Failed', message: err.message })
    } finally {
      setIsSending(false)
    }
  }

  // 4. REPLY LOGIC
  const executeSendReply = async () => {
    if (!reply.trim()) return
    setIsSending(true)
    try {
      const res = await fetch('/api/send-general', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          to: selected.email, 
          subject: `Re: ${selected.subject || 'Inquiry'}`, 
          message: reply 
        }),
      })
      
      if (res.ok) {
        toast({ type: 'success', title: 'Reply Delivered', message: `Sent to ${selected.email}` })
        setSelected(null)
        setReply('')
        setShowConfirm({ show: false, type: null })
        await fetchMessages()
      }
    } catch {
      toast({ type: 'error', title: 'Error', message: 'Failed to deliver response' })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#0d1f3c] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="space-y-1">
           <h2 className="text-3xl font-black font-syne uppercase italic tracking-tighter">Admin <span className="text-orange-500">Inbox</span></h2>
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Secure Management Portal</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <input 
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A1628] border border-white/5 text-white text-xs pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-orange-500 transition-all shadow-inner"
            />
          </div>
          <button 
            onClick={() => setIsComposing(true)} 
            className="w-full sm:w-auto bg-orange-500 text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95"
          >
            <Plus size={16} /> Compose New
          </button>
        </div>
      </div>

      {/* MESSAGE LIST */}
      <div className="grid gap-4">
        {loading ? (
           <div className="py-32 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-orange-500" size={40} />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Syncing Mailbox...</p>
           </div>
        ) : filteredMessages.length === 0 ? (
           <div className="text-center py-24 bg-[#0d1f3c]/20 border border-dashed border-white/5 rounded-[3rem]">
              <Mail className="mx-auto text-slate-700 mb-4" size={48} />
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No Active Messages</p>
           </div>
        ) : (
          filteredMessages.map((msg) => (
            <div 
              key={msg.id} 
              onClick={() => setSelected(msg)} 
              className={`p-6 rounded-[1.5rem] border cursor-pointer transition-all hover:translate-x-1 group ${msg.read ? 'bg-[#0d1f3c]/40 border-white/5' : 'bg-[#0d1f3c] border-orange-500/20 shadow-xl shadow-orange-500/5'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${msg.read ? 'bg-slate-700' : 'bg-orange-500 animate-pulse'}`} />
                   <span className="text-white font-bold text-sm tracking-tight">{msg.name}</span>
                   <span className="text-slate-600 text-[10px] font-bold uppercase hidden sm:inline">| {msg.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-[10px] font-black uppercase tracking-tighter">
                   <Calendar size={10} /> {msg.time}
                </div>
              </div>
              <p className="text-slate-400 text-sm truncate font-medium italic group-hover:text-slate-200 transition-colors">"{msg.message}"</p>
            </div>
          ))
        )}
      </div>

      {/* --- MODAL: COMPOSE --- */}
      {isComposing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsComposing(false)} />
          <div className="relative z-[101] bg-[#0d1f3c] border border-white/10 rounded-[3rem] p-10 w-full max-w-xl shadow-3xl">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-white font-black font-syne uppercase italic text-2xl tracking-tighter">New Transmission</h3>
                <button onClick={() => setIsComposing(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500"><X size={24}/></button>
             </div>
             
             <div className="space-y-5">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Recipient Address</label>
                   <input placeholder="Enter customer email..." className="w-full bg-[#0A1628] border border-white/5 text-white p-5 rounded-2xl outline-none focus:border-orange-500 transition-all text-sm shadow-inner" value={newEmail.to} onChange={e => setNewEmail({...newEmail, to: e.target.value})} />
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Subject Title</label>
                   <input placeholder="Update on Order..." className="w-full bg-[#0A1628] border border-white/5 text-white p-5 rounded-2xl outline-none focus:border-orange-500 transition-all text-sm shadow-inner" value={newEmail.subject} onChange={e => setNewEmail({...newEmail, subject: e.target.value})} />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Message Body</label>
                   <textarea placeholder="Write message..." rows={6} className="w-full bg-[#0A1628] border border-white/5 text-white p-5 rounded-2xl outline-none focus:border-orange-500 transition-all text-sm resize-none shadow-inner" value={newEmail.message} onChange={e => setNewEmail({...newEmail, message: e.target.value})} />
                </div>

                <button 
                  onClick={() => setShowConfirm({ show: true, type: 'manual' })} 
                  className="w-full bg-orange-500 text-white font-black uppercase tracking-[0.3em] py-5 rounded-[1.5rem] hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/30 active:scale-95 mt-4"
                >
                  Verify & Dispatch
                </button>
             </div>
          </div>
        </div>
      )}

      {/* --- MODAL: DETAILS & REPLY --- */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelected(null)} />
          <div className="relative z-[101] bg-[#0d1f3c] border border-white/10 rounded-[2.5rem] p-10 w-full max-w-lg shadow-3xl">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
               <div className="space-y-1">
                  <h3 className="text-orange-500 font-black font-syne uppercase italic text-xl">Conversation</h3>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{selected.email}</p>
               </div>
               <button onClick={() => setSelected(null)} className="p-2 hover:bg-white/5 rounded-full text-slate-500"><X size={24}/></button>
            </div>
            
            <div className="bg-[#0A1628] p-6 rounded-3xl mb-8 text-sm text-slate-300 font-medium leading-relaxed border border-white/5 shadow-inner italic">
               "{selected.message}"
            </div>

            <div className="space-y-2 mb-4">
               <label className="text-[10px] font-black uppercase text-orange-500 tracking-[0.2em] ml-1">Response Dispatch</label>
               <textarea placeholder="Type reply here..." className="w-full bg-[#0A1628] border border-white/5 text-white p-5 rounded-2xl outline-none focus:border-orange-500 transition-all resize-none text-sm shadow-inner" rows={4} value={reply} onChange={e => setReply(e.target.value)} />
            </div>

            <button 
              onClick={() => setShowConfirm({ show: true, type: 'reply' })} 
              className="w-full bg-orange-500 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95"
            >
              Send Response
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL: FINAL CONFIRMATION --- */}
      {showConfirm.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0A1628]/95 backdrop-blur-2xl" />
          <div className="relative z-[201] bg-[#0d1f3c] border border-orange-500/30 rounded-[3.5rem] p-12 w-full max-w-sm text-center shadow-3xl">
            <AlertCircle size={56} className="text-orange-500 mx-auto mb-8 animate-pulse" />
            <h4 className="text-white font-black font-syne uppercase italic text-2xl mb-4 tracking-tighter">Confirmation</h4>
            <p className="text-slate-500 text-xs mb-10 font-bold uppercase tracking-widest leading-relaxed">
              Confirming transmission to <br/> <span className="text-white">{showConfirm.type === 'manual' ? newEmail.to : selected.email}</span>
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={showConfirm.type === 'manual' ? executeSendManual : executeSendReply} 
                className="bg-orange-500 text-white font-black uppercase tracking-[0.3em] py-5 rounded-full hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-orange-500/40"
              >
                {isSending ? <Loader2 className="animate-spin mx-auto" size={24} /> : "Send Now"}
              </button>
              <button onClick={() => setShowConfirm({ show: false, type: null })} className="text-slate-600 font-black uppercase text-[9px] tracking-[0.4em] hover:text-white transition-colors pt-4">Return to Draft</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}