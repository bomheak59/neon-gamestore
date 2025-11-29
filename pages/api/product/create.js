import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  // รับค่า discount เพิ่มเข้ามา
  const { name, price, category, description, imageUrl, type, stockContent, discount } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        category,
        description,
        imageUrl,
        type: type,
        discount: parseInt(discount) || 0, // บันทึกส่วนลด (ถ้าไม่มีใส่ 0)
      }
    });

    if (type === 'ID_ACCOUNT' || type === 'LICENSE_KEY') {
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