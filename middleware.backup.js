import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // =========================================================
  // 🔐 ส่วนที่ 1: ระบบความปลอดภัยหลังบ้าน (Admin Security)
  // =========================================================
  
  // รายชื่อเส้นทางที่ต้องป้องกัน (ห้ามคนนอกเข้า)
  const protectedPaths = [
    '/admin', 
    '/api/admin', 
    '/api/product/create', 
    '/api/product/update', 
    '/api/product/delete'
  ];

  // เช็คว่ากำลังจะเข้าเส้นทางต้องห้ามหรือไม่?
  const isPathProtected = protectedPaths.some(path => pathname.startsWith(path));
  const isLoginPage = pathname === '/admin/login';

  if (isPathProtected && !isLoginPage) {
    const token = request.cookies.get('admin_token')?.value;

    // ฟังก์ชันดีดออก
    const reject = () => {
      // ถ้าเป็น API ให้ตอบ Error 401
      if (pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      // ถ้าเป็นหน้าเว็บ ให้ดีดไป Login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    };

    if (!token) return reject();

    try {
      // ตรวจสอบลายเซ็นบัตรผ่าน
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      
      // ✅ ถ้าผ่าน: อนุญาตให้ไปต่อได้เลย (และไม่ต้องเช็ค Maintenance ต่อ)
      return NextResponse.next();
    } catch (error) {
      return reject();
    }
  }

  // =========================================================
  // 🚧 ส่วนที่ 2: โหมดปิดปรับปรุง (Maintenance Mode)
  // =========================================================
 
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  // ถ้าเปิดโหมดซ่อมบำรุงอยู่...
  if (isMaintenanceMode) {
    // อนุญาตให้เข้าได้เฉพาะ: 
    // 1. หน้า maintenance เอง
    // 2. ไฟล์ระบบ (_next, static files, รูปภาพ)
    // 3. API (เผื่อต้องใช้)
    // 4. หน้า Login แอดมิน (เผื่อแอดมินจะเข้าไปปิดโหมด)
    if (
      !pathname.startsWith('/maintenance') &&
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/api') &&
      !pathname.startsWith('/admin/login') &&
      !pathname.includes('.') // ไฟล์ที่มีนามสกุล เช่น .jpg, .css
    ) {
      // ดีดคนทั่วไปไปหน้า maintenance
      return NextResponse.rewrite(new URL('/maintenance', request.url));
    }
  }

  return NextResponse.next();
}

// กำหนดขอบเขตการทำงาน
export const config = {
  matcher: [
    /*
     * บังคับใช้กับทุกเส้นทาง ยกเว้น:
     * - api (บางตัวที่ไม่ใช่ admin)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};