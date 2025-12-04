import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  // รับเฉพาะ Method PUT
  if (req.method !== 'PUT') return res.status(405).end();
  
  // รับค่าทั้งหมดจากหน้าบ้าน
  const { 
    id, 
    name, 
    price, 
    category, 
    description, 
    imageUrl, 
    type, 
    discount, 
    stockContent, 
    images, 
    options, 
    isRecommended 
  } = req.body;

  if (!id) return res.status(400).json({ error: "Missing Product ID" });

  try {
    // 1. เตรียมข้อมูลรูปภาพ (Images Logic)
    // ถ้ามีส่ง images (หลายรูป) มา ให้ใช้ตัวนั้น
    // ถ้าไม่มีส่งมา ให้เอารูปปก (imageUrl) ใส่เข้าไปเป็นรูปเดียว
    let imagesToSave = undefined; // ใช้ undefined เพื่อไม่ให้ไปทับของเดิมถ้าไม่ได้ส่งมา
    if (images) {
        imagesToSave = Array.isArray(images) && images.length > 0 
            ? JSON.stringify(images) 
            : JSON.stringify([imageUrl]);
    }

    // 2. อัปเดตข้อมูลสินค้าลง Database
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: name || undefined,
        price: price ? parseFloat(price) : undefined,
        discount: discount !== undefined ? parseInt(discount) : undefined,
        category: category || undefined,
        description: description || undefined,
        
        // รูปภาพ
        imageUrl: imageUrl || undefined, // รูปปก
        images: imagesToSave,            // อัลบั้มรูป (JSON String)
        
        type: type || undefined,
        
        // แพ็คเกจราคา (สำหรับเติมเกม)
        options: options ? JSON.stringify(options) : undefined,
        
        // สถานะสินค้าแนะนำ
        isRecommended: isRecommended !== undefined ? isRecommended : undefined
      }
    });

    // 3. เพิ่ม Stock (เฉพาะสินค้าประเภทไอดี และมีการกรอกข้อมูลมา)
    if (stockContent && (type === 'ID_ACCOUNT' || product.type === 'ID_ACCOUNT')) {
        await prisma.stockItem.create({
            data: {
                productId: product.id,
                content: stockContent,
                isSold: false
            }
        });
    }

    // ส่งผลลัพธ์กลับไปบอกหน้าบ้านว่าสำเร็จ
    res.status(200).json({ success: true });

  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ error: error.message });
  }
}