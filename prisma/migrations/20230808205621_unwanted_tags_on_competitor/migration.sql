-- AlterTable
ALTER TABLE "competitors" ADD COLUMN     "unwantedTags" TEXT[] DEFAULT ARRAY[]::TEXT[];
