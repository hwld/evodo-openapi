PRAGMA foreign_keys=off;

BEGIN TRANSACTION;

ALTER TABLE `users` RENAME TO `_users_old`;

CREATE TABLE `users` (
  `id` text PRIMARY KEY,
  `name` text NOT NULL,
  `created_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP
 );

 INSERT INTO `users` (`id`, `name`, `created_at`, `updated_at`)
  SELECT `id`, `name`, `created_at`, `updated_at`
  FROM `_users_old`;

COMMIT;

PRAGMA foreign_keys=on;