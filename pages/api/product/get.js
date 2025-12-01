import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}