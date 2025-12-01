import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // -------------------------------------------------------------
  // 🔒 ตั้งค่าความปลอดภัย
  // -------------------------------------------------------------
  const adminPaths = ['/admin', '/api/admin', '/api/product/create', '/api/product/update', '/api/product/delete']; // เส้นทางต้องห้าม
  const publicPaths = ['/admin/login']; // ข้อยกเว้น

  // เช็คว่าเป็นเส้นทางที่ต้องป้องกันหรือไม่?
  const isProtected = adminPaths.some(path => pathname.startsWith(path));
  const isPublic = publicPaths.some(path => pathname.startsWith(path));

  if (isProtected && !isPublic) {
    // 1. ตรวจหาบัตรผ่าน (Cookie)
    const token = request.cookies.get('admin_token')?.value;

    // ฟังก์ชันดีดออก (Redirect หรือ Error)
    const reject = () => {
        // ถ้าเป็น API ให้ตอบ JSON Error
        if (pathname.startsWith('/api')) {
            return NextResponse.json({ error: 'Unauthorized: กรุณาเข้าสู่ระบบ' }, { status: 401 });
        }
        // ถ้าเป็นหน้าเว็บ ให้ดีดไปหน้า Login
        return NextResponse.redirect(new URL('/admin/login', request.url));
    };

    if (!token) return reject();

    try {
      // 2. ตรวจสอบลายเซ็นบัตร (Verify Token)
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      
      // ✅ ผ่าน: อนุญาตให้เข้า
      return NextResponse.next();
    } catch (error) {
      // ❌ ไม่ผ่าน: บัตรปลอม/หมดอายุ -> ดีดออก
      return reject();
    }
  }

  return NextResponse.next();
}

// กำหนดให้ Middleware ทำงานกับทุกเส้นทาง (เพื่อให้ชัวร์ว่าดักได้หมด)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};