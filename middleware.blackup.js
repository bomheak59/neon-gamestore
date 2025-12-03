import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // อ่านค่าจาก Env
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  // 🔒 ส่วนที่ 1: ระบบความปลอดภัยหลังบ้าน (Admin Security)
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();

    const token = request.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.redirect(new URL('/admin/login', request.url));

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 🚧 ส่วนที่ 2: โหมดปิดปรับปรุง (Maintenance Mode)
  if (isMaintenanceMode) {
    // อนุญาตให้เข้าได้เฉพาะหน้าเหล่านี้
    if (
      pathname.startsWith('/maintenance') || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api') || 
      pathname.startsWith('/admin') || // แอดมินต้องเข้าได้
      pathname.includes('.') // รูปภาพ/ไฟล์
    ) {
      return NextResponse.next();
    }

    // ดีดไปหน้า maintenance
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }

  // ถ้าปิดโหมดแล้ว แต่ยังอยู่หน้า maintenance -> ดีดกลับหน้าแรก
  if (!isMaintenanceMode && pathname === '/maintenance') {
     return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};