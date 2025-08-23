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

-- AlterTable
ALTER TABLE "deals" DROP COLUMN "currentRedemptions",
DROP COLUMN "discountPercent",
DROP COLUMN "discountPrice",
DROP COLUMN "image",
DROP COLUMN "maxRedemptions",
DROP COLUMN "originalPrice",
DROP COLUMN "status",
DROP COLUMN "validFrom",
DROP COLUMN "validUntil",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "discountType" TEXT NOT NULL,
ADD COLUMN     "discountValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maxUses" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "minOrderAmount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "perUserLimit" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "qrCode" TEXT,
ADD COLUMN     "remainingUses" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "startsAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "terms" TEXT,
ADD COLUMN     "usedCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "redemptions" DROP COLUMN "isUsed",
DROP COLUMN "usedAt",
ADD COLUMN     "discountAmount" DOUBLE PRECISION,
ADD COLUMN     "finalAmount" DOUBLE PRECISION,
ADD COLUMN     "location" JSONB,
ADD COLUMN     "orderAmount" DOUBLE PRECISION,
ADD COLUMN     "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'COMPLETED';

-- AlterTable
ALTER TABLE "restaurants" DROP COLUMN "password",
ADD COLUMN     "averageRating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "cuisineType" TEXT NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'BRONZE',
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "website" TEXT,
ALTER COLUMN "province" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "deals_code_key" ON "deals"("code");

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
