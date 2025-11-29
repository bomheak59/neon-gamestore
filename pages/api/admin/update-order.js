import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { orderId, status } = req.body;

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status }
    });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update' });
  }
}