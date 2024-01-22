ALTER TABLE `auth_user` ADD `name` varchar(255);--> statement-breakpoint
ALTER TABLE `auth_user` ADD `points` bigint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `auth_user` ADD `role` varchar(255) DEFAULT 'npc';