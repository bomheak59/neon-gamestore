import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  // TMPAY ส่งข้อมูลมาแบบ GET [cite: 85]
  const { status, real_amount, transaction_id, order_id } = req.query;

  // status: 1 = สำเร็จ, 3 = บัตรใช้แล้ว, 4 = รหัสผิด, 5 = ผิดประเภท [cite: 87]
  
  if (!order_id) return res.send('Error: No Order ID');

  try {
    const order = await prisma.order.findUnique({
        where: { id: order_id },
        include: { orderItems: { include: { product: true } } }
    });

    if (!order) return res.send('Error: Order Not Found');

    if (status == '1') {
        // ✅ เติมเงินสำเร็จ! [cite: 87]
        // real_amount คือยอดเงินจริงที่ได้ (เช่น 50.00, 90.00) [cite: 87]
        
        await prisma.$transaction(async (tx) => {
            // 1. ตัด Stock (สำหรับสินค้า ID_ACCOUNT)
            for (const item of order.orderItems) {
                if (item.product.type === 'ID_ACCOUNT') {
                    const stock = await tx.stockItem.findFirst({
                        where: { productId: item.productId, isSold: false }
                    });
                    if (stock) {
                        await tx.stockItem.update({ where: { id: stock.id }, data: { isSold: true } });
                        await tx.orderItem.update({ where: { id: item.id }, data: { deliveredContent: stock.content } });
                    }
                }
            }
            
            // 2. อัปเดตสถานะเป็น PAID
            await tx.order.update({
                where: { id: order_id },
                data: { 
                    status: 'PAID', 
                    // สามารถเก็บ transaction_id ของ TMPAY ไว้ดูย้อนหลังได้ถ้าต้องการ
                } 
            });
        });

        // ต้องตอบกลับด้วยคำว่า SUCCEED ตามด้วยข้อความอะไรก็ได้ เพื่อให้ TMPAY รู้ว่าเรารับเรื่องแล้ว [cite: 88, 108]
        return res.send(`SUCCEED|ORDER_${order_id}|AMOUNT_${real_amount}`);

    } else {
        // ❌ ไม่ผ่าน
        await prisma.order.update({
            where: { id: order_id },
            data: { status: 'FAILED' }
        });
        
        // ตอบกลับว่ารับเรื่องแล้ว (แม้จะเฟล) [cite: 88]
        return res.send(`SUCCEED|FAILED_STATUS_${status}`);
    }

  } catch (error) {
    console.error(error);
    return res.status(500).send('ERROR_SERVER');
  }
}