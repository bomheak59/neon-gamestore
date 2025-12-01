import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { orderId, status } = req.body;

  try {
    // อัปเดตสถานะ
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: status },
      include: { orderItems: { include: { product: true } } } // ดึงข้อมูลสินค้ามาด้วย
    });

    // 🔥 พิเศษ: ถ้ากด "PAID" และเป็นสินค้าไอดี (ID_ACCOUNT) ให้ตัดของให้อัตโนมัติด้วย
    if (status === 'PAID') {
        const item = order.orderItems[0]; // สมมติว่า 1 ออเดอร์มี 1 สินค้า
        if (item && item.product.type === 'ID_ACCOUNT' && !item.deliveredContent) {
            // หาของในสต็อก
            const stock = await prisma.stockItem.findFirst({
                where: { productId: item.productId, isSold: false }
            });
            
            if (stock) {
                // ตัดสต็อกและส่งของ
                await prisma.$transaction([
                    prisma.stockItem.update({ where: { id: stock.id }, data: { isSold: true } }),
                    prisma.orderItem.update({ where: { id: item.id }, data: { deliveredContent: stock.content } })
                ]);
            }
        }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}