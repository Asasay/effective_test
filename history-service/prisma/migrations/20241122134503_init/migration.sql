-- CreateEnum
CREATE TYPE "Action" AS ENUM ('balance_create', 'balance_increase', 'balance_decrease');

-- CreateTable
CREATE TABLE "Action_history" (
    "id" SERIAL NOT NULL,
    "action" "Action" NOT NULL,
    "productId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Action_history_pkey" PRIMARY KEY ("id")
);
