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
 * This migration adds the column (and its index) if — and only if — it is
 * absent, so it is safe to run against both drifted and already-correct
 * databases.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  try {
    await db.run(
      sql`ALTER TABLE \`blog_posts_rels\` ADD COLUMN \`blog_posts_id\` integer REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade`,
    )
  } catch (err: unknown) {
    // Column already present (correct schema) — ignore only that case.
    const message = err instanceof Error ? err.message : String(err)
    if (!/duplicate column name/i.test(message)) throw err
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
