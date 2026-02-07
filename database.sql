-- Roofer Univers MySQL schema bootstrap
-- Run this in XAMPP phpMyAdmin or mysql CLI

-- 1) Create databases
CREATE DATABASE IF NOT EXISTS `roofer_univers` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS `roofer_univers_shadow` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `roofer_univers`;

-- 2) Tables (aligned with Prisma schema)
CREATE TABLE IF NOT EXISTS `User` (
  `id` CHAR(36) NOT NULL DEFAULT (uuid()),
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(50),
  `role` ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
  `emailVerified` TINYINT(1) NOT NULL DEFAULT 0,
  `verificationToken` VARCHAR(191),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Category` (
  `id` CHAR(36) NOT NULL DEFAULT (uuid()),
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Product` (
  `id` CHAR(36) NOT NULL DEFAULT (uuid()),
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `description` TEXT NOT NULL,
  `categoryId` CHAR(36) NOT NULL,
  `images` JSON NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_product_category` (`categoryId`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Cart` (
  `id` CHAR(36) NOT NULL DEFAULT (uuid()),
  `userId` CHAR(36) NOT NULL UNIQUE,
  `items` JSON NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Order` (
  `id` CHAR(36) NOT NULL DEFAULT (uuid()),
  `userId` CHAR(36) NOT NULL,
  `items` JSON NOT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_user` (`userId`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Favorite` (
  `userId` CHAR(36) NOT NULL,
  `productId` CHAR(36) NOT NULL,
  PRIMARY KEY (`userId`,`productId`),
  CONSTRAINT `fk_fav_user` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fav_product` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3) Seed an admin account (change email/password hash as needed)
-- Password here is bcrypt for "Admin@123"
INSERT INTO `User` (`id`,`email`,`password`,`name`,`role`,`emailVerified`,`createdAt`)
VALUES (UUID(), 'admin@roofer-univers.com', '$2a$10$7xHRgDnDEapYbS/fWznEtumAEZ1awjWEIHJXOpK89B2AUQLDMsxUe', 'Admin', 'ADMIN', 1, NOW())
ON DUPLICATE KEY UPDATE role='ADMIN', emailVerified=1;

-- 4) Optional: create MySQL user with limited scope (adjust if you use root)
-- CREATE USER 'roofer'@'localhost' IDENTIFIED BY 'rooferpass';
-- GRANT ALL PRIVILEGES ON roofer_univers.* TO 'roofer'@'localhost';
-- GRANT ALL PRIVILEGES ON roofer_univers_shadow.* TO 'roofer'@'localhost';
-- FLUSH PRIVILEGES;

-- 5) Env connection (keep JWT_SECRET and SMTP unchanged):
-- backend/.env ->
-- DATABASE_URL="mysql://root:@localhost:3306/roofer_univers"
-- SHADOW_DATABASE_URL="mysql://root:@localhost:3306/roofer_univers_shadow"

