import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

// ตั้งค่า Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { id } = req.body;

  if (!id) return res.status(400).json({ error: "Missing Product ID" });

  try {
    // 1. ดึงข้อมูลสินค้าก่อน (เพื่อเอารายชื่อรูป)
    const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    
    if (product) {
        // --- ส่วนลบรูปภาพ (ใส่ try-catch แยก เพื่อไม่ให้ขัดขวางการลบสินค้า) ---
        try {
            let imagesToDelete = [];
            if (product.images) {
                try {
                    const parsed = JSON.parse(product.images);
                    if (Array.isArray(parsed)) imagesToDelete = parsed;
                } catch (e) {}
            }
            // รวมรูปปกด้วย (ถ้าไม่อยู่ใน images)
            if (product.imageUrl && !imagesToDelete.includes(product.imageUrl)) {
                imagesToDelete.push(product.imageUrl);
            }

            if (imagesToDelete.length > 0) {
                const deletePromises = imagesToDelete.map(url => {
                    // แกะ Public ID จาก URL
                    const parts = url.split('/');
                    const fileName = parts[parts.length - 1];
                    const publicId = fileName.split('.')[0];
                    return cloudinary.uploader.destroy(publicId);
                });
                await Promise.all(deletePromises);
                console.log("Images deleted from Cloudinary");
            }
        } catch (imgError) {
            console.error("Cloudinary Delete Warning:", imgError.message);
            // (ไม่ throw error ปล่อยผ่านไป เพื่อให้ลบสินค้าต่อได้)
        }
    }

    // 2. 🔥 ลบข้อมูลที่เกี่ยวข้องทั้งหมด (Cascade Delete) 🔥
    // ต้องลบ OrderItem ที่ผูกกับสินค้านี้ก่อน ไม่งั้น Database จะล็อคไม่ให้ลบสินค้า
    await prisma.orderItem.deleteMany({
        where: { productId: parseInt(id) }
    });

    // ลบ Stock ที่ค้างอยู่
    await prisma.stockItem.deleteMany({
        where: { productId: parseInt(id) }
    });

    // 3. ลบตัวสินค้าจริงๆ
    await prisma.product.delete({
        where: { id: parseInt(id) }
    });

    res.status(200).json({ success: true });

  } catch (error) {
    console.error("Delete Product Error:", error);
    // ส่ง Error กลับไปบอกหน้าบ้านว่าพังเพราะอะไร
    res.status(500).json({ error: "ลบไม่สำเร็จ: " + error.message });
  }
}