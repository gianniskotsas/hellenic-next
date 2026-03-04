import { NextRequest } from 'next/server'

export function getBaseUrl(request: NextRequest): string {
  const proto = request.headers.get('x-forwarded-proto') || 'http'
  const host = request.headers.get('host') || 'localhost:3000'
  return process.env.NEXT_PUBLIC_SITE_URL || `${proto}://${host}`
}
