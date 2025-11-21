import React from 'react'
import { Crimson_Pro } from 'next/font/google'
import './globals.css'
import NavbarDemo from '@/components/resizable-navbar-demo'
import Footer from '@/components/footer'

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  weight: ['200'],
  style: ['italic'],
  variable: '--font-crimson-pro',
})

export const metadata = {
  description:
    'Connecting Greek professionals across the globe. Join our community for networking, opportunities, and knowledge sharing.',
  title: 'Hellenic Next - Global Greek Professional Community',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className={`font-sans bg-background ${crimsonPro.variable}`}>
        <NavbarDemo />
        {children}
        <Footer />
      </body>
    </html>
  )
}
