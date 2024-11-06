import { PrismaClient } from '@prisma/client';

import env from '@/providers/env-config';
import logger from '@/utils/logger';

let prisma: PrismaClient | null = null;

const prismaClientSingleton = () => {
  if (!prisma) {
    prisma = new PrismaClient({
      log: env.NODE_ENV !== 'production' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }
  return prisma;
};

export async function connect() {
  const prisma = prismaClientSingleton();

  logger.info('DATABASE :: Initializing prisma connecting');
  await prisma
    .$connect()
    .then(() => {
      logger.info('DATABASE :: Prisma connected to the database server ✅ ✅ ✅');
    })
    .catch(async (error: any) => {
      await prisma.$disconnect();
      logger.error('DATABASE :: Prisma failed to connect to the database', error);
      process.exit(1);
    });

  process.on('SIGINT', async function () {
    await prisma.$disconnect().then(() => {
      logger.error('DATABASE :: SIGINT :: Prisma disconnecting from the database server');
      process.exit(0);
    });
  });
}

export async function disconnect() {
  const prisma = prismaClientSingleton();

  return await prisma.$disconnect().then(() => {
    logger.error('DATABASE :: disconnect :: Prisma disconnecting from the database server');
  });
}

const database = prismaClientSingleton();

export default database;
