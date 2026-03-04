import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { renderNewsletterHtml } from '@/emails/renderNewsletter'

export const dynamic = 'force-dynamic'

function getBaseUrl(request: NextRequest): string {
  const proto = request.headers.get('x-forwarded-proto') || 'http'
  const host = request.headers.get('host') || 'localhost:3000'
  return process.env.NEXT_PUBLIC_SITE_URL || `${proto}://${host}`
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
