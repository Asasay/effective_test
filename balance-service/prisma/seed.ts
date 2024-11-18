import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seedProducts(howMany: number) {
  const products = Array.from({ length: howMany }).map(() => ({
    plu: faker.string.numeric({ length: 5 }),
    name: faker.commerce.productName(),
  }));

  await prisma.product.createMany({
    data: products,
  });

  console.log(`${howMany} products seeded.`);
}

async function seedBalances(howMany: number) {
  const prodMinId = (await prisma.product.aggregate({ _min: { id: true } }))._min.id;
  const prodMaxId = (await prisma.product.aggregate({ _max: { id: true } }))._max.id;

  const uniqueBalances = new Set<string>();
  const balances: {
    productId: number;
    storeId: number;
    quantityShelf: number;
    quantityOrder: number;
  }[] = [];

  while (balances.length < howMany) {
    const productId = faker.number.int({ min: prodMinId, max: prodMaxId });
    const storeId = faker.helpers.arrayElement([5, 7, 19, 25, 30]);
    const uniqueKey = `${productId}-${storeId}`;

    if (!uniqueBalances.has(uniqueKey)) {
      uniqueBalances.add(uniqueKey);
      balances.push({
        productId,
        storeId,
        quantityShelf: faker.number.int({ max: 1000 }),
        quantityOrder: faker.number.int({ max: 30 }),
      });
    }
  }

  await prisma.balance.createMany({
    data: balances,
  });

  console.log(`${howMany} balances seeded.`);
}

async function main() {
  console.log("Removing previous records...");
  await prisma.balance.deleteMany();
  await prisma.product.deleteMany();
  console.log("Seeding database...");
  await seedProducts(50);
  await seedBalances(200);
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
