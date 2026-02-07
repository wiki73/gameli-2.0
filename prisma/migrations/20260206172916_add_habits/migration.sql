-- CreateTable
CREATE TABLE "habit" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "total_xp" DOUBLE PRECISION NOT NULL,
    "current_streak" INTEGER NOT NULL,
    "best_streak" INTEGER NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,
    "base_xp" INTEGER NOT NULL,
    "last_completed_day" INTEGER NOT NULL,

    CONSTRAINT "habit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "habit" ADD CONSTRAINT "habit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
