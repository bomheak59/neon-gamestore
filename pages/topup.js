import Head from 'next/head';
import Link from 'next/link';
import { ShoppingCart, Search, Zap, Gamepad2, ChevronRight, Monitor, CreditCard, MessageSquareQuote, Plus, Cpu, Sparkles, ArrowLeft } from 'lucide-react';
import SkeletonCard from '@/components/SkeletonCard';

export default function TopupPage({ products }) {
  return (
    <div className="min-h-screen bg-[#030305] text-white font-sans selection:bg-cyan-500/50 relative">
      <Head><title>บริการเติมเกม | NEON STORE</title></Head>

      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-green-900/20 via-[#050505] to-[#020202]"></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-cyan-500/10 bg-[#050505]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
               <div className="w-10 h-10 bg-linear-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="text-white w-6 h-6 fill-current" />
              </div>
              <span className="font-extrabold text-2xl tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-white via-cyan-100 to-gray-400">
                NEON<span className="text-cyan-400">STORE</span>
              </span>
            </div>
          </Link>
          
          {/* เมนูกลาง */}
          <div className="hidden xl:flex items-center gap-2 text-sm font-bold text-gray-400">
             <Link href="/" className="px-4 py-3 hover:text-white">หน้าแรก</Link>
             <div className="px-4 py-3 text-green-400 bg-green-500/10 rounded-lg border border-green-500/20">บริการเติมเกม</div>
          </div>

           <div className="flex items-center gap-5">
            <button className="p-3 bg-[#0a0a0a]/80 rounded-full border border-cyan-900/50 relative">
              <ShoppingCart className="w-6 h-6 text-gray-400" />
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center text-white">0</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-green-500/20 pb-6 gap-4">
          <div>
             <Link href="/">
                <button className="flex items-center gap-2 text-gray-500 hover:text-white mb-4 transition-colors">
                    <ArrowLeft size={20}/> กลับหน้าหลัก
                </button>
             </Link>
             <h1 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4 uppercase tracking-wider">
                <span className="w-3 h-12 bg-linear-to-b from-green-400 to-emerald-600 rounded-sm shadow-[0_0_15px_rgba(34,197,94,0.5)]"></span> 
                บริการเติมเกม
             </h1>
             <p className="text-gray-400 mt-2">เลือกเกมที่คุณต้องการเติม สะดวก รวดเร็ว เข้าทันที</p>
          </div>
        </div>

        {/* Grid สินค้า */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {!products ? (
            [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
          ) : (
            products.map((product) => (
              <div key={product.id} className="group relative bg-[#080808] border border-green-900/30 rounded-2xl overflow-hidden hover:border-green-400/80 transition-all duration-500 shadow-xl hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:-translate-y-2">
                
                <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-linear-to-t from-[#080808] via-transparent to-transparent z-10 opacity-80"></div>
                  <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 right-3 z-20">
                    <span className="px-3 py-1 rounded-md bg-green-950/80 backdrop-blur-md border border-green-500/50 text-[10px] font-bold uppercase text-green-300 shadow-lg">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 relative z-20">
                  <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-green-300 transition-colors">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10">{product.description}</p>

                  <div className="flex justify-between items-end pt-4 border-t border-dashed border-green-900/50">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-green-500 font-bold mb-0.5 uppercase tracking-wider">ราคาเริ่มต้น</span>
                      <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-400">฿{product.price}</span>
                    </div>
                    <Link href={`/product/${product.id}`}>
                      <button className="relative overflow-hidden bg-white text-black px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-lg hover:bg-green-400 hover:text-black active:scale-95 flex items-center gap-1 group/btn">
                        <span className="relative z-10 flex items-center gap-1">เลือกเติม <ChevronRight size={16}/></span>
                      </button>
                    </Link>
                  </div>
                </div>

              </div>
            ))
          )}
          
          {products && products.length === 0 && (
             <div className="col-span-full text-center py-20 text-gray-500">
                <p>ยังไม่มีเกมเปิดให้บริการในขณะนี้</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ดึงเฉพาะสินค้าที่เป็น TOPUP
export async function getServerSideProps() {
  try {
    const prisma = (await import('@/lib/prisma')).default;
    const products = await prisma.product.findMany({ 
        where: { type: 'TOPUP' },
        orderBy: { createdAt: 'desc' } 
    });
    return { props: { products: JSON.parse(JSON.stringify(products)) } };
  } catch (e) {
    return { props: { products: [] } };
  }
}