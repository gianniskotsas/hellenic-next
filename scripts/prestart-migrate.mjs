/**
 * One-time baseline for databases that were previously managed by the
 * adapter's `push` auto-sync instead of migration files.
 *
 * If the schema already exists (a core table is present) but the
 * `payload_migrations` table is empty, `payload migrate` would try to run the
 * very first migration and fail with "table already exists". To avoid that,
 * record the migrations that predate migrate-on-deploy as already applied, so
 * `payload migrate` only runs newer migrations.
 *
 * Safe to run on every boot: it does nothing on a fresh DB (no core table) or
 * on an already-tracked DB (payload_migrations non-empty). Never fatal.
 */
import { createClient } from '@libsql/client'

// Migrations whose schema is already present on the previously push-managed DB.
const PRE_EXISTING = ['20251121_124509', '20260304_165859']

async function main() {
  const url = process.env.DATABASE_URI || 'file:./hellenic.db'
  const client = createClient({ url })

  const core = await client.execute(
    "select name from sqlite_master where type='table' and name='users'",
  )
  if (core.rows.length === 0) {
    console.log('[prestart] fresh database — migrations will create the schema')
    return
  }

  const hasMigrationsTable = await client.execute(
    "select name from sqlite_master where type='table' and name='payload_migrations'",
  )
  if (hasMigrationsTable.rows.length === 0) {
    console.log('[prestart] existing schema but no payload_migrations table — leaving to payload migrate')
    return
  }

  const cnt = await client.execute('select count(*) as c from payload_migrations')
  const count = Number(cnt.rows[0].c)
  if (count > 0) {
    console.log(`[prestart] payload_migrations already tracks ${count} migration(s) — no baseline needed`)
    return
  }

  const now = new Date().toISOString()
  for (const name of PRE_EXISTING) {
    await client.execute({
      sql: 'INSERT INTO payload_migrations (name, batch, updated_at, created_at) VALUES (?, 1, ?, ?)',
      args: [name, now, now],
    })
  }
  console.log(`[prestart] baselined push-managed DB with ${PRE_EXISTING.length} pre-existing migration(s)`)
}

main()
  .catch((err) => {
    console.error('[prestart] baseline step failed (non-fatal):', err?.message || err)
  })
  .finally(() => process.exit(0))
