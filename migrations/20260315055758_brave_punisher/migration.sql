PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_url_shortener_link` (
	`id` integer PRIMARY KEY,
	`code` text NOT NULL UNIQUE,
	`originalUrl` text NOT NULL,
	`user_id` text NOT NULL,
	`clickCount` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_url_shortener_link_user_id_url_shortener_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `url_shortener_user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_url_shortener_link`(`code`, `user_id`, `originalUrl`, `clickCount`, `created_at`, `updated_at`) SELECT `id`, `user_id`, `originalUrl`, `clickCount`, `created_at`, `updated_at` FROM `url_shortener_link`;--> statement-breakpoint
DROP TABLE `url_shortener_link`;--> statement-breakpoint
ALTER TABLE `__new_url_shortener_link` RENAME TO `url_shortener_link`;--> statement-breakpoint
PRAGMA foreign_keys=ON;