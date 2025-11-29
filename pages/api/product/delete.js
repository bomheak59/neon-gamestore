import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { id } = req.body;

  try {
    // 1. ลบ Stock ที่ค้างอยู่ก่อน (เพื่อไม่ให้ Database Error เรื่องความสัมพันธ์ข้อมูล)
    await prisma.stockItem.deleteMany({
      where: { productId: id }
    });

    // 2. ลบสินค้า
    await prisma.product.delete({
      where: { id: id }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ลบไม่สำเร็จ (อาจมีออเดอร์ค้างอยู่)" });
  }
}