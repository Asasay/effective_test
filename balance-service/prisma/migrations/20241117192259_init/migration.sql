-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "plu" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Balance" (
    "productId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "quantityShelf" INTEGER NOT NULL,
    "quantityOrder" INTEGER NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("productId","storeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_plu_key" ON "Product"("plu");

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
