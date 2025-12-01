import { SignJWT } from 'jose';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  // ตรวจสอบ User/Pass จาก .env (สำคัญมาก!)
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    
    // สร้าง JWT Token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    // ฝัง Cookie (Secure)
    const isProduction = process.env.NODE_ENV === 'production';
    res.setHeader(
      'Set-Cookie',
      `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400; ${isProduction ? 'Secure;' : ''}`
    );

    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง' });
}