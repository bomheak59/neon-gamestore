import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  // รับเฉพาะ PUT method
  if (req.method !== 'PUT') return res.status(405).end();
  
  // รับข้อมูลทั้งหมดรวมถึง options
  const { id, name, price, category, description, imageUrl, type, discount, stockContent, images, options } = req.body;

  try {
    // 1. เตรียมข้อมูลรูปภาพ (Images Logic)
    // ถ้ามีส่ง images (หลายรูป) มา ให้ใช้ตัวนั้น
    // ถ้าไม่มีส่งมา ให้เอารูปปก (imageUrl) ใส่เข้าไปเป็นรูปเดียว
    let imagesToSave = [];
    if (images && Array.isArray(images) && images.length > 0) {
        imagesToSave = images;
    } else if (imageUrl) {
        imagesToSave = [imageUrl];
    }

    // 2. อัปเดตสินค้าลง Database
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: parseFloat(price),
        discount: parseInt(discount) || 0,
        category,
        description,
        imageUrl: imagesToSave[0], // รูปแรก = รูปปกเสมอ
        images: JSON.stringify(imagesToSave), // แปลง Array รูปภาพเป็น Text
        type,
        // 👇 อัปเดต options (แพ็คเกจราคา) ลงไป
        options: options ? JSON.stringify(options) : "[]" 
      }
    });

    // 3. เพิ่ม Stock (ถ้ามีการกรอกมาใหม่)
    if (stockContent && (type === 'ID_ACCOUNT')) {
        await prisma.stockItem.create({
            data: {
                productId: product.id,
                content: stockContent,
                isSold: false
            }
        });
    }

    // ส่งผลลัพธ์กลับ
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ error: error.message });
  }
}