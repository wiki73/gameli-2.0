/*
  Warnings:

  - You are about to drop the column `isComplete` on the `task` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('CREATED', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "task" DROP COLUMN "isComplete",
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'CREATED';
