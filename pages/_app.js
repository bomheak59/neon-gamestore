import '@/styles/globals.css'; // เรียกใช้ CSS หลัก
import { Rajdhani } from 'next/font/google'; // เรียกใช้ Font
import { Toaster } from 'react-hot-toast'; // เรียกใช้ระบบแจ้งเตือน

// ตั้งค่า Font Rajdhani
const gamingFont = Rajdhani({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-gaming',
});

export default function App({ Component, pageProps }) {
  return (
    <main className={gamingFont.className}>
      {/* --- ส่วนตั้งค่าหน้าตาของป้ายแจ้งเตือน (Toast) --- */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          // กำหนดสไตล์พื้นฐานให้เป็นธีมมืด
          style: {
            background: 'rgba(20, 20, 20, 0.8)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(6, 182, 212, 0.2)', // ขอบสีฟ้าจางๆ
            padding: '12px 24px',
            borderRadius: '16px',
            fontFamily: gamingFont.style.fontFamily,
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)'
          },
          // ปรับแต่งไอคอนตอนสำเร็จ
          success: {
            iconTheme: {
              primary: '#22d3ee', // สีฟ้า Neon
              secondary: '#000',
            },
            duration: 4000,
          },
          // ปรับแต่งไอคอนตอน Error
          error: {
            iconTheme: {
              primary: '#f87171', // สีแดง Neon
              secondary: '#000',
            },
            duration: 5000,
          },
        }}
      />
      
      {/* แสดงผลหน้าเว็บปกติ */}
      <Component {...pageProps} />
    </main>
  );
}