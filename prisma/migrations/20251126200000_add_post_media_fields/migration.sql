-- AlterTable: Add media fields to Post
ALTER TABLE "Post" ADD COLUMN "coverImage" TEXT;
ALTER TABLE "Post" ADD COLUMN "coverVideo" TEXT;
ALTER TABLE "Post" ADD COLUMN "mediaType" TEXT NOT NULL DEFAULT 'image';
