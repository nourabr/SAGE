/*
  Warnings:

  - You are about to drop the column `testUrl` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "testUrl",
ADD COLUMN     "refImage" TEXT NOT NULL DEFAULT '';
