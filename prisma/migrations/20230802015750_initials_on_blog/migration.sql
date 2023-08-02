/*
  Warnings:

  - You are about to drop the column `apiKey` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `blogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "apiKey",
DROP COLUMN "password",
DROP COLUMN "user",
ADD COLUMN     "initials" TEXT NOT NULL DEFAULT '';
