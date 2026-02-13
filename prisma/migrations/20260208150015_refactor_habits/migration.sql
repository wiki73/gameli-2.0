/*
  Warnings:

  - You are about to drop the column `base_xp` on the `habit` table. All the data in the column will be lost.
  - You are about to drop the column `best_streak` on the `habit` table. All the data in the column will be lost.
  - You are about to drop the column `current_streak` on the `habit` table. All the data in the column will be lost.
  - You are about to drop the column `last_completed_day` on the `habit` table. All the data in the column will be lost.
  - You are about to drop the column `total_xp` on the `habit` table. All the data in the column will be lost.
  - You are about to drop the column `completed` on the `habitEntry` table. All the data in the column will be lost.
  - You are about to drop the column `completed_at` on the `habitEntry` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `habitEntry` table. All the data in the column will be lost.
  - You are about to drop the column `day_number` on the `habitEntry` table. All the data in the column will be lost.
  - You are about to drop the column `habit_id` on the `habitEntry` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `habitEntry` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `habitEntry` table. All the data in the column will be lost.
  - You are about to drop the column `xp_earned` on the `habitEntry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[habitId,dayNumber]` on the table `habitEntry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `baseXp` to the `habit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bestStreak` to the `habit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentStreak` to the `habit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastCompletedDay` to the `habit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalXp` to the `habit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dayNumber` to the `habitEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `habitId` to the `habitEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `habitEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `habitEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "habitEntry" DROP CONSTRAINT "habitEntry_habit_id_fkey";

-- DropIndex
DROP INDEX "habitEntry_habit_id_day_number_key";

-- AlterTable
ALTER TABLE "habit" DROP COLUMN "base_xp",
DROP COLUMN "best_streak",
DROP COLUMN "current_streak",
DROP COLUMN "last_completed_day",
DROP COLUMN "total_xp",
ADD COLUMN     "baseXp" INTEGER NOT NULL,
ADD COLUMN     "bestStreak" INTEGER NOT NULL,
ADD COLUMN     "currentStreak" INTEGER NOT NULL,
ADD COLUMN     "lastCompletedDay" INTEGER NOT NULL,
ADD COLUMN     "totalXp" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "habitEntry" DROP COLUMN "completed",
DROP COLUMN "completed_at",
DROP COLUMN "created_at",
DROP COLUMN "day_number",
DROP COLUMN "habit_id",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
DROP COLUMN "xp_earned",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dayNumber" INTEGER NOT NULL,
ADD COLUMN     "habitId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "xpEarned" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "habitEntry_habitId_dayNumber_key" ON "habitEntry"("habitId", "dayNumber");

-- AddForeignKey
ALTER TABLE "habitEntry" ADD CONSTRAINT "habitEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitEntry" ADD CONSTRAINT "habitEntry_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
