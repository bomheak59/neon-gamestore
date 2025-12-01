import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // รับ selectedOption เพิ่มเข้ามา
  const { productId, contact, userInput, selectedOption } = req.body;

  try {
    // 1. ดึงข้อมูลสินค้าจาก Database
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error('Product not found');

    // 2. คำนวณราคา (Price Logic)
    let finalPrice = Number(product.price); // ราคาเริ่มต้น (ราคาปกติ)
    let packageName = 'Default'; // ชื่อแพ็คเกจ (สำหรับบันทึก)

    // ถ้ามีการส่ง Option มา (เช่น เลือกเติม 120 เพชร)
    if (selectedOption && product.options) {
        try {
            const dbOptions = JSON.parse(product.options);
            
            // 🔐 Security Check: ตรวจสอบว่า Option ที่ส่งมา มีอยู่จริงใน DB ไหม?
            // (กันคนแก้ตัวเลขราคาหน้าเว็บส่งมาเอง)
            const validOption = dbOptions.find(opt => 
                opt.label === selectedOption.label && 
                Number(opt.price) === Number(selectedOption.price)
            );

            if (validOption) {
                finalPrice = Number(validOption.price);
                packageName = validOption.label;
            } else {
                // ถ้าหาไม่เจอ (อาจจะโดนแฮก หรือข้อมูลไม่อัปเดต) ให้ใช้ราคาปกติ หรือ Throw Error
                // ในที่นี้ขออนุญาตใช้ราคาปกติ เพื่อกัน Error แต่คุณอาจจะเลือก throw new Error('Invalid Package') ก็ได้
            }
        } catch (e) {
            console.error("Option Parse Error", e);
        }
    }

    // 3. เช็คสต็อก (สำหรับสินค้าประเภทไอดี)
    if (product.type === 'ID_ACCOUNT') {
      const stockCount = await prisma.stockItem.count({
        where: { productId: product.id, isSold: false }
      });
      if (stockCount === 0) return res.status(400).json({ error: 'สินค้าหมด (Out of Stock)' });
    }

    // 4. สร้าง Order ลง Database
    const order = await prisma.order.create({
      data: {
        contactChannel: contact.type || 'mixed',
        contactValue: contact.value,
        status: 'PENDING',
        totalAmount: finalPrice, // ใช้ราคาที่ผ่านการตรวจสอบแล้ว
        orderItems: {
          create: {
            productId: product.id,
            // บันทึก UID และ ชื่อแพ็คเกจ ลงไปใน userInput (เพื่อให้แอดมินรู้ว่าลูกค้าซื้อแพ็คไหน)
            userInput: JSON.stringify({ 
                uid: userInput.uid, 
                package: packageName,
                ...userInput // เก็บข้อมูลอื่นๆ เผื่อไว้
            }) 
          }
        }
      }
    });

    res.status(200).json({ orderId: order.id });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}