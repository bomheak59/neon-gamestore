// pages/api/product/get.js
import prisma from '@/lib/prisma';
export default async function handler(req, res) {
  const { id } = req.query;
  const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
  res.json(product);
}