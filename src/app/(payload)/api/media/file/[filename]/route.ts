import { getCloudflareContext } from '@opennextjs/cloudflare'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  try {
    const { env } = await getCloudflareContext()
    const { filename } = await params

    if (!env.R2) {
      console.error('R2 binding not available')
      return new NextResponse('R2 binding not available', { status: 500 })
    }

    // Fetch file from R2
    const object = await env.R2.get(filename)

    if (!object) {
      console.error(`File not found in R2: ${filename}`)
      return new NextResponse('File not found', { status: 404 })
    }

    // Get the file content
    const blob = await object.blob()

    // Return the file with appropriate headers
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
        'Content-Length': object.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        ETag: object.etag,
      },
    })
  } catch (error) {
    console.error('Error serving file from R2:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
