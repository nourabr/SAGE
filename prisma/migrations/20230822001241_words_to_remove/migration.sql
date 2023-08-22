/*
  Warnings:

  - You are about to drop the column `removeLast` on the `competitors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "competitors" DROP COLUMN "removeLast",
ADD COLUMN     "wordsToRemove" TEXT[] DEFAULT ARRAY[]::TEXT[];
