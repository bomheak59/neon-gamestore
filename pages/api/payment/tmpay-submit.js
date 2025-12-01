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

    // ✅ ใช้ลิงก์นี้ (HTTP) เพราะคุณทดสอบใน Browser แล้วว่ามันมีตัวตน
    const tmpayEndpoint = 'http://www.tmpay.net/TPG/backend.php';
    
    const params = new URLSearchParams({
      merchant_id: merchantId,
      password: cardCode,
      resp_url: respUrl
    });

    if (channel) params.append('channel', channel);

    const requestUrl = `${tmpayEndpoint}?${params.toString()}`;
    console.log("Sending to TMPAY:", requestUrl);

    const tmpayRes = await fetch(requestUrl);
    const resultText = await tmpayRes.text();
    
    console.log("TMPAY Response:", resultText);

    // 🔥 ดักจับ Error จาก TMPAY 🔥
    if (resultText.includes('DB_IS_NOT_READY')) {
        return res.status(503).json({ error: 'ระบบเติมเงิน TMPAY ปิดปรับปรุงชั่วคราว (DB Error) - กรุณาลองใหม่ภายหลัง' });
    }

    if (resultText.includes('404 Not Found')) {
        // ถ้ายังเจอ 404 ให้ลองติดต่อ Support TMPAY เพื่อขอ URL ใหม่
        throw new Error('ไม่พบ URL ปลายทางของ TMPAY (404)');
    }

    if (resultText.startsWith('SUCCEED')) {
       await prisma.order.update({ where: { id: orderId }, data: { status: 'VERIFYING' } });
       return res.status(200).json({ success: true });
    } else {
       // ส่ง Error อื่นๆ กลับไปบอกลูกค้า (เช่น บัตรผิด)
       return res.status(400).json({ error: `เกิดข้อผิดพลาด: ${resultText}` });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}