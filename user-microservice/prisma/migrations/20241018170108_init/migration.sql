/*
  Warnings:

  - You are about to drop the column `email` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `Profile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Profile_token_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "token";
