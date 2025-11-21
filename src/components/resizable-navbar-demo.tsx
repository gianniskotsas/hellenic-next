'use client'
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  MobileNavItems,
} from '@/components/ui/resizable-navbar'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function NavbarDemo() {
  const navItems = [
    {
      name: 'Events',
      link: '/events',
    },
    {
      name: 'Contact',
      link: '/contact',
    },
  ]

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="sticky top-2 z-50 w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton href="/join" className="hover:cursor-pointer" variant="dark">
              <div className="flex items-center gap-2">
                <span className="text-sm font-normal">Join Now</span>{' '}
                <ArrowRight className="h-4 w-4" />
              </div>
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            <MobileNavItems items={navItems} onItemClick={() => setIsMobileMenuOpen(false)} />
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                href="/join"
                onClick={() => setIsMobileMenuOpen(false)}
                variant="dark"
                className="w-full hover:cursor-pointer"
              >
                Join Now
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Navbar */}
    </div>
  )
}
