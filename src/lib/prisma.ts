import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({ log: ['query'] })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export { prisma } // <--- برگشت به روش Named Export

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma