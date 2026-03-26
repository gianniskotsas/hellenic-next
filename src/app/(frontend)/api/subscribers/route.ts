import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

interface UseSendContact {
  id: string
  firstName?: string | null
  lastName?: string | null
  email: string
  subscribed: boolean
  properties: Record<string, string>
  contactBookId: string
  createdAt: string
  updatedAt: string
}

async function fetchContacts(
  contactBookId: string,
  apiKey: string,
  page: number,
  limit: number,
): Promise<UseSendContact[]> {
  const url = `https://app.usesend.com/api/v1/contactBooks/${contactBookId}/contacts?page=${page}&limit=${limit}`
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`UseSend API error: ${response.status} - ${errorText}`)
  }

  const data: unknown = await response.json()
  // Handle both array responses and paginated wrapper objects
  if (Array.isArray(data)) return data as UseSendContact[]
  const obj = data as Record<string, unknown>
  return (obj.data ?? obj.contacts ?? []) as UseSendContact[]
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.USESEND_API_KEY) {
      return NextResponse.json(
        { message: 'UseSend API key is not configured. Set USESEND_API_KEY.' },
        { status: 500 },
      )
    }

    const { searchParams } = new URL(request.url)
    const book = searchParams.get('book') || 'all'
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25', 10)))

    const apiKey = process.env.USESEND_API_KEY
    const nlBookId = process.env.USESEND_CONTACTS_NL
    const globalBookId = process.env.USESEND_CONTACTS_GLOBAL

    let contacts: UseSendContact[] = []

    if (book === 'nl') {
      if (!nlBookId) {
        return NextResponse.json(
          { message: 'Netherlands contact book is not configured. Set USESEND_CONTACTS_NL.' },
          { status: 500 },
        )
      }
      contacts = await fetchContacts(nlBookId, apiKey, page, limit)
    } else if (book === 'global') {
      if (!globalBookId) {
        return NextResponse.json(
          { message: 'Global contact book is not configured. Set USESEND_CONTACTS_GLOBAL.' },
          { status: 500 },
        )
      }
      contacts = await fetchContacts(globalBookId, apiKey, page, limit)
    } else {
      // Fetch from both books in parallel
      const results = await Promise.all([
        nlBookId
          ? fetchContacts(nlBookId, apiKey, page, limit).catch(() => [] as UseSendContact[])
          : Promise.resolve([] as UseSendContact[]),
        globalBookId
          ? fetchContacts(globalBookId, apiKey, page, limit).catch(() => [] as UseSendContact[])
          : Promise.resolve([] as UseSendContact[]),
      ])

      // Merge and deduplicate by email (prefer global entry)
      const seen = new Set<string>()
      for (const contact of [...results[1], ...results[0]]) {
        if (!seen.has(contact.email)) {
          seen.add(contact.email)
          contacts.push(contact)
        }
      }
    }

    return NextResponse.json({
      contacts,
      book,
      page,
      limit,
    })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json(
      { message: 'Failed to fetch subscribers. Check server logs for details.' },
      { status: 500 },
    )
  }
}
