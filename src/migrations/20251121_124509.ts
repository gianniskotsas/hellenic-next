import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`members\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`first_name\` text NOT NULL,
  	\`last_name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`country\` text NOT NULL,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`members_email_idx\` ON \`members\` (\`email\`);`)
  await db.run(sql`CREATE INDEX \`members_updated_at_idx\` ON \`members\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`members_created_at_idx\` ON \`members\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`blog_posts_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blog_posts_tags_order_idx\` ON \`blog_posts_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_tags_parent_id_idx\` ON \`blog_posts_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`blog_posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`excerpt\` text NOT NULL,
  	\`featured_image_id\` integer,
  	\`content\` text NOT NULL,
  	\`author_name\` text NOT NULL,
  	\`author_title\` text,
  	\`author_bio\` text,
  	\`author_avatar_id\` integer,
  	\`published_date\` text NOT NULL,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`featured\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`author_avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`blog_posts_slug_idx\` ON \`blog_posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_featured_image_idx\` ON \`blog_posts\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_author_author_avatar_idx\` ON \`blog_posts\` (\`author_avatar_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_updated_at_idx\` ON \`blog_posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_created_at_idx\` ON \`blog_posts\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`blog_posts_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`blog_categories_id\` integer,
  	\`blog_posts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blog_categories_id\`) REFERENCES \`blog_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blog_posts_id\`) REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blog_posts_rels_order_idx\` ON \`blog_posts_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_rels_parent_idx\` ON \`blog_posts_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_rels_path_idx\` ON \`blog_posts_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_rels_blog_categories_id_idx\` ON \`blog_posts_rels\` (\`blog_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_rels_blog_posts_id_idx\` ON \`blog_posts_rels\` (\`blog_posts_id\`);`)
  await db.run(sql`CREATE TABLE \`blog_categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`blog_categories_slug_idx\` ON \`blog_categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`blog_categories_updated_at_idx\` ON \`blog_categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`blog_categories_created_at_idx\` ON \`blog_categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`events_organizers\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`avatar_id\` integer,
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`events_organizers_order_idx\` ON \`events_organizers\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`events_organizers_parent_id_idx\` ON \`events_organizers\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`events_organizers_avatar_idx\` ON \`events_organizers\` (\`avatar_id\`);`)
  await db.run(sql`CREATE TABLE \`events_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`events_tags_order_idx\` ON \`events_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`events_tags_parent_id_idx\` ON \`events_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`events\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`excerpt\` text,
  	\`featured_image_id\` integer,
  	\`event_details_start_date\` text NOT NULL,
  	\`event_details_end_date\` text,
  	\`event_details_start_time\` text NOT NULL,
  	\`event_details_end_time\` text,
  	\`event_details_location\` text NOT NULL,
  	\`event_details_address\` text,
  	\`event_details_city\` text,
  	\`event_details_country\` text,
  	\`registration_registration_url\` text,
  	\`registration_registration_button_text\` text,
  	\`registration_max_attendees\` numeric,
  	\`registration_registration_deadline\` text,
  	\`attendee_count\` numeric,
  	\`status\` text DEFAULT 'upcoming' NOT NULL,
  	\`featured\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`events_slug_idx\` ON \`events\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`events_featured_image_idx\` ON \`events\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`events_updated_at_idx\` ON \`events\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`events_created_at_idx\` ON \`events\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`members_id\` integer REFERENCES members(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`blog_posts_id\` integer REFERENCES blog_posts(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`blog_categories_id\` integer REFERENCES blog_categories(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`events_id\` integer REFERENCES events(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_members_id_idx\` ON \`payload_locked_documents_rels\` (\`members_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_blog_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`blog_posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_blog_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`blog_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_events_id_idx\` ON \`payload_locked_documents_rels\` (\`events_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`members\`;`)
  await db.run(sql`DROP TABLE \`blog_posts_tags\`;`)
  await db.run(sql`DROP TABLE \`blog_posts\`;`)
  await db.run(sql`DROP TABLE \`blog_posts_rels\`;`)
  await db.run(sql`DROP TABLE \`blog_categories\`;`)
  await db.run(sql`DROP TABLE \`events_organizers\`;`)
  await db.run(sql`DROP TABLE \`events_tags\`;`)
  await db.run(sql`DROP TABLE \`events\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
}
