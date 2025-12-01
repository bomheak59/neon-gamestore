import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast'; // 👈 ต้องมีบรรทัดนี้

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* 👇 และต้องมีบรรทัดนี้ (ตัวแสดงผลแจ้งเตือน) */}
      <Toaster position="bottom-center" reverseOrder={false} />
      
      <Component {...pageProps} />
    </>
  );
}