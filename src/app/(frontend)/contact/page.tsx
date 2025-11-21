import React from 'react'
import { Navigation } from '@/components/Navigation'
import { ContactForm } from '@/components/ContactForm'
import { Mail, MapPin, Phone } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Contact Us - Hellenic Next',
  description:
    "Get in touch with Hellenic Next. We're here to answer your questions and help you connect with our global Greek professional community.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Contact Info & Form Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Contact Form */}
            <div className="max-w-2xl mx-auto">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
