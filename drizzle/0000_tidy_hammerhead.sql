CREATE TABLE IF NOT EXISTS `user_key` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`hashed_password` varchar(255),
	CONSTRAINT `user_key_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `messages` (
	`id` varchar(15) NOT NULL,
	`content` text,
	`role` enum('system','user','assistant','tool','function') NOT NULL,
	`tool_calls` json,
	`user_id` varchar(15) NOT NULL,
	`name` varchar(15) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `user_session` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`active_expires` bigint NOT NULL,
	`idle_expires` bigint NOT NULL,
	CONSTRAINT `user_session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `auth_user` (
	`id` varchar(15) NOT NULL,
	`username` varchar(255) NOT NULL,
	CONSTRAINT `auth_user_id` PRIMARY KEY(`id`)
);
