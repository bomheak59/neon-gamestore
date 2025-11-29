import prisma from '@/lib/prisma';
export default async function handler(req, res) {
  const { orderId } = req.query;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true, orderItems: { select: { deliveredContent: true } } }
  });
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json({ status: order.status, code: order.orderItems[0]?.deliveredContent });
}