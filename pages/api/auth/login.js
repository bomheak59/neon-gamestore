import { SignJWT } from 'jose';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, password } = req.body;

  // ตรวจสอบรหัสผ่านกับ .env
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    
    // สร้าง JWT Token (บัตรผ่าน)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h') // บัตรมีอายุ 24 ชม.
      .sign(secret);

    // ฝัง Cookie ลงใน Browser (HttpOnly เพื่อความปลอดภัยสูงสุด JavaScript อ่านไม่ได้)
    res.setHeader(
      'Set-Cookie',
      `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400;` // 86400 วิ = 1 วัน
    );

    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง' });
}