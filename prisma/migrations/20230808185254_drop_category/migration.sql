/*
  Warnings:

  - You are about to drop the column `categoryName` on the `competitors` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "competitors" DROP COLUMN "categoryName";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "category";
