/*
  Warnings:

  - You are about to drop the column `ifBeginWith` on the `competitors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "competitors" DROP COLUMN "ifBeginWith",
ADD COLUMN     "waitUntilEventName" TEXT NOT NULL DEFAULT '';
