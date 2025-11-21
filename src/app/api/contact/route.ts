import { NextRequest, NextResponse } from 'next/server'
import { UseSend } from 'usesend-js'

// Force dynamic rendering to prevent build-time initialization
export const dynamic = 'force-dynamic'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ContactFormData
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Check if API key is configured
    if (!process.env.USESEND_API_KEY) {
      console.error('USESEND_API_KEY is not configured')
      return NextResponse.json(
        { message: 'Email service is not configured. Please contact the administrator.' },
        { status: 500 }
      )
    }

    // Check if sender email is configured
    if (!process.env.USESEND_FROM_EMAIL) {
      console.error('USESEND_FROM_EMAIL is not configured')
      return NextResponse.json(
        { message: 'Email service is not configured. Please contact the administrator.' },
        { status: 500 }
      )
    }

    // Initialize UseSend client (done here to avoid build-time initialization)
    const usesend = new UseSend(process.env.USESEND_API_KEY)

    // Send email using useSend
    await usesend.emails.send({
      to: 'info@hellenicnext.com',
      from: process.env.USESEND_FROM_EMAIL,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>

          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>From:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
          </div>

          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #0066cc;">
            <p style="margin: 0;"><strong>Message:</strong></p>
            <p style="margin: 10px 0; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>This email was sent from the Hellenic Next contact form.</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This email was sent from the Hellenic Next contact form.
      `,
      headers: {
        'Reply-To': email,
      },
    })

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { message: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}
