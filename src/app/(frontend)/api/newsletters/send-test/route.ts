import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { UseSend } from 'usesend-js'
import { cookies } from 'next/headers'
import { renderNewsletterHtml } from '@/emails/renderNewsletter'

export const dynamic = 'force-dynamic'

function getBaseUrl(request: NextRequest): string {
  const proto = request.headers.get('x-forwarded-proto') || 'http'
  const host = request.headers.get('host') || 'localhost:3000'
  return process.env.NEXT_PUBLIC_SITE_URL || `${proto}://${host}`
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.USESEND_API_KEY || !process.env.USESEND_FROM_EMAIL) {
      return NextResponse.json(
        { message: 'Email service is not configured. Set USESEND_API_KEY and USESEND_FROM_EMAIL.' },
        { status: 500 },
      )
    }

    const { id, testEmail } = await request.json()

    if (!id) {
      return NextResponse.json({ message: 'Newsletter ID is required' }, { status: 400 })
    }
    if (!testEmail) {
      return NextResponse.json({ message: 'Test email address is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const newsletter = await payload.findByID({
      collection: 'newsletters',
      id,
      depth: 2,
      overrideAccess: true,
    })

    const baseUrl = getBaseUrl(request)
    const html = await renderNewsletterHtml(newsletter, baseUrl, 'Test Recipient')

    const usesend = new UseSend(process.env.USESEND_API_KEY)
    await usesend.emails.send({
      to: testEmail,
      from: process.env.USESEND_FROM_EMAIL,
      subject: `[TEST] ${newsletter.subject}`,
      html,
    })

    return NextResponse.json({
      message: `Test email sent to ${testEmail}`,
    })
  } catch (error) {
    console.error('Error sending test email:', error)
    return NextResponse.json(
      { message: 'Failed to send test email. Check server logs for details.' },
      { status: 500 },
    )
  }
}
