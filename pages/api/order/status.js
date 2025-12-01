import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const { orderId } = req.query;

  if (!orderId) return res.status(400).json({ error: 'Order ID is required' });

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
            include: { product: true } // ดึงข้อมูลสินค้ามาด้วย
        } 
      }
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}