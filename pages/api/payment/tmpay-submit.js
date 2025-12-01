import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end(); // API เรายังเป็น POST (รับจากหน้าบ้าน)

  const { orderId, cardCode, paymentMethod } = req.body;
  
  // ค่าจาก .env
  const merchantId = process.env.TMPAY_MERCHANT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  // URL Callback (ต้องเป็นลิงก์จริง)
  const respUrl = `${baseUrl}/api/payment/tmpay-callback?order_id=${orderId}`;

  // เลือก Channel
  // หมายเหตุ: เอกสารบอกว่าถ้าเป็น TrueMoney ไม่ต้องส่ง channel ก็ได้ แต่ใส่ไว้เพื่อความชัวร์ถ้า TMPAY รองรับ
  // ถ้า TMPAY แจ้ง error อีก ให้ลองลบ &channel=${channel} ออกสำหรับ TrueMoney
  const channel = paymentMethod === 'razer' ? 'razer_gold_pin' : 'truemoney';

  try {
    // 1. ตรวจสอบ Order
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: 'ไม่พบรายการสั่งซื้อ' });

    // 2. เตรียม URL ส่งไป TMPAY (สำคัญมาก: ต้องเป็น HTTPS และ URL ต้องถูกเป๊ะ)
    const tmpayEndpoint = 'https://www.tmpay.net/TPG/backend.php';
    
    // 3. สร้าง Query String
    const params = new URLSearchParams({
      merchant_id: merchantId,
      password: cardCode,
      resp_url: respUrl
    });

    // เพิ่ม channel เฉพาะถ้าเป็น Razer (หรือถ้า TrueMoney ต้องใส่ก็ใส่ได้)
    // จากเอกสารหน้า 4: มี parameter "channel" ด้วย
    if (channel) {
        params.append('channel', channel);
    }

    const requestUrl = `${tmpayEndpoint}?${params.toString()}`;
    console.log("Sending to TMPAY:", requestUrl); 

    // 4. ยิง Request (GET Method)
    // ไม่ต้องใส่ body, ไม่ต้องใส่ method: 'POST' -> fetch จะเป็น GET อัตโนมัติ
    const tmpayRes = await fetch(requestUrl);
    
    // อ่านผลลัพธ์
    const resultText = await tmpayRes.text(); 
    console.log("TMPAY Response:", resultText);

    // 5. ตรวจสอบผล
    // TMPAY ตอบกลับ: SUCCEED TRANSACTION_ID หรือ ERROR ...
    if (resultText.startsWith('SUCCEED')) {
       await prisma.order.update({
         where: { id: orderId },
         data: { status: 'VERIFYING' } 
       });
       return res.status(200).json({ success: true, message: 'ส่งข้อมูลสำเร็จ' });
    } else {
       // ส่ง Error กลับไปให้หน้าบ้านโชว์ (เช่น ERROR INVALID_MERCHANT_ID)
       return res.status(400).json({ error: `TMPAY Error: ${resultText}` });
    }

  } catch (error) {
    console.error("Payment Error:", error);
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเชื่อมต่อ TMPAY' });
  }
}