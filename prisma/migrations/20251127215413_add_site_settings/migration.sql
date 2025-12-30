-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteName" TEXT NOT NULL DEFAULT 'RotomLabs',
    "siteTitle" TEXT NOT NULL DEFAULT 'RotomLabs — Digital Backbone',
    "siteDescription" TEXT NOT NULL DEFAULT 'RotomLabs builds the digital backbone behind global companies: cloud architecture, data, AI, mobile platforms and secure integrations.',
    "siteKeywords" TEXT,
    "ogImage" TEXT,
    "twitterHandle" TEXT NOT NULL DEFAULT '@rotom_labs',
    "googleAnalyticsId" TEXT,
    "googleSiteVerification" TEXT,
    "googleTagManagerId" TEXT,
    "facebookAppId" TEXT,
    "linkedinUrl" TEXT NOT NULL DEFAULT 'https://linkedin.com/company/rotomlabs',
    "instagramUrl" TEXT NOT NULL DEFAULT 'https://instagram.com/rotom_labs',
    "canonicalUrl" TEXT NOT NULL DEFAULT 'https://rotom-labs.com',
    "locale" TEXT NOT NULL DEFAULT 'en_US',
    "language" TEXT NOT NULL DEFAULT 'en',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
