-- CreateTable
CREATE TABLE "habitEntry" (
    "id" TEXT NOT NULL,
    "habit_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "day_number" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "completed_at" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,
    "xp_earned" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "habitEntry_pkey" PRIMARY KEY ("id")
);
