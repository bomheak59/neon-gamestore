import prisma from '@/lib/prisma';
// ไม่ต้อง import cloudinary ตรงนี้ เราจะใช้ fetch เรียก api ภายในเอา (หรือจะ import ก็ได้ แต่แยกส่วนดีกว่า)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { id } = req.body;

  try {
    // 1. ดึงข้อมูลสินค้าก่อนลบ (เพื่อเอารายชื่อรูป)
    const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    
    if (product) {
        // เตรียมรายการรูปที่จะลบ
        let imagesToDelete = [];
        if (product.images) {
            try {
                const parsed = JSON.parse(product.images);
                if (Array.isArray(parsed)) imagesToDelete = parsed;
            } catch (e) {}
        } else if (product.imageUrl) {
            imagesToDelete = [product.imageUrl];
        }

        // 2. ส่งไปลบรูปที่ Cloudinary (ถ้ามีรูป)
        if (imagesToDelete.length > 0) {
            // เนื่องจากเราอยู่ในฝั่ง Server แล้ว เราสามารถเรียกใช้ function ลบได้เลย หรือยิง request ก็ได้
            // เพื่อความง่ายในตัวอย่างนี้ ผมขอแนะนำให้คุณเอา code ส่วนลบรูปมาใส่ตรงนี้เลยครับ
            
            // (ต้อง import cloudinary ด้านบนสุดของไฟล์นี้ด้วย)
            const { v2: cloudinary } = require('cloudinary');
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });

            for (const url of imagesToDelete) {
                const parts = url.split('/');
                const fileName = parts[parts.length - 1];
                const publicId = fileName.split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
        }
    }

    // 3. ลบ Stock และ สินค้าใน DB
    await prisma.stockItem.deleteMany({ where: { productId: parseInt(id) } });
    await prisma.product.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ลบไม่สำเร็จ" });
  }
}