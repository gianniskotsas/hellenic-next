import React from 'react'
import './globals.css'

export const metadata = {
  description: 'Connecting Greek professionals across the globe. Join our community for networking, opportunities, and knowledge sharing.',
  title: 'Hellenic Next - Global Greek Professional Community',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
