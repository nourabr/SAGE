/*
  Warnings:

  - You are about to drop the column `error` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "error",
ADD COLUMN     "log" TEXT NOT NULL DEFAULT '';
