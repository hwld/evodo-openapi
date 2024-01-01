CREATE TABLE `taskMemos` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`task_id` text NOT NULL,
	`author_id` text NOT NULL,
	`created_at` text DEFAULT (strftime('%Y/%m/%d %H:%M:%S', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y/%m/%d %H:%M:%S', 'now')) NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
