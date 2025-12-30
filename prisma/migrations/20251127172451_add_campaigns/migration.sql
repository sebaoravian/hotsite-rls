-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "utm_campaign" TEXT NOT NULL,
    "utm_source" TEXT NOT NULL,
    "utm_medium" TEXT NOT NULL,
    "utm_term" TEXT,
    "utm_content" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_utm_campaign_key" ON "Campaign"("utm_campaign");
