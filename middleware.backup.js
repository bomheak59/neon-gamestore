import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // =========================================================
  // 🔐 ส่วนที่ 1: ระบบความปลอดภัยหลังบ้าน (Admin Security)
  // =========================================================
  
  // รายชื่อเส้นทางที่ต้องป้องกัน
  const protectedPaths = ['/admin', '/api/product', '/api/order', '/api/admin'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  const isLoginPage = pathname === '/admin/login';

  // ถ้าเข้าโซนอันตราย และไม่ใช่หน้า Login
  if (isProtected && !isLoginPage) {
    const token = request.cookies.get('admin_token')?.value;

    // ฟังก์ชันดีดออก
    const reject = () => {
      if (pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    };

    if (!token) return reject();

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      // ✅ ถ้าเป็น Admin ผ่านได้เลย (ไม่ต้องไปเช็ค Maintenance ต่อ)
      return NextResponse.next();
    } catch (error) {
      return reject();
    }
  }

  // =========================================================
  // 🚧 ส่วนที่ 2: โหมดปิดปรับปรุง (Maintenance Mode)
  // =========================================================
  
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  // ถ้าเปิดโหมดปิดปรับปรุงอยู่...
  if (isMaintenanceMode) {
    // อนุญาตให้เข้าได้เฉพาะ:
    // 1. หน้า maintenance
    // 2. ไฟล์ระบบ (_next, static files, รูปภาพ)
    // 3. API (เพื่อให้ระบบยังทำงานได้)
    // 4. หน้า Login แอดมิน (เผื่อแอดมินจะเข้าไปปิดโหมด)
    if (
      !pathname.startsWith('/maintenance') &&
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/api') &&
      !pathname.startsWith('/admin/login') &&
      !pathname.includes('.') // ไฟล์ที่มีนามสกุล
    ) {
      // ดีดคนทั่วไปไปหน้า maintenance
      return NextResponse.rewrite(new URL('/maintenance', request.url));
    }
  }
  
  // ถ้าปิดโหมดซ่อมบำรุงแล้ว แต่คนยังหลงมาหน้า maintenance -> ดีดกลับหน้าแรก
  if (!isMaintenanceMode && pathname === '/maintenance') {
     return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};