/*
  Warnings:

  - The values [AC,WA,TLE,RE,CE] on the enum `SubmissionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `explaination` on the `Example` table. All the data in the column will be lost.
  - You are about to drop the column `problemsId` on the `Example` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `memory_limit` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `time_limit` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `StarterCode` table. All the data in the column will be lost.
  - You are about to drop the column `problemsId` on the `StarterCode` table. All the data in the column will be lost.
  - You are about to drop the column `error_message` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `language_used` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `memory_used` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `runtime` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `submission_token` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `submitted_at` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `submitted_code` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `expected_output` on the `TestCase` table. All the data in the column will be lost.
  - You are about to drop the column `problemsId` on the `TestCase` table. All the data in the column will be lost.
  - Added the required column `explanation` to the `Example` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problemId` to the `Example` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memoryLimit` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeLimit` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languageId` to the `StarterCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problemId` to the `StarterCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languageUsed` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submittedCode` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedOutput` to the `TestCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problemId` to the `TestCase` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('PENDING', 'AC', 'WA', 'TLE', 'RE', 'CE');

-- AlterEnum
BEGIN;
CREATE TYPE "SubmissionStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
ALTER TABLE "public"."Submission" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Submission" ALTER COLUMN "status" TYPE "SubmissionStatus_new" USING ("status"::text::"SubmissionStatus_new");
ALTER TYPE "SubmissionStatus" RENAME TO "SubmissionStatus_old";
ALTER TYPE "SubmissionStatus_new" RENAME TO "SubmissionStatus";
DROP TYPE "public"."SubmissionStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Example" DROP CONSTRAINT "Example_problemsId_fkey";

-- DropForeignKey
ALTER TABLE "StarterCode" DROP CONSTRAINT "StarterCode_problemsId_fkey";

-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_problemsId_fkey";

-- AlterTable
ALTER TABLE "Example" DROP COLUMN "explaination",
DROP COLUMN "problemsId",
ADD COLUMN     "explanation" TEXT NOT NULL,
ADD COLUMN     "problemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "created_at",
DROP COLUMN "memory_limit",
DROP COLUMN "time_limit",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "memoryLimit" INTEGER NOT NULL,
ADD COLUMN     "timeLimit" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "StarterCode" DROP COLUMN "language",
DROP COLUMN "problemsId",
ADD COLUMN     "languageId" INTEGER NOT NULL,
ADD COLUMN     "problemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "error_message",
DROP COLUMN "language_used",
DROP COLUMN "memory_used",
DROP COLUMN "runtime",
DROP COLUMN "status",
DROP COLUMN "submission_token",
DROP COLUMN "submitted_at",
DROP COLUMN "submitted_code",
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "languageUsed" INTEGER NOT NULL,
ADD COLUMN     "submissionStatus" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "submittedCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "expected_output",
DROP COLUMN "problemsId",
ADD COLUMN     "expectedOutput" TEXT NOT NULL,
ADD COLUMN     "problemId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Languages";

-- CreateTable
CREATE TABLE "TestCaseRun" (
    "id" TEXT NOT NULL,
    "submissionToken" TEXT NOT NULL,
    "actualOutput" TEXT,
    "status" "RunStatus" NOT NULL DEFAULT 'PENDING',
    "time" DOUBLE PRECISION,
    "memory" DOUBLE PRECISION,
    "testCaseId" TEXT NOT NULL,
    "submissionId" INTEGER NOT NULL,

    CONSTRAINT "TestCaseRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TestCaseRun_submissionToken_key" ON "TestCaseRun"("submissionToken");

-- AddForeignKey
ALTER TABLE "Example" ADD CONSTRAINT "Example_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarterCode" ADD CONSTRAINT "StarterCode_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCaseRun" ADD CONSTRAINT "TestCaseRun_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCaseRun" ADD CONSTRAINT "TestCaseRun_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
