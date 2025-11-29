const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  await prisma.product.create({
    data: {
      name: 'Netflix 4K 30 Days',
      price: 99,
      imageUrl: 'https://placehold.co/400x300/e50914/white?text=Netflix',
      category: 'App',
      type: 'ID_ACCOUNT'
    }
  })
  await prisma.product.create({
    data: {
      name: 'ROV 115 Coupons',
      price: 35,
      imageUrl: 'https://placehold.co/400x300/1e293b/white?text=ROV',
      category: 'Game',
      type: 'TOPUP'
    }
  })
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect())