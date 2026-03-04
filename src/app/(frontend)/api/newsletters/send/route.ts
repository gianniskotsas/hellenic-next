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

    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ message: 'Newsletter ID is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const newsletter = await payload.findByID({
      collection: 'newsletters',
      id,
      depth: 2,
      overrideAccess: true,
    })

    if (newsletter.status === 'sent') {
      return NextResponse.json(
        { message: 'This newsletter has already been sent' },
        { status: 400 },
      )
    }

    await payload.update({
      collection: 'newsletters',
      id,
      data: { status: 'sending' },
      overrideAccess: true,
    })

    let where = {}
    if (newsletter.recipientGroup === 'nl') {
      where = { country: { equals: 'NL' } }
    }

    const recipients = await payload.find({
      collection: 'members',
      where,
      limit: 10000,
      overrideAccess: true,
    })

    const totalRecipients = recipients.docs.length

    if (totalRecipients === 0) {
      await payload.update({
        collection: 'newsletters',
        id,
        data: { status: 'failed', totalRecipients: 0, totalSent: 0, totalFailed: 0 },
        overrideAccess: true,
      })
      return NextResponse.json(
        { message: 'No recipients found for the selected group' },
        { status: 400 },
      )
    }

    const baseUrl = getBaseUrl(request)
    const usesend = new UseSend(process.env.USESEND_API_KEY)
    let sent = 0
    let failed = 0

    for (const member of recipients.docs) {
      try {
        const recipientName = `${member.firstName} ${member.lastName}`.trim()
        const html = await renderNewsletterHtml(newsletter, baseUrl, recipientName || undefined)

        await usesend.emails.send({
          to: member.email,
          from: process.env.USESEND_FROM_EMAIL!,
          subject: newsletter.subject,
          html,
        })
        sent++
      } catch (err) {
        console.error(`Failed to send to ${member.email}:`, err)
        failed++
      }
    }

    const finalStatus = failed === totalRecipients ? 'failed' : 'sent'
    await payload.update({
      collection: 'newsletters',
      id,
      data: {
        status: finalStatus,
        sentAt: new Date().toISOString(),
        totalRecipients,
        totalSent: sent,
        totalFailed: failed,
      },
      overrideAccess: true,
    })

    return NextResponse.json({
      message: `Newsletter sent: ${sent} delivered, ${failed} failed out of ${totalRecipients} recipients`,
      stats: { totalRecipients, sent, failed },
    })
  } catch (error) {
    console.error('Error sending newsletter:', error)

    try {
      const { id } = await request.clone().json()
      if (id) {
        const innerPayload = await getPayload({ config })
        await innerPayload.update({
          collection: 'newsletters',
          id,
          data: { status: 'failed' },
          overrideAccess: true,
        })
      }
    } catch (_ignored) {
      // cleanup errors are non-critical
    }

    return NextResponse.json(
      { message: 'Failed to send newsletter. Check server logs for details.' },
      { status: 500 },
    )
  }
}
