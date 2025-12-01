import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { id } = req.body;

  try {
    // 1. ลบรายการสินค้าในออเดอร์ก่อน (OrderItems) เพื่อไม่ให้ติด Error
    await prisma.orderItem.deleteMany({
      where: { orderId: id }
    });

    // 2. ลบตัวออเดอร์ (Order)
    await prisma.order.delete({
      where: { id: id }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete Order Error:", error);
    res.status(500).json({ error: error.message });
  }
}