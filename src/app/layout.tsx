import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MedCommunity - Your Health Journey Starts Here',
  description: 'Join our supportive community of patients, doctors, and health advocates. Track symptoms, manage treatments, and connect with others on similar health journeys.',
  keywords: 'health, medical, community, symptoms, treatments, patients, doctors, healthcare',
  authors: [{ name: 'MedCommunity Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'MedCommunity - Your Health Journey Starts Here',
    description: 'Join our supportive community of patients, doctors, and health advocates.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MedCommunity - Your Health Journey Starts Here',
    description: 'Join our supportive community of patients, doctors, and health advocates.',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
