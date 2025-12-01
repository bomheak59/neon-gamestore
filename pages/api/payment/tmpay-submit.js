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
    console.log("Target URL:", requestUrl);

    // 🔴 เพิ่ม Headers เพื่อปลอมตัวเป็น Browser (แก้ตรงนี้)
    const tmpayRes = await fetch(requestUrl, {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7'
        }
    });
    
    const resultText = await tmpayRes.text();
    console.log("TMPAY Response:", resultText);

    // 1. กรณีระบบ TMPAY ล่ม/ปิดปรับปรุง (ถ้าเจอคำนี้ แสดงว่าเชื่อมต่อสำเร็จแล้ว!)
    if (resultText.includes('DB_IS_NOT_READY')) {
        // แจ้งลูกค้าตรงๆ ว่าระบบปิดปรับปรุง
        return res.status(503).json({ 
            error: 'ระบบเติมเงิน TMPAY แจ้งว่า: "Database ไม่พร้อมใช้งาน (DB_IS_NOT_READY)" - กรุณาลองใหม่ภายหลัง หรือติดต่อแอดมิน' 
        });
    }

    // 2. กรณีโดนบล็อก หรือ URL ผิด
    if (resultText.includes('Not Found') || resultText.includes('<title>404</title>')) {
        throw new Error('เชื่อมต่อ TMPAY ไม่ได้ (โดนบล็อก IP ต่างประเทศ หรือ URL ผิด) - กรุณาลองรันบนเครื่องตัวเอง (Localhost) เพื่อทดสอบ');
    }

    // 3. สำเร็จ
    if (resultText.startsWith('SUCCEED')) {
       await prisma.order.update({ where: { id: orderId }, data: { status: 'VERIFYING' } });
       return res.status(200).json({ success: true });
    } else {
       return res.status(400).json({ error: `เติมเงินไม่สำเร็จ: ${resultText}` });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}