import React from 'react'
import './globals.css'
import NavbarDemo from '@/components/resizable-navbar-demo'
import Footer from '@/components/footer'

export const metadata = {
  description:
    'Connecting Greek professionals across the globe. Join our community for networking, opportunities, and knowledge sharing.',
  title: 'Hellenic Next - Global Greek Professional Community',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="font-sans bg-background">
        <NavbarDemo />
        {children}
        <Footer />
      </body>
    </html>
  )
}
