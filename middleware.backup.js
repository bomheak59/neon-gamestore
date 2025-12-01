import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. ตรวจสอบโหมด Maintenance (ถ้ามี)
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  if (isMaintenanceMode && !pathname.startsWith('/maintenance') && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }

  // 2. ระบบป้องกันหน้า Admin (Admin Guard)
  // ถ้าพยายามเข้าหน้า /admin...
  if (pathname.startsWith('/admin')) {
    
    // ข้อยกเว้น: ถ้าเข้าหน้า Login ไม่ต้องตรวจ (เดี๋ยว Loop นรก)
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // หา Cookie ที่ชื่อ 'admin_token'
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      // ถ้าไม่มีบัตรผ่าน -> เตะไปหน้า Login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // ตรวจสอบลายเซ็นบัตรผ่าน (Verify JWT)
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      // ถ้าผ่าน: อนุญาตให้เข้าได้
      return NextResponse.next();
    } catch (error) {
      // ถ้าบัตรปลอม หรือหมดอายุ -> เตะไปหน้า Login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};