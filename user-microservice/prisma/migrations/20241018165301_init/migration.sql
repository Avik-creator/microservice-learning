/*
  Warnings:

  - Added the required column `name` to the `refreshTokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "refreshTokens" ADD COLUMN     "name" TEXT NOT NULL;
