import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, ShieldCheck, Zap, CreditCard, QrCode, CheckSquare, Square, Ticket } from 'lucide-react';

export default function ProductDetail({ product }) {
  const router = useRouter();
  
  // State ข้อมูล
  const [contact, setContact] = useState(''); 
  const [uid, setUid] = useState(''); 
  // 👇 เปลี่ยนค่าเริ่มต้นเป็น 'truemoney' เพราะไม่มี QR แล้ว
  const [paymentMethod, setPaymentMethod] = useState('truemoney'); 
  const [cardCode, setCardCode] = useState(''); 
  const [isAgreed, setIsAgreed] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    // 1. Validation
    if (!contact) return toast.error('กรุณากรอกเบอร์โทรหรืออีเมลเพื่อรับสินค้า');
    if (product.type === 'TOPUP' && !uid) return toast.error('กรุณากรอก UID เกม');
    
    // เช็คความยาวรหัสบัตร
    if (paymentMethod === 'truemoney' && cardCode.length !== 14) {
      return toast.error('รหัสบัตรทรูมันนี่ต้องมี 14 หลัก');
    }
    if (paymentMethod === 'razer' && cardCode.length < 10) {
      return toast.error('รหัส Razer Gold ไม่ถูกต้อง');
    }

    if (!isAgreed) return toast.error('กรุณากดยอมรับเงื่อนไขก่อนสั่งซื้อ');

    setIsLoading(true);
    const loadingToast = toast.loading('กำลังดำเนินการ...');

    try {
      // 2. สร้าง Order
      const createRes = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          contact: { type: 'mixed', value: contact },
          userInput: { uid } 
        })
      });

      const orderData = await createRes.json();
      
      if (!createRes.ok) throw new Error(orderData.error || 'เกิดข้อผิดพลาดในการสร้างรายการ');

      // 3. ส่งข้อมูลบัตรไปตัดเงิน (TMPAY)
      // (ไม่ต้องเช็ค if QR แล้ว เพราะเหลือแค่บัตร)
      const payRes = await fetch('/api/payment/tmpay-submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              orderId: orderData.orderId,
              cardCode: cardCode,
              paymentMethod: paymentMethod, 
              mobile: contact 
          })
      });

      const payResult = await payRes.json();
      
      if (!payRes.ok) throw new Error(payResult.error || 'ส่งข้อมูลบัตรไม่สำเร็จ');
      
      toast.dismiss(loadingToast);
      toast.success('ส่งข้อมูลบัตรแล้ว! ระบบกำลังตรวจสอบ (รอ 1-3 นาที)');
      
      router.push(`/payment/${orderData.orderId}`);

    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  if (!product) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-cyan-500"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 py-20 relative overflow-hidden font-sans">
      <Head><title>ชำระเงิน - {product.name} | NEON STORE</title></Head>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* --- ส่วนซ้าย: รายละเอียดสินค้า --- */}
        <div className="lg:col-span-5 space-y-6">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors mb-4">
            <ArrowLeft size={20} /> กลับหน้าร้านค้า
          </button>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover rounded-2xl mb-6 shadow-lg group-hover:scale-105 transition-transform duration-500" />
            
            <h1 className="text-3xl font-bold mb-2 text-white">{product.name}</h1>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{product.description}</p>
            
            <div className="flex justify-between items-center border-t border-white/10 pt-4">
              <span className="text-gray-500">ราคาสินค้า</span>
              <span className="text-3xl font-bold text-cyan-400">฿{product.price}</span>
            </div>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="text-green-400 shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-green-400 text-sm">รับประกันสินค้า 100%</h4>
              <p className="text-xs text-green-200/70 mt-1">สินค้าทุกชิ้นมีการรับประกัน หากใช้งานไม่ได้ยินดีคืนเงินหรือเปลี่ยนใหม่ทันที</p>
            </div>
          </div>
        </div>

        {/* --- ส่วนขวา: ฟอร์มชำระเงิน --- */}
        <div className="lg:col-span-7 bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative">
          
          <div className="mb-6 pb-4 border-b border-white/10">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              ชำระ 💸 <span className="text-gray-400 text-lg font-normal">( สินค้า )</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">กรอกข้อมูลด้านล่างเพื่อทำการชำระสินค้า รองรับทั้งโอนเงินและบัตรเติมเงิน</p>
          </div>

          <div className="space-y-6">
            
            {/* 1. เลือกช่องทางชำระเงิน (ตัด QR ออกแล้ว) */}
            <div>
              <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 inline-block rounded-t-lg">ประเภทบัตร / ช่องทาง</div>
              <div className="bg-[#1a1a1a] border border-white/10 rounded-b-xl rounded-tr-xl overflow-hidden">
                
                {/* ตัวเลือก TrueMoney */}
                <div 
                  onClick={() => setPaymentMethod('truemoney')}
                  className={`p-4 flex items-center justify-between cursor-pointer border-b border-white/5 transition-all ${paymentMethod === 'truemoney' ? 'bg-orange-900/20' : 'hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'truemoney' ? 'border-orange-500 bg-orange-500' : 'border-gray-500'}`}></div>
                    <span className="flex items-center gap-2 font-bold text-sm text-white">
                      <Ticket size={18} className="text-orange-500"/> จ่ายด้วยบัตรทรูมันนี่
                    </span>
                  </div>
                  {paymentMethod === 'truemoney' && <Zap size={16} className="text-orange-500" />}
                </div>

                {/* ตัวเลือก Razer Gold */}
                <div 
                  onClick={() => setPaymentMethod('razer')}
                  className={`p-4 flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'razer' ? 'bg-green-900/20' : 'hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'razer' ? 'border-green-500 bg-green-500' : 'border-gray-500'}`}></div>
                    <span className="flex items-center gap-2 font-bold text-sm text-white">
                      <CreditCard size={18} className="text-green-500"/> จ่ายด้วย Razer Gold Pin
                    </span>
                  </div>
                  {paymentMethod === 'razer' && <Zap size={16} className="text-green-500" />}
                </div>

              </div>
            </div>

            {/* 2. เบอร์โทรศัพท์ / E-mail */}
            <div>
              <div className="flex">
                <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-tl-lg">เบอร์โทรศัพท์ / E-mail</div>
                <div className="bg-green-700 text-white text-xs font-bold px-3 py-1 rounded-tr-lg">เพื่อรับสินค้า</div>
              </div>
              <input 
                type="text" 
                placeholder="กรอกเบอร์โทรศัพท์ หรือ E-mail เพื่อรับสินค้า"
                className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded-b-xl focus:border-cyan-500 outline-none text-white placeholder:text-gray-600 transition-all"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            {/* 2.5 ช่องกรอก UID (แสดงเฉพาะเติมเกม) */}
            {product.type === 'TOPUP' && (
              <div>
                <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 inline-block rounded-t-lg">UID / เลขไอดีเกม</div>
                <input 
                  type="text" 
                  placeholder="กรอก UID เกมของคุณ (เช่น 12345678)"
                  className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded-b-xl rounded-tr-xl focus:border-blue-500 outline-none text-white placeholder:text-gray-600 transition-all font-mono"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                />
              </div>
            )}

            {/* 3. ช่องกรอกรหัสบัตร (โชว์ตลอด เพราะเหลือแค่บัตร) */}
            <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                <div className="flex justify-between items-end">
                   <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-t-lg">
                     {paymentMethod === 'truemoney' ? 'รหัสบัตรทรูมันนี่ (14 หลัก)' : 'รหัส Razer Gold Pin'}
                   </div>
                   <div className="bg-green-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-t-lg mb-0.5">
                     ยอดที่ต้องชำระ: {product.price} บาท
                   </div>
                </div>
                <input 
                  type="text" 
                  maxLength={paymentMethod === 'truemoney' ? 14 : 20}
                  placeholder={`กรอกรหัสบัตร ${paymentMethod === 'truemoney' ? 'ทรูมันนี่ 14 หลัก' : 'Razer Gold'} ที่นี่`}
                  className="w-full bg-[#1a1a1a] border border-red-500/50 p-4 rounded-b-xl rounded-tl-none focus:border-red-500 outline-none text-white placeholder:text-gray-600 transition-all font-mono text-lg tracking-widest text-center"
                  value={cardCode}
                  onChange={(e) => setCardCode(e.target.value)}
                />
            </div>

            {/* 4. Checkbox ยืนยัน */}
            <div className="flex gap-3 items-start bg-gray-900/50 p-3 rounded-xl border border-white/5">
              <button onClick={() => setIsAgreed(!isAgreed)} className="mt-0.5 shrink-0">
                {isAgreed ? <CheckSquare className="text-cyan-400" /> : <Square className="text-gray-500" />}
              </button>
              <div className="text-xs text-gray-400 leading-relaxed cursor-pointer" onClick={() => setIsAgreed(!isAgreed)}>
                ยืนยันการสั่งซื้อ กรุณาตรวจสอบเบอร์โทรศัพท์ / E-mail ให้ถูกต้องก่อนกดสั่งซื้อทุกครั้ง <br/>
                <span className="text-red-400 font-bold">หากเกิดข้อผิดพลาดทางเราจะไม่มีการคืนเงินใดๆ ทั้งสิ้น</span>
              </div>
            </div>

            {/* 5. ปุ่มชำระเงิน */}
            <button
              onClick={handleBuy}
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-red-900/20"
            >
              {isLoading ? (
                <><Loader2 className="animate-spin"/> กำลังตรวจสอบบัตร...</>
              ) : (
                `ชำระเงินสินค้า (${product.price} บาท)`
              )}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  const prisma = (await import('@/lib/prisma')).default;
  const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });

  if (!product) return { notFound: true };

  return {
    props: { 
      product: JSON.parse(JSON.stringify(product)) 
    }
  };
}