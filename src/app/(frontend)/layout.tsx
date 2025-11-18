import React from 'react'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  description: 'Connecting Greek professionals across the globe. Join our community for networking, opportunities, and knowledge sharing.',
  title: 'Hellenic Next - Global Greek Professional Community',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
