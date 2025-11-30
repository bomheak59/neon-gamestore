import { NextResponse } from 'next/server'

export function middleware(request) {
  // เช็คค่าจาก Vercel ว่าเปิดโหมดปิดเว็บไหม?
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  // ถ้าเปิดโหมดอยู่ และคนเข้าไม่ได้อยู่ที่หน้า maintenance
  if (isMaintenanceMode && !request.nextUrl.pathname.startsWith('/maintenance')) {
    // ส่งไปหน้า maintenance ทันที
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // บังคับใช้กับทุกหน้า ยกเว้นไฟล์ระบบ (รูปภาพ, api, ฯลฯ)
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}