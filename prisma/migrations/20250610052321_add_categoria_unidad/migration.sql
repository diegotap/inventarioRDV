/*
  Warnings:

  - You are about to alter the column `cantidad` on the `producto` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - Added the required column `categoria` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unidad` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `producto` ADD COLUMN `categoria` VARCHAR(191) NOT NULL,
    ADD COLUMN `unidad` VARCHAR(191) NOT NULL,
    MODIFY `cantidad` DOUBLE NOT NULL;
