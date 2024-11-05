import { PrismaClient } from '@prisma/client';

import env from '@/providers/env-config';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: env.NODE_ENV !== 'production' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
};

const database = prismaClientSingleton();

export default database;
