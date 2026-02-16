/*
  Warnings:

  - You are about to drop the column `experience` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "experience",
DROP COLUMN "role",
ADD COLUMN     "currentRole" TEXT,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "experienceYears" DOUBLE PRECISION,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "targetRole" TEXT;
