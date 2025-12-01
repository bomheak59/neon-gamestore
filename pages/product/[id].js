import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, ShieldCheck, Zap, CreditCard, Ticket, CheckSquare, Square, ChevronLeft, ChevronRight, Check, Gem, Sparkles, Cpu, Wallet } from 'lucide-react';

export default function ProductDetail({ product }) {
  const router = useRouter();
  
  const [contact, setContact] = useState(''); 
  const [uid, setUid] = useState(''); 
  const [paymentMethod, setPaymentMethod] = useState('truemoney'); 
  const [cardCode, setCardCode] = useState(''); 
  const [isAgreed, setIsAgreed] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- ส่วนจัดการแพ็คเกจ ---
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(product ? product.price : 0);

  const options = product?.options ? JSON.parse(product.options) : [];

  const originalPrice = (product && product.discount > 0) 
    ? Math.round(currentPrice * 100 / (100 - product.discount)) 
    : null;

  useEffect(() => {
    if (product) {
        let imgs = [product.imageUrl]; 
        if (product.images) {
            try {
                const parsed = JSON.parse(product.images);
                if (Array.isArray(parsed) && parsed.length > 0) imgs = parsed;
            } catch (e) {}
        }
        setImageList(imgs);
        setCurrentIndex(0);
        setCurrentPrice(product.price);
        setSelectedOption(null);
        setSelectedIdx(null);
    }
  }, [product]);

  const prevImage = () => { setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1)); };
  const nextImage = () => { setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1)); };

  // 🔥 แก้ไขฟังก์ชันนี้: เพิ่ม Logic ตรวจสอบการกดซ้ำ (Deselect) 🔥
  const handleOptionSelect = (opt, idx) => {
    if (selectedIdx === idx) {
        // ถ้ากดตัวเดิม -> ให้ยกเลิกการเลือก (Reset กลับเป็นค่าเริ่มต้น)
        setSelectedOption(null);
        setSelectedIdx(null);
        setCurrentPrice(product.price); // ราคากลับไปเป็นราคาเริ่มต้นของสินค้า
    } else {
        // ถ้าเลือกใหม่ -> ทำงานปกติ
        setSelectedOption(opt);
        setSelectedIdx(idx);
        setCurrentPrice(opt.price); 
    }
  };

  const handleBuy = async () => {
    if (!contact) return toast.error('กรุณากรอกเบอร์โทรหรืออีเมล');
    if (product.type === 'TOPUP') {
        if (!uid) return toast.error('กรุณากรอก UID เกม');
        if (options.length > 0 && !selectedOption) return toast.error('กรุณาเลือกแพ็คเกจราคาที่ต้องการเติม');
    }
    if (paymentMethod === 'truemoney' && cardCode.length !== 14) return toast.error('รหัสบัตรทรูมันนี่ต้องมี 14 หลัก');
    if (paymentMethod === 'razer' && cardCode.length < 10) return toast.error('รหัส Razer Gold ไม่ถูกต้อง');
    if (!isAgreed) return toast.error('กรุณากดยอมรับเงื่อนไข');

    setIsLoading(true);
    const loadingToast = toast.loading('กำลังดำเนินการ...');

    try {
      const res = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          contact: { type: 'mixed', value: contact },
          userInput: { uid },
          selectedOption
        })
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || 'เกิดข้อผิดพลาด');

      if (paymentMethod === 'truemoney' || paymentMethod === 'razer') {
        const payRes = await fetch('/api/payment/tmpay-submit', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: orderData.orderId, cardCode: cardCode, paymentMethod: paymentMethod, mobile: contact })
        });
        const payResult = await payRes.json();
        if (!payRes.ok) throw new Error(payResult.error);
        toast.dismiss(loadingToast);
        toast.success('ส่งข้อมูลบัตรแล้ว! กำลังตรวจสอบ');
        router.push(`/payment/${orderData.orderId}`);
      } else {
        toast.dismiss(loadingToast);
        toast.success('สร้างรายการสำเร็จ!');
        router.push(`/payment/${orderData.orderId}`);
      }
    } catch (error) { toast.dismiss(loadingToast); toast.error(error.message); setIsLoading(false); }
  };

  if (!product) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="animate-spin text-cyan-500"/></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 py-20 relative overflow-hidden font-sans">
      <Head><title>ชำระเงิน - {product.name} | NEON STORE</title></Head>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* ส่วนซ้าย (รูปภาพ) */}
        <div className="lg:col-span-6 space-y-6">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors mb-4">
            <ArrowLeft size={20} /> กลับหน้าร้านค้า
          </button>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="w-full h-[450px] rounded-2xl overflow-hidden mb-6 border border-white/5 relative group bg-black flex items-center justify-center">
                <img src={imageList[currentIndex]} alt={product.name} className="w-full h-full object-contain transition-all duration-500" />
                {imageList.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-cyan-500 text-white p-2 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"><ChevronLeft size={24} /></button>
                        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-cyan-500 text-white p-2 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"><ChevronRight size={24} /></button>
                        <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">{currentIndex + 1} / {imageList.length}</div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">{imageList.map((_, idx) => (<div key={idx} className={`w-2 h-2 rounded-full transition-all ${currentIndex === idx ? 'bg-cyan-500 w-4' : 'bg-white/30'}`}/>))}</div>
                    </>
                )}
                {product.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded shadow-lg animate-pulse">ลด {product.discount}%</div>
                )}
            </div>
            <h1 className="text-3xl font-bold mb-2 text-white">{product.name}</h1>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{product.description}</p>
            <div className="flex justify-between items-center border-t border-white/10 pt-4">
              <span className="text-gray-500">ราคาเริ่มต้น</span>
              <div className="flex flex-col items-end">
                 {originalPrice && <div className="flex items-center gap-2 text-xs text-gray-500"><span className="line-through">฿{originalPrice.toLocaleString()}</span><span className="text-red-400">(-{product.discount}%)</span></div>}
                 <span className="text-3xl font-bold text-cyan-400">฿{product.price}</span>
              </div>
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

        {/* ส่วนขวา (ฟอร์มชำระเงิน) */}
        <div className="lg:col-span-6 bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative">
          <div className="mb-6 pb-4 border-b border-white/10">
            <h2 className="text-2xl font-bold flex items-center gap-2">ชำระ 💸 <span className="text-gray-400 text-lg font-normal">( สินค้า )</span></h2>
            <p className="text-xs text-gray-500 mt-1">กรอกข้อมูลด้านล่างเพื่อทำการชำระสินค้า</p>
          </div>

          <div className="space-y-6">
            
            {product.type === 'TOPUP' && options.length > 0 && (
             <div className="mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="text-sm font-bold text-yellow-400 mb-3 flex items-center gap-2">
                  <Zap size={16} className="animate-pulse"/> เลือกแพ็คเกจราคา
               </div>
               <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                 {options.map((opt, idx) => {
                    const baseVal = parseInt(opt.base) || 0;
                    const bonusPercent = parseInt(opt.bonusPercent) || 0;
                    const bonusAmount = Math.floor((baseVal * bonusPercent) / 100);
                    
                    return (
                       <button
                         key={idx}
                         onClick={() => handleOptionSelect(opt, idx)}
                         className={`relative p-4 rounded-xl border transition-all duration-200 group overflow-hidden text-left h-full flex items-center justify-between ${
                           selectedIdx === idx 
                           ? 'border-cyan-500 bg-cyan-900/20 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-[1.02] z-10' 
                           : 'border-gray-800 bg-[#151515] hover:border-gray-600 hover:bg-gray-800'
                         }`}
                       >
                         <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${selectedIdx === idx ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                                <Gem size={20} className="fill-current"/>
                            </div>
                            <div>
                                <div className="text-white font-bold text-lg leading-none">
                                    {baseVal} 
                                    {bonusAmount > 0 && <span className="text-green-400 ml-1">+{bonusAmount}</span>}
                                </div>
                                {bonusPercent > 0 && (
                                    <div className="text-[10px] font-bold text-fuchsia-400 mt-1 uppercase tracking-wider">
                                        BONUS {bonusPercent}%
                                    </div>
                                )}
                            </div>
                         </div>
                         
                         <div className={`text-xl font-black ${selectedIdx === idx ? 'text-cyan-400' : 'text-white'}`}>
                             {opt.price}฿
                         </div>

                         {selectedIdx === idx && (
                           <div className="absolute top-0 right-0 bg-cyan-500 text-black p-0.5 rounded-bl-lg shadow-lg">
                             <Check size={12} strokeWidth={4} />
                           </div>
                         )}
                       </button>
                    );
                 })}
               </div>
             </div>
            )}

            {selectedOption && (
                <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 p-4 rounded-xl flex justify-between items-center animate-in zoom-in duration-300 shadow-[0_0_15px_rgba(6,182,212,0.1)] mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-cyan-500 p-2 rounded-lg shadow-lg"><Gem size={20} className="text-black fill-current"/></div>
                        <div>
                            <p className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">SELECTED PACKAGE</p>
                            <p className="text-white font-bold text-lg leading-none">
                                {selectedOption.base} 
                                {(parseInt(selectedOption.base) * parseInt(selectedOption.bonusPercent) / 100) > 0 && 
                                 <span className="text-green-400 ml-1">+{Math.floor(parseInt(selectedOption.base) * parseInt(selectedOption.bonusPercent) / 100)}</span>}
                            </p>
                        </div>
                    </div>
                    <div className="text-right"><p className="text-2xl font-black text-cyan-400 drop-shadow-md">฿{selectedOption.price}</p></div>
                </div>
            )}

            <div>
              <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 inline-block rounded-t-lg">ประเภทบัตร / ช่องทาง</div>
              <div className="bg-[#1a1a1a] border border-white/10 rounded-b-xl rounded-tr-xl overflow-hidden">
                <div onClick={() => setPaymentMethod('truemoney')} className={`p-4 flex items-center justify-between cursor-pointer border-b border-white/5 transition-all ${paymentMethod === 'truemoney' ? 'bg-orange-900/20' : 'hover:bg-white/5'}`}>
                  <div className="flex items-center gap-3"><div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'truemoney' ? 'border-orange-500 bg-orange-500' : 'border-gray-500'}`}></div><span className="flex items-center gap-2 font-bold text-sm text-white"><Ticket size={18} className="text-orange-500"/> จ่ายด้วยบัตรทรูมันนี่</span></div>{paymentMethod === 'truemoney' && <Zap size={16} className="text-orange-500" />}
                </div>
                <div onClick={() => setPaymentMethod('razer')} className={`p-4 flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'razer' ? 'bg-green-900/20' : 'hover:bg-white/5'}`}>
                  <div className="flex items-center gap-3"><div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'razer' ? 'border-green-500 bg-green-500' : 'border-gray-500'}`}></div><span className="flex items-center gap-2 font-bold text-sm text-white"><CreditCard size={18} className="text-green-500"/> จ่ายด้วย Razer Gold Pin</span></div>{paymentMethod === 'razer' && <Zap size={16} className="text-green-500" />}
                </div>
              </div>
            </div>

            <div>
              <div className="flex"><div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-tl-lg">เบอร์โทรศัพท์ / E-mail</div><div className="bg-green-700 text-white text-xs font-bold px-3 py-1 rounded-tr-lg">เพื่อรับสินค้า</div></div>
              <input type="text" placeholder="กรอกเบอร์โทรศัพท์ หรือ E-mail เพื่อรับสินค้า" className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded-b-xl focus:border-cyan-500 outline-none text-white placeholder:text-gray-600 transition-all" value={contact} onChange={(e) => setContact(e.target.value)}/>
            </div>

            {product.type === 'TOPUP' && (
              <div>
                <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 inline-block rounded-t-lg">UID / เลขไอดีเกม</div>
                <input type="text" placeholder="กรอก UID เกมของคุณ (เช่น 12345678)" className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded-b-xl rounded-tr-xl focus:border-blue-500 outline-none text-white placeholder:text-gray-600 transition-all font-mono" value={uid} onChange={(e) => setUid(e.target.value)}/>
              </div>
            )}

            <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                <div className="flex justify-between items-end"><div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-t-lg">{paymentMethod === 'truemoney' ? 'รหัสบัตรทรูมันนี่ (14 หลัก)' : 'รหัส Razer Gold Pin'}</div><div className="bg-green-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-t-lg mb-0.5">ยอดที่ต้องชำระ: {currentPrice} บาท</div></div>
                <input type="text" maxLength={paymentMethod === 'truemoney' ? 14 : 20} placeholder={`กรอกรหัสบัตร ${paymentMethod === 'truemoney' ? 'ทรูมันนี่ 14 หลัก' : 'Razer Gold'} ที่นี่`} className="w-full bg-[#1a1a1a] border border-red-500/50 p-4 rounded-b-xl rounded-tl-none focus:border-red-500 outline-none text-white placeholder:text-gray-600 transition-all font-mono text-lg tracking-widest text-center" value={cardCode} onChange={(e) => setCardCode(e.target.value)}/>
            </div>

            <div className="flex gap-3 items-start bg-gray-900/50 p-3 rounded-xl border border-white/5">
              <button onClick={() => setIsAgreed(!isAgreed)} className="mt-0.5 shrink-0">{isAgreed ? <CheckSquare className="text-cyan-400" /> : <Square className="text-gray-500" />}</button>
              <div className="text-xs text-gray-400 leading-relaxed cursor-pointer" onClick={() => setIsAgreed(!isAgreed)}>ยืนยันการสั่งซื้อ กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดชำระเงินทุกครั้ง <br/><span className="text-red-400 font-bold">หากเกิดข้อผิดพลาดทางเราจะไม่มีการคืนเงินใดๆ ทั้งสิ้น</span></div>
            </div>
            
            <button onClick={handleBuy} disabled={isLoading} className="w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-red-900/20">
              {isLoading ? <><Loader2 className="animate-spin"/> กำลังตรวจสอบบัตร...</> : `ชำระเงินสินค้า (${currentPrice} บาท)`}
            </button>

          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  const prisma = (await import('@/lib/prisma')).default;
  const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
  if (!product) return { notFound: true };
  return { props: { product: JSON.parse(JSON.stringify(product)) } };
}