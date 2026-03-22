'use client'

import { useEffect, useState } from 'react'
import { Truck } from 'lucide-react'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1800)
    const hideTimer = setTimeout(() => setVisible(false), 2200)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#060e1a] flex flex-col items-center justify-center gap-8 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#1A3A6B]/60 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center animate-bounce">
          <Truck size={40} className="text-[#F97316]" />
        </div>
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-extrabold text-white tracking-tight">
          FastDrop<span className="text-[#F97316]">Express</span>
        </h1>
        <p className="text-slate-500 text-sm">Fast. Reliable. Delivered.</p>
      </div>

      <div className="w-48 h-1 bg-[#1A3A6B]/60 rounded-full overflow-hidden">
        <div className="h-full bg-[#F97316] rounded-full animate-[loading_1.8s_ease-in-out_forwards]" />
      </div>
    </div>
  )
}