/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `StopWord` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `StopWord` table without a default value. This is not possible if the table is not empty.
  - Made the column `value` on table `StopWord` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `StopWord` ADD COLUMN `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    MODIFY `value` VARCHAR(31) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `uq_stopWord_value` ON `StopWord`(`value`);
