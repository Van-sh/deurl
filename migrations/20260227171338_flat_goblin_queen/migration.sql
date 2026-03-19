CREATE TABLE `url_shortener_link` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`originalUrl` text NOT NULL,
	`clickCount` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_url_shortener_link_user_id_url_shortener_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `url_shortener_user`(`id`) ON DELETE CASCADE
);
