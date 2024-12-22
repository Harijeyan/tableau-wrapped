import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tableau Wrapped',
  description: 'View your Tableau Public year in review',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isDev = process.env.NODE_ENV === 'development';
  
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
      <Analytics />
      {!isDev && <GoogleAnalytics gaId="G-PN208SWE2T" />}
    </html>
  )
}
