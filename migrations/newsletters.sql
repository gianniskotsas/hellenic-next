-- Newsletter tables migration (idempotent - safe to re-run)
CREATE TABLE IF NOT EXISTS `newsletters_cta_buttons` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`url` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `newsletters`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `newsletters_cta_buttons_order_idx` ON `newsletters_cta_buttons` (`_order`);
CREATE INDEX IF NOT EXISTS `newsletters_cta_buttons_parent_id_idx` ON `newsletters_cta_buttons` (`_parent_id`);
CREATE TABLE IF NOT EXISTS `newsletters` (
	`id` integer PRIMARY KEY NOT NULL,
	`template` text DEFAULT 'general' NOT NULL,
	`subject` text NOT NULL,
	`preview_text` text,
	`heading` text NOT NULL,
	`subtitle` text,
	`hero_image_id` integer,
	`body` text NOT NULL,
	`event_details_event_date` text,
	`event_details_event_location` text,
	`recipient_group` text DEFAULT 'all' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`sent_at` text,
	`total_recipients` numeric,
	`total_sent` numeric,
	`total_failed` numeric,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`hero_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE INDEX IF NOT EXISTS `newsletters_hero_image_idx` ON `newsletters` (`hero_image_id`);
CREATE INDEX IF NOT EXISTS `newsletters_updated_at_idx` ON `newsletters` (`updated_at`);
CREATE INDEX IF NOT EXISTS `newsletters_created_at_idx` ON `newsletters` (`created_at`);
