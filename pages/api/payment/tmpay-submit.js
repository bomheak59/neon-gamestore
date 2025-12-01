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

    // 🔴 แก้ไข URL ตรงนี้ (ลองตัด /TPG ออก)
   const tmpayEndpoint = 'http://203.146.127.112/TPG/backend.php';
    
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

    // เช็คว่ายัง 404 อยู่ไหม
    if (resultText.includes('<title>404 Not Found</title>') || resultText.includes('Not Found')) {
        throw new Error(`ไม่พบ URL ของ TMPAY (ลิงก์ ${tmpayEndpoint} ผิด) - โปรดติดต่อแอดมิน TMPAY`);
    }

    if (resultText.startsWith('SUCCEED')) {
       await prisma.order.update({ where: { id: orderId }, data: { status: 'VERIFYING' } });
       return res.status(200).json({ success: true, message: 'ส่งข้อมูลสำเร็จ' });
    } else {
       return res.status(400).json({ error: `TMPAY Error: ${resultText}` });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}