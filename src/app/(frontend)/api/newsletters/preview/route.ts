import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { renderNewsletterHtml } from '@/emails/renderNewsletter'
import { getBaseUrl } from '@/lib/getBaseUrl'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ message: 'Newsletter ID is required' }, { status: 400 })
    }
    const newsletter = await payload.findByID({
      collection: 'newsletters',
      id,
      depth: 2,
      overrideAccess: true,
    })

    const baseUrl = getBaseUrl(request)
    const html = await renderNewsletterHtml(newsletter, baseUrl, 'Preview User')

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
