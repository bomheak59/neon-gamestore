import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { orderId, cardCode, paymentMethod } = req.body;
  
  // ดึงค่าจาก .env (เช็คดีๆ ว่าไม่มีช่องว่าง)
  const merchantId = process.env.TMPAY_MERCHANT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  // URL Callback
  const respUrl = `${baseUrl}/api/payment/tmpay-callback?order_id=${orderId}`;

  // เลือก Channel
  const channel = paymentMethod === 'razer' ? 'razer_gold_pin' : 'truemoney';

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: 'ไม่พบรายการสั่งซื้อ' });

    // 🔴 แก้ไขตรงนี้: ใช้ http แทน https และลองใช้ Path มาตรฐาน
    const tmpayEndpoint = 'http://www.tmpay.net/TPG/backend.php';
    
    const params = new URLSearchParams({
      merchant_id: merchantId,
      password: cardCode,
      resp_url: respUrl
    });

    if (channel) params.append('channel', channel);

    const requestUrl = `${tmpayEndpoint}?${params.toString()}`;
    console.log("Sending to TMPAY:", requestUrl); // ดู Log ใน Vercel ได้

    // ส่งข้อมูล (GET Method)
    const tmpayRes = await fetch(requestUrl);
    const resultText = await tmpayRes.text(); 
    
    console.log("TMPAY Response:", resultText);

    // ดักจับ Error 404 จาก HTML
    if (resultText.includes('<title>404 Not Found</title>')) {
        // ถ้ายังเจอ 404 ให้ลองเปลี่ยน URL เป็นแบบไม่มี /TPG ดูครับ
        // const retryUrl = requestUrl.replace('/TPG', '');
        // ... (ลองยิงอีกรอบ) ...
        // แต่เบื้องต้นแจ้ง Error กลับไปก่อน
        throw new Error('ไม่พบ URL ของ TMPAY (404 Not Found) - กรุณาติดต่อผู้ดูแลระบบ');
    }

    if (resultText.startsWith('SUCCEED')) {
       await prisma.order.update({
         where: { id: orderId },
         data: { status: 'VERIFYING' } 
       });
       return res.status(200).json({ success: true, message: 'ส่งข้อมูลสำเร็จ' });
    } else {
       return res.status(400).json({ error: `TMPAY Error: ${resultText}` });
    }

  } catch (error) {
    console.error("Payment API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}