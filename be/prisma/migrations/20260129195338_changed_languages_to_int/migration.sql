/*
  Warnings:

  - Changed the type of `language_used` on the `Submission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "language_used",
ADD COLUMN     "language_used" INTEGER NOT NULL;
