import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { orderId, cardCode, paymentMethod } = req.body;
  
  // -------------------------------------------------------
  // 🔧 โหมดจำลอง (Simulation Mode) 🔧
  // เปลี่ยนเป็น true = เพื่อทดสอบระบบโดยไม่ต้องต่อ TMPAY จริง (ใช้ตอน TMPAY ล่ม)
  // เปลี่ยนเป็น false = เพื่อใช้งานจริง
  const IS_SIMULATION_MODE = true; 
  // -------------------------------------------------------

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: 'ไม่พบรายการสั่งซื้อ' });

    // ✅ 1. กรณีเปิดโหมดจำลอง (Bypass)
    if (IS_SIMULATION_MODE) {
        console.log("⚠️ Simulation Mode: Skipping TMPAY check...");
        
        // แกล้งทำเป็นว่าส่งสำเร็จ
        await prisma.order.update({
            where: { id: orderId },
            data: { status: 'VERIFYING' } 
        });

        // จำลองการรอสัก 1 วินาที
        await new Promise(resolve => setTimeout(resolve, 1000));

        return res.status(200).json({ 
            success: true, 
            message: 'ระบบจำลอง: ส่งข้อมูลสำเร็จ (Simulation)' 
        });
    }

    // ✅ 2. กรณีใช้งานจริง (Real Mode)
    const merchantId = process.env.TMPAY_MERCHANT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const respUrl = `${baseUrl}/api/payment/tmpay-callback?order_id=${orderId}`;
    const channel = paymentMethod === 'razer' ? 'razer_gold_pin' : 'truemoney';
    const tmpayEndpoint = 'http://www.tmpay.net/TPG/backend.php'; // ใช้ลิงก์นี้ที่ถูกต้อง
    
    const params = new URLSearchParams({
      merchant_id: merchantId,
      password: cardCode,
      resp_url: respUrl
    });

    if (channel) params.append('channel', channel);

    const requestUrl = `${tmpayEndpoint}?${params.toString()}`;
    console.log("Sending to TMPAY:", requestUrl); 

    const tmpayRes = await fetch(requestUrl, {
        method: 'GET', // ย้ำว่าเป็น GET
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', // ปลอมตัวเป็น Browser
        }
    });
    
    const resultText = await tmpayRes.text();
    console.log("TMPAY Response:", resultText);

    // เช็ค Error จาก TMPAY
    if (resultText.includes('DB_IS_NOT_READY')) {
        return res.status(503).json({ error: 'ระบบ TMPAY ปิดปรับปรุงชั่วคราว (DB Error)' });
    }
    if (resultText.includes('Not Found')) {
        throw new Error('เชื่อมต่อ TMPAY ไม่ได้ (404)');
    }

    if (resultText.startsWith('SUCCEED')) {
       await prisma.order.update({ where: { id: orderId }, data: { status: 'VERIFYING' } });
       return res.status(200).json({ success: true });
    } else {
       return res.status(400).json({ error: `TMPAY Error: ${resultText}` });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}