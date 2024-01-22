ALTER TABLE `auth_user` RENAME COLUMN `identities` TO `discord_username`;--> statement-breakpoint
ALTER TABLE `auth_user` MODIFY COLUMN `discord_username` varchar(255);