'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Hellenic Next</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/events"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Events
            </Link>
            <Link
              href="/blog"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              About
            </Link>
            <Button asChild>
              <Link href="/join">Join Now</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/events"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              href="/blog"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="px-3 py-2">
              <Button asChild className="w-full">
                <Link href="/join">Join Now</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
