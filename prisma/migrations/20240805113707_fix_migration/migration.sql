/*
  Warnings:

  - You are about to drop the column `score` on the `Grade` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Grade` table. All the data in the column will be lost.
  - Added the required column `month` to the `Grade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scores` to the `Grade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Grade` DROP COLUMN `score`,
    DROP COLUMN `subject`,
    ADD COLUMN `month` VARCHAR(191) NOT NULL,
    ADD COLUMN `scores` JSON NOT NULL;
