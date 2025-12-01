import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { orderId, cardCode, paymentMethod } = req.body;
  const merchantId = process.env.TMPAY_MERCHANT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const respUrl = `${baseUrl}/api/payment/tmpay-callback?order_id=${orderId}`;
  const channel = paymentMethod === 'razer' ? 'razer_gold_pin' : 'truemoney';

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: 'ไม่พบรายการสั่งซื้อ' });

    // ✅ แก้ไขลิงก์ให้ถูกต้องตรงนี้ (ต้องมี /TPG และใช้ http)
    const tmpayEndpoint = 'http://www.tmpay.net/TPG/backend.php';
    
    const params = new URLSearchParams({
      merchant_id: merchantId,
      password: cardCode,
      resp_url: respUrl
    });

    if (channel) params.append('channel', channel);

    const requestUrl = `${tmpayEndpoint}?${params.toString()}`;
    console.log("Target URL:", requestUrl); // เช็คใน Log ได้เลยว่ายิงไปถูกไหม

    const tmpayRes = await fetch(requestUrl);
    const resultText = await tmpayRes.text();
    
    console.log("TMPAY Response:", resultText);

    // 🔥 ดักจับ Error ต่างๆ ให้ละเอียด 🔥
    
    // 1. กรณีระบบ TMPAY ล่ม (Database Error)
    if (resultText.includes('DB_IS_NOT_READY')) {
        return res.status(503).json({ 
            error: 'ขออภัย ระบบเติมเงิน TMPAY ปิดปรับปรุงชั่วคราว (Database Error) - กรุณาลองใหม่ภายหลัง' 
        });
    }

    // 2. กรณี URL ผิด (404)
    if (resultText.includes('Not Found') || resultText.includes('<title>404</title>')) {
        throw new Error(`ไม่พบ URL ปลายทาง (404) - ลิงก์ ${tmpayEndpoint} อาจผิดพลาด`);
    }

    // 3. กรณีส่งสำเร็จ (รับเรื่องแล้ว)
    if (resultText.startsWith('SUCCEED')) {
       await prisma.order.update({ where: { id: orderId }, data: { status: 'VERIFYING' } });
       return res.status(200).json({ success: true });
    } else {
       // 4. กรณีอื่นๆ (เช่น รหัสบัตรผิด, รหัสร้านค้าผิด)
       return res.status(400).json({ error: `เติมเงินไม่สำเร็จ: ${resultText}` });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}