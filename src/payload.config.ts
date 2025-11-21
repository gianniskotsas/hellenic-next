// storage-adapter-import-placeholder
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite' // database-adapter-import
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
import { r2Storage } from '@payloadcms/storage-r2'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Members } from './collections/Members'
import { BlogPosts } from './collections/BlogPosts'
import { BlogCategories } from './collections/BlogCategories'
import { Events } from './collections/Events'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Detect if we're running Payload CLI commands (generate/migrate)
const isPayloadCommand = process.argv.find((value) => value.match(/^(generate|migrate):?/))

// Detect if we're in Cloudflare runtime (set by wrangler.jsonc vars)
const isCloudflareRuntime = process.env.CLOUDFLARE_RUNTIME === 'true'

// Get Cloudflare context based on environment
const cloudflare =
  isPayloadCommand || !isCloudflareRuntime
    ? await getCloudflareContextFromWrangler() // Local dev/build or Payload commands
    : await getCloudflareContext({ async: true }) // Cloudflare Workers/Pages runtime

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Members, BlogPosts, BlogCategories, Events],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // database-adapter-config-start
  db: sqliteD1Adapter({
    binding: cloudflare.env.D1,
    push: true  // Auto-sync schema to database
  }),
  // database-adapter-config-end
  // Only configure email if SMTP credentials are provided
  ...(process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS &&
  process.env.EMAIL_FROM_ADDRESS
    ? {
        email: nodemailerAdapter({
          defaultFromAddress: process.env.EMAIL_FROM_ADDRESS,
          defaultFromName: process.env.EMAIL_FROM_NAME || '',
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          },
        }),
      }
    : {}),
  plugins: [
    // storage-adapter-placeholder
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
  ],
})

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        experimental: { remoteBindings: false },
      } satisfies GetPlatformProxyOptions),
  )
}
