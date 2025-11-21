import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-background text-foreground">
      {/* Top Section - Reach out to us on left, Navigate and Social on right */}
      <div className="container mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 lg:gap-4">
          {/* Left - Contact Info */}
          <div className="space-y-2 sm:space-y-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Reach out to us</p>
            <a
              href="mailto:info@hellenicnext.com"
              className="block text-xl sm:text-2xl lg:text-3xl font-bold text-foreground hover:text-primary transition-colors break-all"
            >
              info@hellenicnext.com
            </a>
          </div>

          {/* Right - Navigation and Social together with gap-4 */}
          <div className="flex gap-8 sm:gap-12">
            {/* Navigation */}
            <div className="space-y-2 sm:space-y-4">
              <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 sm:mb-6">
                Navigate
              </h3>
              <nav className="space-y-2 sm:space-y-3 flex flex-col">
                <Link
                  href="/"
                  className="text-sm sm:text-base text-foreground font-bold hover:text-primary transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/events"
                  className="text-sm sm:text-base text-foreground font-bold hover:text-primary transition-colors"
                >
                  Events
                </Link>
                <Link
                  href="/join"
                  className="text-sm sm:text-base text-foreground font-bold hover:text-primary transition-colors"
                >
                  Join Network
                </Link>
                <Link
                  href="/contact"
                  className="text-sm sm:text-base text-foreground font-bold hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </nav>
            </div>

            {/* Social */}
            <div className="space-y-2 sm:space-y-4">
              <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 sm:mb-6">
                Social
              </h3>
              <div className="space-y-2 sm:space-y-3 flex flex-col">
                <a
                  href="https://www.linkedin.com/company/hellenic-next/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base text-foreground font-bold hover:text-primary transition-colors flex items-center gap-2"
                >
                  Linkedin
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-3 h-3 sm:w-4 sm:h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/hellenicnext/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base text-foreground font-bold hover:text-primary transition-colors flex items-center gap-2"
                >
                  Instagram
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-3 h-3 sm:w-4 sm:h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Large Brand Section - Positioned at rightmost */}
      <div className="bg-background py-8 sm:py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
          <h3 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-foreground tracking-tight break-words">
            hellenicnext
          </h3>
        </div>
      </div>

      {/* Dark Bottom Section */}
      <div className="bg-foreground text-background">
        <div className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <p className="text-xs sm:text-sm">©2025 Hellenic Next | All rights reserved</p>
        </div>
      </div>
    </footer>
  )
}
