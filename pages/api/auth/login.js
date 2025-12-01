import { SignJWT } from 'jose';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  // 1. ตรวจสอบ User/Pass จาก .env
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    
    // 2. สร้าง JWT Token (บัตรผ่าน)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ role: 'admin' }) 
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h') // บัตรหมดอายุใน 24 ชม.
      .sign(secret);

    // 3. ตั้งค่าความปลอดภัยของ Cookie (Layer 3)
    // ถ้าเป็น Production (เว็บจริง) ให้ใส่ Secure; เพื่อบังคับ HTTPS
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.setHeader(
      'Set-Cookie',
      `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400; ${isProduction ? 'Secure;' : ''}`
    );

    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง' });
}