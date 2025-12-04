import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Marquee from "react-fast-marquee";
import { Zap, Gamepad2, ShieldCheck, ChevronRight, Plus, Monitor, CreditCard, MessageSquareQuote, Bell, Cpu, Sparkles, CheckCircle, Clock, Headphones, Menu, X, Users, Trophy, Star, Activity, LayoutGrid, Flame } from 'lucide-react';
import SkeletonCard from '@/components/SkeletonCard';
import { useState, useEffect } from 'react';

// Library Animation
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import Tilt from 'react-parallax-tilt';

export default function Home({ products, categories }) {
  const router = useRouter();
  
  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [marqueeItems, setMarqueeItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Logic
  const safeProducts = products || [];
  
  const displayedProducts = selectedCategory === 'All' 
    ? safeProducts 
    : safeProducts.filter(p => p.category === selectedCategory);

  const topupCategories = [...new Set(safeProducts.filter(p => p.type === 'TOPUP').map(p => p.category))];
  const appCategories = [...new Set(safeProducts.filter(p => p.type !== 'TOPUP' && p.type !== 'ID_ACCOUNT').map(p => p.category))];
  const gameIdCategories = [...new Set(safeProducts.filter(p => p.type === 'ID_ACCOUNT').map(p => p.category))];

  useEffect(() => {
    const users = ['Kittisak', 'User99x', 'GamerPro', 'Somchai', 'Alice', 'BobGamer', 'NongMay', 'ProPlayer', 'DevMan', 'lnwZa'];
    const items = ['ROV 115 Coupons', 'ID Valorant', 'Netflix 4K', 'Youtube Premium', 'Genshin Impact', 'Steam Wallet', 'Roblox', 'Free Fire'];
    const times = ['เมื่อสักครู่', '1 นาทีที่แล้ว', '3 นาทีที่แล้ว', '5 นาทีที่แล้ว', '12 นาทีที่แล้ว'];
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    const data = Array.from({ length: 15 }).map((_, i) => {
      const type = i % 2 === 0 ? 'promo' : 'sale';
      if (type === 'sale') {
        return { id: `sale-${Date.now()}-${i}`, type: 'sale', user: getRandom(users), product: getRandom(items), time: getRandom(times) };
      } else {
        return { id: `promo-${Date.now()}-${i}`, type: 'promo', text: '🔥 FLASH SALE! ลดสูงสุดถึง 70% ทุก ID เกมส์ ช้าหมดอดนะจ๊ะ!', icon: 'fire' };
      }
    });
    setMarqueeItems(data);
  }, []);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } } };

  return (
    // 🔥 แก้ไขตรงนี้: เอา bg-[#050505] ออก เพื่อให้มองเห็นพื้นหลังข้างหลัง 🔥
    <div className="min-h-screen text-white overflow-x-hidden font-sans selection:bg-cyan-500/30 relative">
      <Head><title>NEON STORE | Ultimate Gaming Hub</title></Head>

      {/* 🔥🔥🔥 BACKGROUND SYSTEM (พื้นหลัง) 🔥🔥🔥 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* พื้นหลังดำ (รองพื้น) */}
        <div className="absolute inset-0 bg-[#020202]"></div>
        
        {/* Cyber Grid (ตารางขยับได้) */}
        <div className="cyber-grid opacity-30"></div>
        
        {/* แสง Aurora วิ่งไปมา (ปรับให้ชัดขึ้น) */}
        <motion.div 
            animate={{ x: [-100, 100, -100], y: [-50, 50, -50], opacity: [0.4, 0.7, 0.4] }} 
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[150px]" 
        />
        <motion.div 
            animate={{ x: [100, -100, 100], y: [50, -50, 50], opacity: [0.4, 0.7, 0.4] }} 
            transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[150px]" 
        />
        
        {/* Scanlines (เส้นทีวี) */}
        <div className="scanlines opacity-10"></div>
        {/* Noise (จุดรบกวนภาพ) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]"></div>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/70 backdrop-blur-xl transition-all duration-300 shadow-lg shadow-cyan-900/10">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button className="lg:hidden text-gray-300 hover:text-white p-1 active:scale-90 transition-transform" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
             </button>
             <Link href="/">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:rotate-12 transition-transform duration-300">
                      <Zap className="text-white w-6 h-6 fill-current relative z-10" />
                  </div>
                  <span className="font-black text-2xl tracking-tighter text-white group-hover:text-cyan-400 transition-colors">
                      NEON<span className="text-cyan-500">STORE</span>
                  </span>
                </div>
             </Link>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-gray-400">
            <Link href="/"><button className="px-4 py-2 hover:text-white hover:bg-white/5 rounded-lg transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">หน้าแรก</button></Link>
            <Link href="/topup"><button className="flex items-center gap-2 px-4 py-2 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all border border-transparent hover:border-green-500/30"><CreditCard size={16}/> เติมเกม</button></Link>
            <Link href="/reviews"><button className="flex items-center gap-2 px-4 py-2 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-all border border-transparent hover:border-yellow-500/30"><MessageSquareQuote size={16} /> รีวิว</button></Link>
          </div>

          <div className="hidden lg:flex items-center gap-3">
             <button className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-lg text-xs font-bold transition-all backdrop-blur-md">LOGIN</button>
             <button className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all transform hover:-translate-y-0.5">REGISTER</button>
          </div>
        </div>

        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="lg:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                >
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/"><div className="p-4 rounded-2xl bg-white/5 text-white font-bold flex flex-col items-center justify-center gap-2 border border-white/5 hover:border-cyan-500/50 transition-all"><Zap size={24} className="text-cyan-400"/> หน้าแรก</div></Link>
                            <Link href="/topup"><div className="p-4 rounded-2xl bg-green-500/10 text-green-400 font-bold flex flex-col items-center justify-center gap-2 border border-green-500/20 hover:border-green-500/50 transition-all"><CreditCard size={24}/> เติมเกม</div></Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </nav>

      {/* MARQUEE */}
      <div className="relative z-40 bg-black/40 border-y border-white/5 backdrop-blur-md h-12 flex items-center overflow-hidden">
        <div className="bg-cyan-600 text-black text-xs font-black px-6 h-full flex items-center z-10 absolute left-0 shadow-[0_0_30px_rgba(6,182,212,0.6)] skew-x-12 -ml-4 pl-8 border-r-2 border-white">
           <div className="-skew-x-12 flex items-center"><Bell size={16} className="mr-2 animate-swing"/> LIVE FEED</div>
        </div>
        <div className="w-full h-full overflow-hidden">
            <Marquee gradient={false} speed={40} className="text-xs font-bold h-full overflow-hidden" style={{ overflowY: "hidden" }}>
                <div className="flex items-center pl-32">
                    {marqueeItems.map((msg) => (
                        <div key={msg.id} className="flex items-center mx-8"> 
                            {msg.type === 'sale' ? (
                            <span className="flex items-center gap-2 text-gray-400 font-mono"><Cpu size={12} className="text-cyan-400"/> <b className="text-cyan-300">{msg.user}</b> purchased <span className="text-white border-b border-cyan-500/50">{msg.product}</span><span className="text-[10px] text-gray-600">({msg.time})</span></span>
                            ) : (
                            <span className="flex items-center gap-2 text-yellow-400 font-black tracking-wide"><Flame size={14} className="fill-current"/> {msg.text}</span>
                            )}
                        </div>
                    ))}
                </div>
            </Marquee>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="relative pt-32 pb-40 text-center px-4 z-10 overflow-hidden perspective-container">
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 text-xs font-bold mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-shadow cursor-default">
                <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span></span> 
                GAME SHOP NO.1 IN THAILAND
            </div>
            
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter mb-6 leading-[0.9] text-white drop-shadow-2xl">
                LEVEL UP <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse-slow">YOUR GAME</span>
            </h1>
            
            <div className="h-8 mb-8">
                <div className="text-xl sm:text-2xl font-bold text-gray-400 font-mono">
                    <Typewriter options={{ strings: ['AUTO DELIVERY SYSTEM', 'SECURE PAYMENT', '24/7 SUPPORT'], autoStart: true, loop: true, delay: 50, deleteSpeed: 30 }} />
                </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-16 p-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl">
             <StatBox icon={Users} label="USERS" value="50K+" color="cyan" />
             <StatBox icon={CheckCircle} label="SECURE" value="100%" color="green" />
             <StatBox icon={Trophy} label="RANK" value="#1" color="yellow" />
             <StatBox icon={Activity} label="SERVER" value="ONLINE" color="purple" />
          </motion.div>
        </div>
      </div>

      {/* CATEGORIES & FILTER */}
      {categories && categories.length > 0 && (
          <div className="max-w-8xl mx-auto px-6 mb-12 relative z-10">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-10 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full shadow-[0_0_15px_cyan]"></div>
                <h2 className="text-3xl font-black text-white tracking-tight">BROWSE <span className="text-gray-500">CATEGORIES</span></h2>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide mask-fade-right">
                <button onClick={() => setSelectedCategory('All')} className={`flex items-center gap-2 px-8 py-4 rounded-2xl border transition-all whitespace-nowrap font-bold text-sm uppercase tracking-wider ${selectedCategory === 'All' ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] transform scale-105' : 'bg-[#0f0f0f] border-white/10 text-gray-400 hover:bg-white/5 hover:border-white/30'}`}>
                    <LayoutGrid size={20}/> ALL ITEMS
                </button>
                {categories.map((cat) => (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all whitespace-nowrap group ${selectedCategory === cat.name ? 'bg-white/10 border-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'bg-[#0f0f0f] border-white/10 text-gray-400 hover:bg-white/5 hover:border-white/30'}`}>
                        {cat.imageUrl && <img src={cat.imageUrl} className="w-8 h-8 rounded-lg object-cover group-hover:scale-110 transition-transform shadow-lg"/>}
                        <span className="font-bold text-sm uppercase">{cat.name}</span>
                    </button>
                ))}
            </div>
          </div>
      )}

      {/* PRODUCT GRID */}
      <main id="shop-section" className="max-w-8xl mx-auto px-6 pb-40 relative z-10">
        {displayedProducts.length === 0 ? (
             <div className="text-center py-32 text-gray-500 bg-[#0a0a0a] rounded-3xl border border-white/5 border-dashed">
                <div className="inline-block p-6 rounded-full bg-white/5 mb-4"><Star size={48} className="opacity-20"/></div>
                <p className="text-2xl font-bold mb-2 text-gray-300">NO ITEMS FOUND</p>
                <p className="text-sm opacity-50">Please try selecting a different category</p>
             </div>
        ) : (
            <motion.div 
                key={selectedCategory}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                initial="hidden" animate="visible" variants={containerVariants}
            >
            {displayedProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                    <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="h-full">
                        <div className="group h-full relative bg-[#0f0f0f] border border-white/5 rounded-[2rem] overflow-hidden hover:border-cyan-500/50 transition-all duration-500 shadow-2xl hover:shadow-[0_0_50px_rgba(6,182,212,0.2)] flex flex-col">
                            
                            {/* Image */}
                            <div className="h-64 overflow-hidden relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent z-10 opacity-90"></div>
                              <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              {product.discount > 0 && (
                                <div className="absolute top-4 right-4 z-30">
                                    <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg border border-red-400/50 rotate-3 group-hover:rotate-0 transition-transform">-{product.discount}%</span>
                                </div>
                              )}
                              <div className="absolute top-4 left-4 z-20">
                                 <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md border shadow-lg ${product.type === 'TOPUP' ? 'bg-green-950/80 border-green-500/50 text-green-400' : 'bg-purple-950/80 border-purple-500/50 text-purple-300'}`}>
                                   {product.type === 'TOPUP' ? <Zap size={12}/> : <Cpu size={12}/>} {product.type === 'TOPUP' ? 'AUTO' : 'INSTANT'}
                                 </span>
                              </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 relative z-20 flex flex-col flex-1">
                              <h3 className="text-2xl font-black text-white mb-2 truncate group-hover:text-cyan-400 transition-colors tracking-tight">{product.name}</h3>
                              <p className="text-gray-500 text-xs mb-6 line-clamp-2 font-medium leading-relaxed">{product.description}</p>
                              
                              <div className="mt-auto pt-5 border-t border-white/5 flex justify-between items-center">
                                <div className="flex flex-col">
                                  <span className="text-[9px] text-gray-500 font-bold mb-0.5 uppercase tracking-widest">STARTING AT</span>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-white group-hover:text-cyan-300 transition-colors">฿{product.price}</span>
                                    {product.discount > 0 && (<span className="text-xs text-gray-600 line-through font-bold">฿{Math.round(product.price * (100 / (100 - product.discount)))}</span>)}
                                  </div>
                                </div>
                                <Link href={`/product/${product.id}`}>
                                  <button className="bg-white text-black w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:bg-cyan-400 hover:scale-110 active:scale-90 shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_20px_cyan]">
                                    <ChevronRight size={24} strokeWidth={3}/>
                                  </button>
                                </Link>
                              </div>
                            </div>

                        </div>
                    </Tilt>
                </motion.div>
            ))}
            </motion.div>
        )}
      </main>

      <footer className="border-t border-white/5 bg-[#010101] py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]"></div>
        <h2 className="text-4xl font-black text-white mb-6 tracking-tighter">NEON<span className="text-cyan-500">STORE</span></h2>
        <p className="text-gray-600 text-sm font-mono">© 2025 Neon Store System. All rights reserved.</p>
      </footer>
      
      {/* CSS Styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .perspective-container { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        
        /* Cyber Grid Animation */
        .cyber-grid { 
            position: absolute; width: 200%; height: 200%; top: -50%; left: -50%; 
            background-image: linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px), 
                              linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px); 
            background-size: 60px 60px; 
            transform: rotateX(60deg); 
            mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%); 
            animation: gridMove 20s linear infinite; 
        }
        
        .scanlines { 
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1)); 
            background-size: 100% 4px; 
            position: absolute; top: 0; left: 0; right: 0; bottom: 0; 
            pointer-events: none; z-index: 10; 
        }
        
        .animate-gridMove { animation: gridMove 1s linear infinite; }
        @keyframes gridMove { 0% { transform: rotateX(60deg) translateY(0); } 100% { transform: rotateX(60deg) translateY(60px); } }
      `}</style>
    </div>
  );
}

// Sub Components
function StatBox({ icon: Icon, label, value, color }) {
    const colors = { cyan: 'text-cyan-400', green: 'text-green-400', yellow: 'text-yellow-400', purple: 'text-purple-400' };
    return (
        <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl flex flex-col items-center justify-center hover:border-white/10 transition-all hover:-translate-y-2 duration-300 shadow-lg group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className={`p-3 rounded-2xl bg-white/5 mb-3 group-hover:bg-white/10 transition-colors ${colors[color]} bg-opacity-10`}>
                 <Icon size={28} />
            </div>
            <div className="text-3xl font-black text-white mb-1 drop-shadow-md">{value}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">{label}</div>
        </div>
    );
}

export async function getServerSideProps() {
  try {
    const prisma = (await import('@/lib/prisma')).default;
    const products = await prisma.product.findMany({ 
        where: { isRecommended: true }, 
        orderBy: { createdAt: 'desc' } 
    });
    const categories = await prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
    return { props: { products: JSON.parse(JSON.stringify(products)), categories: JSON.parse(JSON.stringify(categories)) } };
  } catch (e) { return { props: { products: [], categories: [] } }; }
}