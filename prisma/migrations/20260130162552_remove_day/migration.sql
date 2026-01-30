/*
  Warnings:

  - You are about to drop the column `dayId` on the `task` table. All the data in the column will be lost.
  - You are about to drop the `day` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "day" DROP CONSTRAINT "day_userId_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_dayId_fkey";

-- AlterTable
ALTER TABLE "task" DROP COLUMN "dayId",
ADD COLUMN     "date" TIMESTAMP(3);

-- DropTable
DROP TABLE "day";
