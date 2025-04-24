/*
  Warnings:

  - Made the column `verified` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "verified" SET NOT NULL,
ALTER COLUMN "verified" SET DEFAULT false;
