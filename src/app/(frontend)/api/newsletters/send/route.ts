import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { renderNewsletterHtml } from '@/emails/renderNewsletter'
import { getBaseUrl } from '@/lib/getBaseUrl'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.USESEND_API_KEY || !process.env.USESEND_FROM_EMAIL) {
      return NextResponse.json(
        { message: 'Email service is not configured. Set USESEND_API_KEY and USESEND_FROM_EMAIL.' },
        { status: 500 },
      )
    }

    const { id } = await request.json() as { id: string }
    if (!id) {
      return NextResponse.json({ message: 'Newsletter ID is required' }, { status: 400 })
    }

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

    // Determine which UseSend contact book to use based on recipient group
    const contactBookId = newsletter.recipientGroup === 'nl'
      ? process.env.USESEND_CONTACTS_NL
      : process.env.USESEND_CONTACTS_GLOBAL

    if (!contactBookId) {
      return NextResponse.json(
        { message: `Contact book not configured for group "${newsletter.recipientGroup}". Set the appropriate USESEND_CONTACTS_* env var.` },
        { status: 500 },
      )
    }

    await payload.update({
      collection: 'newsletters',
      id,
      data: { status: 'sending' },
      overrideAccess: true,
    })

    const baseUrl = getBaseUrl(request)
    const html = await renderNewsletterHtml(newsletter, baseUrl)

    // Create and immediately send a campaign via UseSend REST API directly
    // (bypassing the SDK for better error visibility and control)
    const campaignBody = {
      name: `Newsletter: ${newsletter.subject}`,
      from: process.env.USESEND_FROM_EMAIL!,
      subject: newsletter.subject,
      contactBookId,
      html,
      content: newsletter.subject,
      sendNow: true,
    }

    const campaignResponse = await fetch('https://app.usesend.com/api/v1/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.USESEND_API_KEY}`,
      },
      body: JSON.stringify(campaignBody),
    })

    if (!campaignResponse.ok) {
      const errorBody = await campaignResponse.text()
      console.error('UseSend campaign API error:', campaignResponse.status, errorBody)
      await payload.update({
        collection: 'newsletters',
        id,
        data: { status: 'failed' },
        overrideAccess: true,
      })
      return NextResponse.json(
        { message: `Failed to create email campaign (${campaignResponse.status}): ${errorBody}` },
        { status: 500 },
      )
    }

    const campaign = await campaignResponse.json() as {
      id: string
      total: number
    }

    await payload.update({
      collection: 'newsletters',
      id,
      data: {
        status: 'sent',
        sentAt: new Date().toISOString(),
        totalRecipients: campaign.total,
        totalSent: campaign.total,
        totalFailed: 0,
      },
      overrideAccess: true,
    })

    return NextResponse.json({
      message: `Newsletter campaign created and sending to ${campaign.total} recipients`,
      stats: { totalRecipients: campaign.total, campaignId: campaign.id },
    })
  } catch (error) {
    console.error('Error sending newsletter:', error)

    try {
      const { id } = await request.clone().json() as { id: string }
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
