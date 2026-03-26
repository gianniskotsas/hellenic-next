import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { UseSend } from 'usesend-js'
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

    const usesend = new UseSend(process.env.USESEND_API_KEY)

    // Strip HTML tags to create a plain text version for the campaign
    const content = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

    // Create and immediately send a campaign to the UseSend contact book
    const { data: campaign, error: campaignError } = await usesend.campaigns.create({
      name: `Newsletter: ${newsletter.subject}`,
      from: process.env.USESEND_FROM_EMAIL!,
      subject: newsletter.subject,
      contactBookId,
      html,
      content,
      sendNow: true,
    })

    if (campaignError || !campaign) {
      console.error('Failed to create UseSend campaign:', JSON.stringify(campaignError, null, 2))
      console.error('Campaign response data:', JSON.stringify(campaign, null, 2))
      await payload.update({
        collection: 'newsletters',
        id,
        data: { status: 'failed' },
        overrideAccess: true,
      })
      // The SDK may return error as { message, code } or as { error: { message, code } }
      const err = campaignError as Record<string, unknown> | null
      const errorMsg = err?.message as string
        || (err?.error as Record<string, unknown>)?.message as string
        || (typeof campaignError === 'string' ? campaignError : null)
        || JSON.stringify(campaignError)
        || 'Unknown error'
      return NextResponse.json(
        { message: `Failed to create email campaign: ${errorMsg}` },
        { status: 500 },
      )
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
