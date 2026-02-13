/*
  Warnings:

  - The `created_at` column on the `habitEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[habit_id,day_number]` on the table `habitEntry` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `updated_at` on the `habitEntry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "habitEntry" ALTER COLUMN "completed" SET DEFAULT false,
ALTER COLUMN "completed_at" DROP NOT NULL,
DROP COLUMN "created_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "xp_earned" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "habitEntry_habit_id_day_number_key" ON "habitEntry"("habit_id", "day_number");

-- AddForeignKey
ALTER TABLE "habitEntry" ADD CONSTRAINT "habitEntry_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
