import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Loader2, CheckCircle, XCircle, ArrowLeft, Clock } from 'lucide-react';

export default function PaymentStatus() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูลออเดอร์
  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/order/status?orderId=${orderId}`);
      const data = await res.json();
      setOrder(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  // เช็คสถานะอัตโนมัติทุก 3 วินาที (Polling)
  useEffect(() => {
    if (!orderId) return;
    
    fetchOrder(); // เช็คครั้งแรกทันที

    const interval = setInterval(() => {
      fetchOrder();
    }, 3000); // เช็คซ้ำทุก 3 วิ

    // ถ้าสถานะจบแล้ว (จ่ายแล้ว หรือ ล้มเหลว) ให้หยุดเช็ค
    if (order && (order.status === 'PAID' || order.status === 'FAILED')) {
        clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [orderId, order?.status]);

  if (loading || !order) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white font-sans">
        <Loader2 size={64} className="text-cyan-500 animate-spin mb-4"/>
        <p className="text-gray-400 animate-pulse">กำลังโหลดข้อมูล...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/50 to-black -z-10"></div>

      <div className="max-w-md w-full bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl shadow-2xl text-center relative z-10">
        
        {/* --- สถานะ: กำลังตรวจสอบ (VERIFYING / PENDING) --- */}
        {(order.status === 'PENDING' || order.status === 'VERIFYING') && (
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 relative">
                    <Clock size={48} className="text-yellow-500" />
                    <span className="absolute top-0 right-0 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500"></span>
                    </span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">กำลังตรวจสอบการชำระเงิน</h1>
                <p className="text-gray-400 text-sm mb-8">ระบบกำลังตรวจสอบรหัสบัตรของคุณกับ TMPAY <br/>กรุณารอสักครู่ (ใช้เวลาประมาณ 1-3 นาที)</p>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 animate-progress w-full origin-left"></div>
                </div>
            </div>
        )}

        {/* --- สถานะ: สำเร็จ (PAID) --- */}
        {order.status === 'PAID' && (
            <div className="flex flex-col items-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <CheckCircle size={48} className="text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-green-400 mb-2">ชำระเงินสำเร็จ!</h1>
                <p className="text-gray-300 text-sm mb-6">ขอบคุณที่ใช้บริการครับ สินค้าถูกจัดส่งเรียบร้อยแล้ว</p>
                
                {/* แสดงสินค้าที่ได้ (ถ้าเป็น ID) */}
                {order.orderItems && order.orderItems[0].deliveredContent && (
                    <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-xl w-full mb-6">
                        <p className="text-xs text-green-400 font-bold uppercase mb-2">สินค้าของคุณ:</p>
                        <div className="bg-black/50 p-3 rounded-lg font-mono text-lg text-white break-all select-all cursor-pointer border border-white/5 hover:border-green-500/50 transition-colors">
                            {order.orderItems[0].deliveredContent}
                        </div>
                    </div>
                )}

                <Link href="/">
                    <button className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-green-400 transition-all shadow-lg w-full">
                        กลับหน้าหลัก
                    </button>
                </Link>
            </div>
        )}

        {/* --- สถานะ: ล้มเหลว (FAILED) --- */}
        {order.status === 'FAILED' && (
            <div className="flex flex-col items-center animate-in shake duration-300">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                    <XCircle size={48} className="text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-red-500 mb-2">ชำระเงินไม่สำเร็จ</h1>
                <p className="text-gray-400 text-sm mb-6">รหัสบัตรไม่ถูกต้อง หรือถูกใช้ไปแล้ว <br/>กรุณาตรวจสอบและทำรายการใหม่อีกครั้ง</p>
                
                <Link href={`/product/${order.orderItems[0].productId}`}>
                    <button className="bg-white/10 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all w-full">
                        ลองใหม่อีกครั้ง
                    </button>
                </Link>
            </div>
        )}

      </div>

      <style jsx>{`
        @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        .animate-progress {
            animation: progress 2s infinite linear;
        }
      `}</style>
    </div>
  );
}