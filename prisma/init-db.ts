import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 기본 사용자 데이터 추가
  await prisma.user.createMany({
    data: [
      { id: 1, name: 'User1' },
      // 필요한 경우 다른 사용자도 추가 가능
    ],
    skipDuplicates: true, // 이미 존재하는 경우 무시
  });

  console.log('Initial data has been seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
