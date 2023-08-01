-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "testUrl" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "status" SET DEFAULT 'Waiting';
