import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function CategoryPage({ products, categoryName }) {
  const router = useRouter();

  // --- LOGIC เลือกคำนำหน้าชื่อ (Prefix) อัตโนมัติ ---
  let titlePrefix = "ซื้อรหัส"; // ค่าเริ่มต้น

  // 1. เช็คว่าสินค้าในหมวดนี้เป็นแบบ TOPUP (เติมเกม) หรือไม่?
  const isTopup = products.some(p => p.type === 'TOPUP');
  
  // 2. เช็คว่าเป็นหมวดแอพหรือไม่?
  const appKeywords = ['Netflix', 'Youtube', 'Spotify', 'Viu', 'Disney', 'Prime', 'App', 'Canva', 'Office', 'Windows', 'Premium'];
  const isApp = appKeywords.some(keyword => categoryName.toLowerCase().includes(keyword.toLowerCase()));

  if (isTopup) {
    titlePrefix = "เติมเกมส์"; // 👈 เปลี่ยนเป็นคำนี้ ถ้าเป็น ROV หรือเกมเติมเงิน
  } else if (isApp) {
    titlePrefix = "แอพพรีเมียม";
  }

  return (
    <div className="min-h-screen bg-[#030305] text-white p-4 pt-10 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      <Head><title>{titlePrefix} {categoryName} | NEON STORE</title></Head>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#050505] to-[#020202]">
        <div className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[150px] opacity-60"></div>
        <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] opacity-60 delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto pb-20">
        <button 
          onClick={() => router.push('/')} 
          className="group flex items-center gap-2 text-gray-400 mb-8 hover:text-white transition-colors"
        >
          <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-all border border-white/5 group-hover:border-white/20">
             <ArrowLeft size={20} /> 
          </div>
          กลับหน้าแรก
        </button>

        {/* Title Section */}
        <h1 className="text-4xl md:text-6xl font-black mb-12 tracking-tighter drop-shadow-2xl">
          {titlePrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">{categoryName}</span>
        </h1>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id}>
              <div className="group relative bg-[#080808] border border-cyan-900/30 rounded-2xl overflow-hidden hover:border-cyan-400/80 transition-all duration-500 shadow-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:-translate-y-2 cursor-pointer">
                
                {/* Image */}
                <div className="h-52 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent z-10 opacity-80"></div>
                  <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  
                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <div className="absolute top-2 right-2 z-20">
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pulse">
                            -{product.discount}%
                        </span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-5 relative z-20">
                  <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-cyan-300 transition-colors uppercase tracking-wide">{product.name}</h3>
                  <p className="text-gray-400 text-xs mb-4 line-clamp-2 h-8 leading-relaxed font-medium">{product.description}</p>
                  
                  <div className="flex justify-between items-end pt-4 border-t border-dashed border-cyan-900/50 relative">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-cyan-500 font-bold mb-0.5 uppercase tracking-wider flex items-center gap-1"><Sparkles size={10}/> PRICE</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">฿{product.price}</span>
                        {product.discount > 0 && (
                            <span className="text-xs text-gray-600 line-through">
                                ฿{Math.round(product.price * (100 / (100 - product.discount)))}
                            </span>
                        )}
                      </div>
                    </div>
                    <span className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold group-hover:bg-cyan-400 group-hover:text-black transition-all shadow-lg">
                      BUY NOW
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {products.length === 0 && (
            <div className="col-span-full py-32 text-center text-gray-500 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <p className="text-xl font-medium">ยังไม่มีสินค้าในหมวดหมู่นี้</p>
              <button onClick={() => router.push('/')} className="mt-4 text-cyan-400 hover:underline">เลือกดูหมวดอื่น</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { name } = context.params;
  const prisma = (await import('@/lib/prisma')).default;

  // ดึงสินค้าจากหมวดหมู่ที่เลือก
  const products = await prisma.product.findMany({
    where: { category: name },
    orderBy: { createdAt: 'desc' }
  });

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categoryName: name
    }
  };
}