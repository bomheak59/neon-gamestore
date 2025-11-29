import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  // รับข้อมูลผ่าน POST เท่านั้น
  if (req.method !== 'POST') return res.status(405).end();

  const { orderId, cardCode, paymentMethod } = req.body;
  
  // ดึงค่าจาก .env
  const merchantId = process.env.TMPAY_MERCHANT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  // สร้าง URL สำหรับให้ TMPAY ส่งผลลัพธ์กลับมา (Callback URL)
  const respUrl = `${baseUrl}/api/payment/tmpay-callback?order_id=${orderId}`;

  try {
    // 1. ตรวจสอบว่ามี Order นี้จริงไหม
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: 'ไม่พบรายการสั่งซื้อ' });

    // 2. กำหนดค่า channel ตามประเภทบัตร
    // - ถ้าเป็น Razer Gold ให้ใช้ 'razer_gold_pin'
    // - ถ้าเป็น TrueMoney ให้ใช้ 'truemoney' (หรือปล่อยว่างได้ แต่ใส่ไว้ชัวร์กว่า)
    const channel = paymentMethod === 'razer' ? 'razer_gold_pin' : 'truemoney';

    // 3. เตรียม URL และ Parameter ที่จะส่งไป TMPAY
    const tmpayEndpoint = 'http://www.tmpay.net/TPG/backend.php';
    
    const params = new URLSearchParams({
      merchant_id: merchantId,
      password: cardCode, // รหัสบัตร
      resp_url: respUrl,  // URL รับผล
      channel: channel    // 👈 จุดสำคัญ: ส่งค่า channel ไปด้วย
    });

    const requestUrl = `${tmpayEndpoint}?${params.toString()}`;
    console.log("Sending to TMPAY:", requestUrl); // ดู Log ใน Terminal ได้ว่าส่งอะไรไป

    // 4. ยิง Request ไปหา TMPAY
    const tmpayRes = await fetch(requestUrl);
    const resultText = await tmpayRes.text(); // TMPAY ตอบกลับเป็น Text ธรรมดา

    // 5. ตรวจสอบการตอบกลับ (Response)
    // TMPAY จะตอบกลับมาว่า SUCCEED หรือ ERROR ...
    if (resultText.includes('SUCCEED')) {
       // อัปเดตสถานะเป็น "กำลังตรวจสอบ" (VERIFYING)
       await prisma.order.update({
         where: { id: orderId },
         data: { status: 'VERIFYING' } 
       });
       return res.status(200).json({ success: true, message: 'ส่งข้อมูลสำเร็จ' });
    } else {
       // กรณีส่งไม่ผ่าน (เช่น รหัสร้านค้าผิด, รูปแบบรหัสบัตรผิด)
       return res.status(400).json({ error: `เกิดข้อผิดพลาดจาก TMPAY: ${resultText}` });
    }

  } catch (error) {
    console.error("Payment Error:", error);
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเชื่อมต่อระบบชำระเงิน' });
  }
}