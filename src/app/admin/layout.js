import { Syne, Inter } from 'next/font/google'
import '../globals.css'
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

export const metadata = {
  title: 'SwiftDrop Admin',
  description: 'SwiftDrop Admin Dashboard',
}

export default function AdminLayout({ children }) {
  return (
    <div className={`${syne.variable} ${inter.variable}`}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </div>
  )
}