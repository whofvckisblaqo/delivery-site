'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export function useToast() {
  return useContext(ToastContext)
}

const toastStyles = {
  success: {
    icon: CheckCircle2,
    container: 'bg-[#0d1f3c] border-green-500/30',
    icon: 'text-green-400',
    title: 'text-white',
  },
  error: {
    icon: AlertCircle,
    container: 'bg-[#0d1f3c] border-red-500/30',
    iconColor: 'text-red-400',
    title: 'text-white',
  },
  info: {
    icon: Info,
    container: 'bg-[#0d1f3c] border-[#F97316]/30',
    iconColor: 'text-[#F97316]',
    title: 'text-white',
  },
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type = 'success', title, message }) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, type, title, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={addToast}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(({ id, type, title, message }) => {
          const style = toastStyles[type] || toastStyles.success
          const Icon = type === 'success'
            ? CheckCircle2
            : type === 'error'
            ? AlertCircle
            : Info
          const iconColor = type === 'success'
            ? 'text-green-400'
            : type === 'error'
            ? 'text-red-400'
            : 'text-[#F97316]'
          const borderColor = type === 'success'
            ? 'border-green-500/30'
            : type === 'error'
            ? 'border-red-500/30'
            : 'border-[#F97316]/30'

          return (
            <div
              key={id}
              className={`pointer-events-auto flex items-start gap-3 bg-[#0d1f3c] border ${borderColor} rounded-2xl px-4 py-3.5 shadow-2xl shadow-black/40 min-w-[280px] max-w-sm animate-[slideIn_0.3s_ease-out]`}
            >
              <Icon size={18} className={`${iconColor} shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">{title}</p>
                {message && (
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(id)}
                className="text-slate-500 hover:text-white transition-colors duration-200 shrink-0 mt-0.5"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}