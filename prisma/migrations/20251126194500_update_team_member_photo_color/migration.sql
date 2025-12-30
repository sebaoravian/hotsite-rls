-- AlterTable: Rename image to photo and add color field to TeamMember
-- Step 1: Create new columns
ALTER TABLE "TeamMember" ADD COLUMN "photo" TEXT;
ALTER TABLE "TeamMember" ADD COLUMN "color" TEXT;

-- Step 2: Copy data from image to photo
UPDATE "TeamMember" SET "photo" = "image";

-- Step 3: Set default color for existing rows
UPDATE "TeamMember" SET "color" = '#1967D2';

-- Step 4: Make the new columns required (SQLite limitation workaround)
-- SQLite doesn't support ALTER COLUMN, so we need to recreate the table

-- Create new table with correct schema
CREATE TABLE "TeamMember_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "TeamSection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Copy all data
INSERT INTO "TeamMember_new" ("id", "name", "role", "bio", "photo", "color", "order", "teamId", "createdAt", "updatedAt")
SELECT "id", "name", "role", "bio", "photo", "color", "order", "teamId", "createdAt", "updatedAt"
FROM "TeamMember";

-- Drop old table
DROP TABLE "TeamMember";

-- Rename new table
ALTER TABLE "TeamMember_new" RENAME TO "TeamMember";
