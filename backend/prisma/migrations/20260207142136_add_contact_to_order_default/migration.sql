-- AlterTable
ALTER TABLE `order` ADD COLUMN `contactAddress` VARCHAR(191) NULL,
    ADD COLUMN `contactCity` VARCHAR(191) NULL,
    ADD COLUMN `contactName` VARCHAR(191) NOT NULL DEFAULT 'Client',
    ADD COLUMN `contactPhone` VARCHAR(191) NULL,
    ADD COLUMN `contactZip` VARCHAR(191) NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL;
