CREATE TABLE `signup_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`google_user_id` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`google_id` text NOT NULL,
	`name` text NOT NULL,
	`profile` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `signup_sessions_google_user_id_unique` ON `signup_sessions` (`google_user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_google_id_unique` ON `users` (`google_id`);