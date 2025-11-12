/*
  Warnings:

  - The values [BRONZE,SILVER,GOLD,DIAMOND] on the enum `SubscriptionTier` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `monthlyFee` on the `subscriptions` table. All the data in the column will be lost.
  - Added the required column `promoPrice` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regularPrice` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionTier_new" AS ENUM ('STARTER', 'GROWTH');
ALTER TABLE "public"."restaurants" ALTER COLUMN "subscriptionTier" DROP DEFAULT;
ALTER TABLE "restaurants" ALTER COLUMN "subscriptionTier" TYPE "SubscriptionTier_new" USING ("subscriptionTier"::text::"SubscriptionTier_new");
ALTER TABLE "subscriptions" ALTER COLUMN "tier" TYPE "SubscriptionTier_new" USING ("tier"::text::"SubscriptionTier_new");
ALTER TYPE "SubscriptionTier" RENAME TO "SubscriptionTier_old";
ALTER TYPE "SubscriptionTier_new" RENAME TO "SubscriptionTier";
DROP TYPE "public"."SubscriptionTier_old";
ALTER TABLE "restaurants" ALTER COLUMN "subscriptionTier" SET DEFAULT 'STARTER';
COMMIT;

-- AlterTable
ALTER TABLE "restaurants" ALTER COLUMN "subscriptionTier" SET DEFAULT 'STARTER';

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "monthlyFee",
ADD COLUMN     "promoPrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "regularPrice" DECIMAL(10,2) NOT NULL;
