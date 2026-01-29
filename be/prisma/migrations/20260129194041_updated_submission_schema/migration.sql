/*
  Warnings:

  - You are about to drop the column `problemsId` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `problemId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_problemsId_fkey";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "problemsId",
ADD COLUMN     "problemId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
