'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Truck } from 'lucide-react'

export default function AdminGuard({ children }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const isAdmin = localStorage.getItem('fastdropexpress_admin')
    if (isAdmin === 'true') {
      setAuthorized(true)
    } else {
      router.push('/admin')
    }
  }, [router])

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#060e1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center animate-pulse">
            <Truck size={28} className="text-[#F97316]" />
          </div>
          <p className="text-slate-500 text-sm">Checking access...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}