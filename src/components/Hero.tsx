'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Globe, Users, Lightbulb } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-100px)] w-full flex items-center justify-center">
      {/* Subtle Greek pattern background (optional decorative element) */}

      <div
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative w-full h-[calc(100vh-150px)] bg-contain bg-bottom bg-no-repeat flex items-center justify-center rounded-2xl border-2 border-primary"
        style={{ backgroundImage: 'url(/hero_section/background.png)' }}
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
            Connecting Greeks in Tech
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Connecting Greeks in tech, organize networking events in the Netherlands. in the
            Netherlands.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="text-base">
              <Link href="/join">
                Join our network
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
