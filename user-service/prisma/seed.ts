import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
const BATCH_SIZE = 100_000;

async function seedBatch(batchNumber: number, batchSize: number) {
  const users = Array.from({ length: batchSize }).map(() => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int({ min: 18, max: 80 }),
    sex: faker.person.sex(),
    hasIssues: faker.datatype.boolean({ probability: 0.01 }),
  }));

  await prisma.user.createMany({
    data: users,
  });

  console.log(`Batch #${batchNumber} of ${batchSize} users seeded.`);
}
async function main() {
  console.log('Removing previous records...');
  await prisma.user.deleteMany();

  console.log('Seeding database...');

  const totalUsers = 1_000_000; // Total number of users to seed
  const totalBatches = Math.ceil(totalUsers / BATCH_SIZE);

  for (let i = 0; i < totalBatches; i++) {
    await seedBatch(i + 1, BATCH_SIZE);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
