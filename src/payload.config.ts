// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite' // database-adapter-import
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { s3Storage } from '@payloadcms/storage-s3'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Members } from './collections/Members'
import { BlogPosts } from './collections/BlogPosts'
import { BlogCategories } from './collections/BlogCategories'
import { Events } from './collections/Events'
import { Newsletters } from './collections/Newsletters'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      views: {
        subscribers: {
          Component: '/components/admin/SubscribersView',
          path: '/subscribers',
        },
      },
      afterNavLinks: ['/components/admin/SubscribersNavLink'],
    },
  },
  collections: [Users, Media, Members, BlogPosts, BlogCategories, Events, Newsletters],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // database-adapter-config-start
  // Node SQLite (libSQL). DATABASE_URI points at a file on a persistent volume,
  // e.g. file:/data/hellenic.db. Migrated verbatim from the previous Cloudflare D1
  // database (same Drizzle SQLite schema).
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./hellenic.db',
    },
    // Production uses migrations (run on deploy); `push` stays on only for
    // local dev convenience.
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
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
    // Cloudflare R2 accessed over its S3-compatible API (the bucket itself is
    // unchanged; only the compute moved off Workers). Files are still served
    // through the custom /api/media/file/[filename] route.
    s3Storage({
      collections: {
        media: {
          disableLocalStorage: true,
          // Serve media directly from the existing R2 public custom domain
          // (cdn.hellenicnext.com) — no credentials needed for display. R2
          // write credentials are only required for uploading new media.
          generateFileURL: ({ filename }) => {
            const base = process.env.R2_PUBLIC_URL || 'https://cdn.hellenicnext.com'
            return `${base}/${encodeURIComponent(filename)}`
          },
        },
      },
      bucket: process.env.R2_BUCKET || 'hellenic-next-r2',
      config: {
        endpoint: process.env.R2_S3_ENDPOINT,
        region: 'auto',
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: true,
      },
    }),
  ],
})
