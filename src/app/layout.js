'use client'

import { Syne, Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import LoadingScreen from '@/components/LoadingScreen'
import SupportChat from '@/components/SupportChat'
import ToastProvider from '@/components/ToastProvider'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({ children }) {
  const pathname = usePathname()
  
  // Logic to hide site elements when you are in the Admin Panel
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <html lang="en">
      <body className={`${syne.variable} ${inter.variable} bg-[#0A1628] text-white flex flex-col min-h-screen`}>
        <ToastProvider>
          <LoadingScreen />
          
          {/* Only show Navbar/Footer/Chat to regular users */}
          {!isAdmin && <Navbar />}
          
          <main className="flex-1">
            {children}
          </main>
          
          {!isAdmin && <Footer />}
          {!isAdmin && <ScrollToTop />}
          
          {/* THE CHAT BUBBLE IS NOW LIVE HERE */}
          {!isAdmin && <SupportChat />}
          
        </ToastProvider>
      </body>
    </html>
  )
}