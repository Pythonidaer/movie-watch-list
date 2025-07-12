const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create a user with your chosen password
  // You can change this password to whatever you want to share with your friends
  await prisma.user.create({
    data: {
      password: 'movienight',
    },
  });
  
  console.log('Database has been seeded with initial user');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
