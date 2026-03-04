# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Hellenic Next is a single-process Next.js 15 + Payload CMS 3 monolith deployed on Cloudflare Workers. Running `pnpm dev` starts everything: Next.js, Payload CMS admin, and locally-emulated Cloudflare bindings (D1 SQLite + R2 blob storage via Wrangler/miniflare). No Docker, no external database, no separate services.

### Critical: wrangler.jsonc `remote` flag

The D1 database config in `wrangler.jsonc` has a `"remote"` field. For local development this **must** be `false`. If set to `true`, `initOpenNextCloudflareForDev()` in `next.config.ts` will fail with "You must be logged in to use wrangler dev in remote mode." The `payload.config.ts` separately handles this via `experimental: { remoteBindings: false }`, but the Next.js config does not pass that option.

### Environment variables

Only `PAYLOAD_SECRET` is required. Create `.env.local` with any random string:
```
PAYLOAD_SECRET=<any-random-string>
```
SMTP and useSend env vars are optional (email features degrade gracefully).

### Running the app

- **Dev server**: `pnpm dev` (serves frontend at http://localhost:3000, admin at http://localhost:3000/admin)
- **Lint**: `pnpm lint`
- **Integration tests**: `pnpm test:int` (uses Vitest; has a pre-existing jsdom + esbuild `TextEncoder` incompatibility — the test infrastructure needs fixing upstream)
- **E2E tests**: `pnpm test:e2e` (Playwright; requires `npx playwright install` first)

### First-time admin setup

After starting the dev server, visit `/admin` to create the first admin user. The local D1 database is stored in `.wrangler/` and persists across restarts.

### Newsletter feature

The newsletter system uses `@react-email/render` + `@react-email/components` for email templates, and `usesend-js` for delivery. Key files:
- Collection: `src/collections/Newsletters.ts`
- Template: `src/emails/NewsletterTemplate.tsx` (swap this for custom templates)
- API routes: `src/app/(frontend)/api/newsletters/{send,send-test,preview}/route.ts`
- Admin UI component: `src/components/admin/NewsletterActions/index.tsx`

After modifying the Newsletters collection or its custom component path, run `pnpm generate:importmap` to regenerate `src/app/(payload)/admin/importMap.js`.

### Known issues

- `pnpm test:int` fails with "Invariant violation: TextEncoder" due to jsdom environment conflicting with esbuild. This is a pre-existing issue unrelated to environment setup.
- The homepage (`/`) redirects authenticated users to `/admin`. Public frontend pages are at `/join`, `/events`, `/contact`, `/blog`, `/about`.
