'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SubscribersNavLink: React.FC = () => {
  const pathname = usePathname()
  const isActive = pathname === '/admin/subscribers'

  return (
    <Link
      href="/admin/subscribers"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px 16px',
        fontSize: '13px',
        color: isActive ? 'var(--theme-text)' : 'var(--theme-elevation-600)',
        textDecoration: 'none',
        borderRadius: '4px',
        backgroundColor: isActive ? 'var(--theme-elevation-100)' : 'transparent',
        transition: 'background-color 0.15s ease',
      }}
    >
      Subscribers
    </Link>
  )
}

export default SubscribersNavLink
