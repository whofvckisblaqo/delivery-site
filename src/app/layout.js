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
  // This prevents the "Two Navs" problem on mobile
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <html lang="en" className="dark">
      <body className={`${syne.variable} ${inter.variable} bg-[#0A1628] text-white antialiased`}>
        <ToastProvider>
          <LoadingScreen />
          
          {/* 1. Only show Public Navbar if NOT in admin */}
          {!isAdmin && <Navbar />}
          
          {/* 2. On Admin pages, we remove the 'flex-1' main wrapper 
              to allow the AdminSidebar to sit side-by-side correctly.
          */}
          {isAdmin ? (
            <div className="min-h-screen">
              {children}
            </div>
          ) : (
            <main className="flex-1 flex flex-col min-h-screen">
              {children}
            </main>
          )}
          
          {/* 3. Hide all public footers/chat when in Admin */}
          {!isAdmin && (
            <>
              <Footer />
              <ScrollToTop />
              <SupportChat />
            </>
          )}
          
        </ToastProvider>
      </body>
    </html>
  )
}