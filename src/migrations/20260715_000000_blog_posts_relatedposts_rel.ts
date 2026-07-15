import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/**
 * Reconcile the `blog_posts_rels.blog_posts_id` column.
 *
 * The schema-of-record (migration 20251121_124509) already creates
 * `blog_posts_rels` with a `blog_posts_id` column for the BlogPosts
 * `relatedPosts` relationship (relationTo: 'blog-posts'). However, the
 * production database was managed with the adapter's `push` auto-sync
 * rather than these migration files, and it predates the `relatedPosts`
 * field — so its `blog_posts_rels` table can be missing that column,
 * which makes any blog query that selects related posts fail with
 * `SQLITE_ERROR: no such column: blog_posts_id`.
 *
 * This migration is idempotent: it checks for the column first and only adds
 * it when absent, so it is safe on both drifted and already-correct
 * databases (a failing `ALTER` cannot be swallowed inside Payload's migration
 * transaction, so we must avoid raising it at all).
 */
async function columnExists(
  db: MigrateUpArgs['db'],
  table: string,
  column: string,
): Promise<boolean> {
  const res: any = await db.run(
    sql`SELECT COUNT(*) AS n FROM pragma_table_info(${table}) WHERE name = ${column}`,
  )
  const row = res?.rows?.[0] ?? (Array.isArray(res) ? res[0] : undefined)
  const n = row ? Number(row.n ?? row['n'] ?? row[0] ?? 0) : 0
  return n > 0
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  if (!(await columnExists(db, 'blog_posts_rels', 'blog_posts_id'))) {
    await db.run(
      sql`ALTER TABLE \`blog_posts_rels\` ADD COLUMN \`blog_posts_id\` integer REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade`,
    )
  }

  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`blog_posts_rels_blog_posts_id_idx\` ON \`blog_posts_rels\` (\`blog_posts_id\`)`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`blog_posts_rels_blog_posts_id_idx\``)
  // Note: dropping a column requires SQLite >= 3.35; the nullable column is
  // left in place on down() to stay compatible with older engines.
}
