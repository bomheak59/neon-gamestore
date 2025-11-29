import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).end();
  const { id, name, price, category, description, imageUrl, type, discount, stockContent } = req.body;

  try {
    // 1. อัปเดตข้อมูลสินค้า
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: parseFloat(price),
        discount: parseInt(discount) || 0,
        category,
        description,
        imageUrl,
        type,
      }
    });

    // 2. ถ้ามีการกรอก Stock ใหม่มาด้วย ให้เพิ่มเข้าไป (Optional)
    if (stockContent && (type === 'ID_ACCOUNT')) {
        await prisma.stockItem.create({
            data: {
                productId: product.id,
                content: stockContent,
                isSold: false
            }
        });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}