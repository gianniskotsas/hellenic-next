import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET = process.env.R2_BUCKET || 'hellenic-next-r2'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  try {
    const { filename } = await params

    const object = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: filename }))

    if (!object.Body) {
      console.error(`File not found in R2: ${filename}`)
      return new NextResponse('File not found', { status: 404 })
    }

    const bytes = await object.Body.transformToByteArray()

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        'Content-Type': object.ContentType || 'application/octet-stream',
        'Content-Length': String(object.ContentLength ?? bytes.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
        ...(object.ETag ? { ETag: object.ETag } : {}),
      },
    })
  } catch (error: any) {
    if (error?.name === 'NoSuchKey' || error?.$metadata?.httpStatusCode === 404) {
      return new NextResponse('File not found', { status: 404 })
    }
    console.error('Error serving file from R2:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
