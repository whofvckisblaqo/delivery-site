import { Syne, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import LoadingScreen from '@/components/LoadingScreen'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'FastDropExpress — Fast & Reliable Delivery',
  description: 'FastDropExpress delivers packages fast, safely, and on time across the United States.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${inter.variable} bg-[#0A1628] text-white flex flex-col min-h-screen`}
      >
        <LoadingScreen />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  )
}