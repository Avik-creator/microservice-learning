/*
  Warnings:

  - Added the required column `city` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pincode` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAddress` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "pincode" TEXT NOT NULL,
ADD COLUMN     "shippingAddress" TEXT NOT NULL;
