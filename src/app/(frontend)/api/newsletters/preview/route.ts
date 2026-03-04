import { NextRequest, NextResponse } from 'next/server'
import { render } from '@react-email/render'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { NewsletterTemplate } from '@/emails/NewsletterTemplate'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { subject, previewText, heading, body, ctaText, ctaUrl } = await request.json()

    if (!subject || !heading || !body) {
      return NextResponse.json(
        { message: 'Subject, heading, and body are required' },
        { status: 400 },
      )
    }

    const html = await render(
      NewsletterTemplate({
        subject,
        previewText: previewText || '',
        heading,
        body,
        ctaText: ctaText || undefined,
        ctaUrl: ctaUrl || undefined,
        recipientName: 'Preview User',
      }),
    )

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (error) {
    console.error('Error generating preview:', error)
    return NextResponse.json(
      { message: 'Failed to generate preview' },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ message: 'Newsletter ID is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const newsletter = await payload.findByID({
      collection: 'newsletters',
      id,
      overrideAccess: true,
    })

    const html = await render(
      NewsletterTemplate({
        subject: newsletter.subject,
        previewText: newsletter.previewText || '',
        heading: newsletter.heading,
        body: newsletter.body,
        ctaText: newsletter.ctaText || undefined,
        ctaUrl: newsletter.ctaUrl || undefined,
        recipientName: 'Preview User',
      }),
    )

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (error) {
    console.error('Error generating preview:', error)
    return NextResponse.json(
      { message: 'Failed to generate preview' },
      { status: 500 },
    )
  }
}
