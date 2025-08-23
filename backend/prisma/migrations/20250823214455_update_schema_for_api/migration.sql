/*
  Warnings:

  - You are about to drop the column `currentRedemptions` on the `deals` table. All the data in the column will be lost.
  - You are about to drop the column `discountPercent` on the `deals` table. All the data in the column will be lost.
  - You are about to drop the column `discountPrice` on the `deals` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `deals` table. All the data in the column will be lost.
  - You are about to drop the column `maxRedemptions` on the `deals` table. All the data in the column will be lost.
  - You are about to drop the column `originalPrice` on the `deals` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `deals` table. All the data in the column will be lost.
  - You are about to drop the column `validFrom` on the `deals` table. All the data in the column will be lost.
  - You are about to drop the column `validUntil` on the `deals` table. All the data in the column will be lost.
  - You are about to drop the column `isUsed` on the `redemptions` table. All the data in the column will be lost.
  - You are about to drop the column `usedAt` on the `redemptions` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `restaurants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `deals` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `deals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountType` to the `deals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountValue` to the `deals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `deals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cuisineType` to the `restaurants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `restaurants` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "redemptions_code_key";

-- First, create a temporary user for existing restaurant
INSERT INTO "users" ("id", "email", "firstName", "lastName", "password", "role", "createdAt", "updatedAt") 
VALUES ('temp-owner-1', 'temp@example.com', 'Temporary', 'Owner', '$2b$10$dummy.hash.value', 'RESTAURANT_OWNER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- AlterTable for deals - add new columns with defaults first
ALTER TABLE "deals" 
ADD COLUMN     "code" TEXT,
ADD COLUMN     "discountType" TEXT,
ADD COLUMN     "discountValue" DOUBLE PRECISION,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maxUses" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "minOrderAmount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "perUserLimit" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "qrCode" TEXT,
ADD COLUMN     "remainingUses" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "startsAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "terms" TEXT,
ADD COLUMN     "usedCount" INTEGER NOT NULL DEFAULT 0;

-- Update existing deals with default values
UPDATE "deals" SET 
  "code" = 'DEAL-' || "id",
  "discountType" = 'PERCENTAGE',
  "discountValue" = COALESCE("discountPercent", 10),
  "expiresAt" = COALESCE("validUntil", CURRENT_TIMESTAMP + INTERVAL '30 days')
WHERE "code" IS NULL;

-- Now make the columns NOT NULL
ALTER TABLE "deals" 
ALTER COLUMN "code" SET NOT NULL,
ALTER COLUMN "discountType" SET NOT NULL,
ALTER COLUMN "discountValue" SET NOT NULL,
ALTER COLUMN "expiresAt" SET NOT NULL;

-- Drop old columns
ALTER TABLE "deals" 
DROP COLUMN "currentRedemptions",
DROP COLUMN "discountPercent",
DROP COLUMN "discountPrice",
DROP COLUMN "image",
DROP COLUMN "maxRedemptions",
DROP COLUMN "originalPrice",
DROP COLUMN "status",
DROP COLUMN "validFrom",
DROP COLUMN "validUntil";

-- AlterTable
ALTER TABLE "redemptions" DROP COLUMN "isUsed",
DROP COLUMN "usedAt",
ADD COLUMN     "discountAmount" DOUBLE PRECISION,
ADD COLUMN     "finalAmount" DOUBLE PRECISION,
ADD COLUMN     "location" JSONB,
ADD COLUMN     "orderAmount" DOUBLE PRECISION,
ADD COLUMN     "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'COMPLETED';

-- AlterTable for restaurants - add new columns with defaults first
ALTER TABLE "restaurants" 
ADD COLUMN     "averageRating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "cuisineType" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'BRONZE',
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "website" TEXT;

-- Update existing restaurants with default values
UPDATE "restaurants" SET 
  "cuisineType" = 'MIDDLE_EASTERN',
  "ownerId" = 'temp-owner-1'
WHERE "cuisineType" IS NULL;

-- Now make the columns NOT NULL
ALTER TABLE "restaurants" 
ALTER COLUMN "cuisineType" SET NOT NULL,
ALTER COLUMN "ownerId" SET NOT NULL,
ALTER COLUMN "province" DROP NOT NULL;

-- Drop old columns
ALTER TABLE "restaurants" 
DROP COLUMN "password";

-- CreateIndex
CREATE UNIQUE INDEX "deals_code_key" ON "deals"("code");

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
