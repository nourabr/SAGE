/*
  Warnings:

  - You are about to drop the column `initials` on the `blogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "initials",
ADD COLUMN     "password" TEXT NOT NULL DEFAULT '';
