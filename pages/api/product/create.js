import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { name, price, category, description, imageUrl, type, stockContent, discount, images, options } = req.body;

  try {
    let imagesToSave = [];
    if (images && Array.isArray(images) && images.length > 0) {
        imagesToSave = images;
    } else if (imageUrl) {
        imagesToSave = [imageUrl];
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        discount: parseInt(discount) || 0,
        category,
        description,
        imageUrl, 
        images: JSON.stringify(imagesToSave),
        type,
        // 👇 บันทึก options ลงไป (ถ้าไม่มีให้ใส่ [])
        options: options ? JSON.stringify(options) : "[]" 
      }
    });

    if (stockContent && (type === 'ID_ACCOUNT')) {
        await prisma.stockItem.create({
            data: { productId: product.id, content: stockContent, isSold: false }
        });
    }

    res.status(200).json({ success: true, productId: product.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}