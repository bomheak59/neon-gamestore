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
  
  // 🔥 State สำหรับกรองหมวดหมู่ 🔥
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Categories Logic
  const appKeywords = ['Netflix', 'Youtube', 'Spotify', 'Viu', 'Disney', 'Prime', 'App', 'Canva', 'Office', 'Windows', 'Premium'];
  const safeProducts = products || [];
  
  // กรองสินค้าที่จะแสดง
  const displayedProducts = selectedCategory === 'All' 
    ? safeProducts 
    : safeProducts.filter(p => p.category === selectedCategory);

  const topupCategories = [...new Set(safeProducts.filter(p => p.type === 'TOPUP').map(p => p.category))];
  const appCategories = [...new Set(safeProducts.filter(p => appKeywords.some(keyword => p.category.toLowerCase().includes(keyword.toLowerCase()))).map(p => p.category))];
  const gameIdCategories = [...new Set(safeProducts.filter(p => p.type === 'ID_ACCOUNT' && !appKeywords.some(keyword => p.category.toLowerCase().includes(keyword.toLowerCase()))).map(p => p.category))];

  // Marquee Data
  const generateMarqueeData = () => {
    const users = ['Kittisak', 'User99x', 'GamerPro', 'Somchai', 'Alice', 'BobGamer', 'NongMay', 'ProPlayer', 'DevMan', 'lnwZa'];
    const items = ['ROV 115 Coupons', 'ID Valorant', 'Netflix 4K', 'Youtube Premium', 'Genshin Impact', 'Steam Wallet', 'Roblox', 'Free Fire'];
    const times = ['เมื่อสักครู่', '1 นาทีที่แล้ว', '3 นาทีที่แล้ว', '5 นาทีที่แล้ว', '12 นาทีที่แล้ว'];
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    return Array.from({ length: 15 }).map((_, i) => {
      const type = i % 2 === 0 ? 'promo' : 'sale';
      if (type === 'sale') {
        return { id: `sale-${Date.now()}-${i}`, type: 'sale', user: getRandom(users), product: getRandom(items), time: getRandom(times) };
      } else {
        return { id: `promo-${Date.now()}-${i}`, type: 'promo', text: '🔥 FLASH SALE! ลดสูงสุดถึง 70% ทุก ID เกมส์ ช้าหมดอดนะจ๊ะ!', icon: 'fire' };
      }
    });
  };
  useEffect(() => { setMarqueeItems(generateMarqueeData()); }, []);

  // Animation Variants
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-cyan-500/50 relative">
      <Head><title>NEON STORE | The Future of Gaming</title></Head>

      {/* 🔥🔥🔥 GAMING BACKGROUND SYSTEM (ใหม่) 🔥🔥🔥 */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* พื้นหลังดำ */}
        <div className="absolute inset-0 bg-[#020202]"></div>
        
        {/* Cyber Grid Animation */}
        <div className="cyber-grid opacity-30"></div>

        {/* Moving Aurora Lights */}
        <motion.div 
            animate={{ x: [-100, 100, -100], y: [-50, 50, -50], opacity: [0.3, 0.6, 0.3] }} 
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[150px]" 
        />
        <motion.div 
            animate={{ x: [100, -100, 100], y: [50, -50, 50], opacity: [0.3, 0.6, 0.3] }} 
            transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[150px]" 
        />
        
        {/* Scanlines Overlay */}
        <div className="scanlines opacity-10"></div>
        {/* Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-cyan-500/10 bg-[#050505]/90 backdrop-blur-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* Logo & Mobile Menu Button */}
          <div className="flex items-center gap-4">
             <button className="lg:hidden text-gray-300 hover:text-white p-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
             </button>

             <Link href="/">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="relative w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:rotate-12 transition-transform duration-300">
                      <Zap className="text-white w-5 h-5 lg:w-6 lg:h-6 fill-current relative z-10" />
                  </div>
                  <span className="font-extrabold text-xl lg:text-3xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-gray-400 group-hover:text-cyan-300 transition-colors">
                      NEON<span className="text-cyan-400">STORE</span>
                  </span>
                </div>
             </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-gray-400">
            <Link href="/"><button className="px-3 py-2 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-all">หน้าแรก</button></Link>
            
            <div className="relative group px-1">
              <button className="flex items-center gap-2 px-3 py-2 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-all"><Gamepad2 size={16}/> ซื้อรหัสเกม</button>
              <div className="absolute top-full left-0 w-56 bg-[#0a0a0a] border border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
                <div className="p-2 flex flex-col gap-1">{gameIdCategories.map((game) => (<Link key={game} href={`/category/${game}`}><div className="block px-3 py-2 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg text-xs font-medium cursor-pointer">{game}</div></Link>))}</div>
              </div>
            </div>
            
            <div className="relative group px-1">
              <button className="flex items-center gap-2 px-3 py-2 hover:text-purple-400 hover:bg-white/5 rounded-lg transition-all"><Monitor size={16}/> แอพพรีเมียม</button>
              <div className="absolute top-full left-0 w-56 bg-[#0a0a0a] border border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
                <div className="p-2 flex flex-col gap-1">{appCategories.map((app) => (<Link key={app} href={`/category/${app}`}><div className="block px-3 py-2 hover:bg-purple-500/10 hover:text-purple-400 rounded-lg text-xs font-medium cursor-pointer">{app}</div></Link>))}</div>
              </div>
            </div>

            <Link href="/topup"><button className="flex items-center gap-2 px-3 py-2 hover:text-green-400 hover:bg-white/5 rounded-lg transition-all"><CreditCard size={16}/> เติมเกม</button></Link>
            <Link href="/reviews"><button className="flex items-center gap-2 px-3 py-2 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-all"><MessageSquareQuote size={16} /> รีวิว</button></Link>
          </div>

          {/* พื้นที่ด้านขวา (ว่างไว้) */}
          <div className="hidden lg:flex items-center gap-3"></div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="lg:hidden bg-[#0a0a0a] border-b border-white/10 overflow-hidden shadow-2xl backdrop-blur-md"
                >
                    <div className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <Link href="/"><div className="p-3 rounded-xl bg-white/5 text-gray-200 font-bold flex items-center justify-center gap-2"><Zap size={16}/> หน้าแรก</div></Link>
                            <Link href="/topup"><div className="p-3 rounded-xl bg-green-500/10 text-green-400 font-bold flex items-center justify-center gap-2"><CreditCard size={16}/> เติมเกม</div></Link>
                        </div>
                        <div className="pt-2">
                             <p className="text-xs text-gray-500 font-bold uppercase mb-2 ml-1">หมวดหมู่แนะนำ</p>
                             <div className="flex flex-wrap gap-2">
                                {gameIdCategories.slice(0,4).map(g => <Link key={g} href={`/category/${g}`}><span className="px-3 py-1 bg-cyan-900/30 border border-cyan-500/30 rounded-full text-xs text-cyan-300">{g}</span></Link>)}
                                {appCategories.slice(0,4).map(a => <Link key={a} href={`/category/${a}`}><span className="px-3 py-1 bg-purple-900/30 border border-purple-500/30 rounded-full text-xs text-purple-300">{a}</span></Link>)}
                             </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </nav>

      {/* MARQUEE */}
      <div className="relative z-40 bg-black/60 border-y border-cyan-500/30 backdrop-blur-md h-12 flex items-center overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-extrabold px-6 h-full flex items-center z-10 absolute left-0 shadow-[0_0_25px_rgba(6,182,212,0.6)] clip-path-slant">
           <Bell size={16} className="mr-2 animate-swing"/> ประกาศ
        </div>
        <div className="w-full h-full overflow-hidden">
            <Marquee gradient={false} speed={50} className="text-sm font-bold h-full overflow-hidden py-2" style={{ overflowY: "hidden" }} onCycleComplete={() => setMarqueeItems(generateMarqueeData())}>
                <div className="flex items-center pl-40">
                    {marqueeItems.map((msg) => (
                        <div key={msg.id} className="flex items-center mx-12"> 
                            {msg.type === 'sale' ? (
                            <span className="flex items-center gap-2 text-cyan-200 whitespace-nowrap bg-cyan-950/30 border border-cyan-500/20 px-4 py-1.5 rounded-full"><Cpu size={14} className="text-cyan-400"/> <b className="text-cyan-400">{msg.user}</b> <span className="text-gray-400">ซื้อ</span> <span className="text-white">{msg.product}</span><span className="text-xs text-gray-500 ml-1">({msg.time})</span></span>
                            ) : (
                            <span className="flex items-center gap-2 text-yellow-100 whitespace-nowrap px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">{msg.icon === 'fire' && <span className="text-orange-400 text-lg">🔥</span>}{msg.text}</span>
                            )}
                        </div>
                    ))}
                </div>
            </Marquee>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="relative pt-32 pb-32 text-center px-4 z-10 overflow-hidden perspective-container">
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-[10px] sm:text-xs font-bold mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span></span> GAME SHOP NO.1 IN THAILAND
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-4 leading-tight drop-shadow-[0_0_30px_rgba(6,182,212,0.6)] text-white">
                <span className="block mb-2">WELCOME TO</span>
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse-slow">
                    <Typewriter options={{ strings: ['NEONSTORE', 'GAME ID SHOP', 'TOPUP SERVICE'], autoStart: true, loop: true, delay: 75, deleteSpeed: 50 }} />
                </div>
            </h1>
            
            <p className="mt-6 text-sm sm:text-lg text-gray-300 mb-10 leading-relaxed font-medium px-4 max-w-2xl mx-auto drop-shadow-md">
                ศูนย์รวมไอดีเกมและบริการเติมเกมที่ครบวงจรที่สุด <br className="hidden sm:block"/>
                <span className="text-cyan-400 font-bold">ปลอดภัย 100%</span> • <span className="text-purple-400 font-bold">ส่งสินค้าอัตโนมัติ</span> • <span className="text-green-400 font-bold">ดูแลตลอด 24 ชม.</span>
            </p>
          </motion.div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
             <StatBox icon={Users} label="ผู้ใช้งาน" value="50,000+" color="cyan" />
             <StatBox icon={CheckCircle} label="ความปลอดภัย" value="100%" color="green" />
             <StatBox icon={Trophy} label="อันดับยอดขาย" value="No. 1" color="yellow" />
             <StatBox icon={Activity} label="สถานะเซิร์ฟเวอร์" value="Online" color="purple" />
          </div>
        </div>
      </div>

      {/* CATEGORIES & FILTER */}
      {categories.length > 0 && (
          <div className="max-w-8xl mx-auto px-6 mb-12 relative z-10">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full shadow-[0_0_10px_cyan]"></div>
                <h2 className="text-2xl font-bold text-white tracking-wide">เลือกหมวดหมู่</h2>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide mask-fade-right">
                <button onClick={() => setSelectedCategory('All')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all whitespace-nowrap font-bold ${selectedCategory === 'All' ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105' : 'bg-[#0a0a0a] border-white/10 text-gray-400 hover:border-cyan-500/50'}`}>
                    <LayoutGrid size={18}/> ทั้งหมด
                </button>
                {categories.map((cat) => (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={`flex items-center gap-3 px-5 py-2 rounded-2xl border transition-all whitespace-nowrap group ${selectedCategory === cat.name ? 'bg-white/10 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-[#0a0a0a] border-white/10 text-gray-400 hover:border-white/30'}`}>
                        {cat.imageUrl && <img src={cat.imageUrl} className="w-6 h-6 rounded-lg object-cover group-hover:scale-110 transition-transform"/>}
                        <span className="font-bold">{cat.name}</span>
                    </button>
                ))}
            </div>
          </div>
      )}

      {/* PRODUCT GRID */}
      <main id="shop-section" className="max-w-8xl mx-auto px-6 pb-32 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-wider">
            <span className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full shadow-[0_0_15px_cyan]"></span> 
            {selectedCategory === 'All' ? 'สินค้าแนะนำ' : `รายการ: ${selectedCategory}`}
          </h2>
        </div>

        {displayedProducts.length === 0 ? (
             <div className="text-center py-32 text-gray-500 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                <p className="text-2xl font-bold mb-2">ยังไม่มีสินค้าในหมวดนี้</p>
                <p className="text-sm opacity-70">โปรดเลือกหมวดหมู่อื่น</p>
             </div>
        ) : (
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" initial="hidden" animate="visible" variants={containerVariants}>
            {displayedProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                    <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="h-full">
                        <div className="group h-full relative bg-[#0f0f0f] border border-white/10 rounded-[2rem] overflow-hidden hover:border-cyan-500/50 transition-all duration-500 shadow-2xl hover:shadow-[0_0_50px_rgba(6,182,212,0.15)]">
                            
                            <div className="h-64 overflow-hidden relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent z-10 opacity-90"></div>
                              <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              {product.discount > 0 && (<div className="absolute top-4 right-4 z-30"><span className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg rotate-3 group-hover:rotate-0 transition-transform">-{product.discount}%</span></div>)}
                              <div className="absolute top-4 left-4 z-20"><span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md border shadow-lg ${product.type === 'TOPUP' ? 'bg-green-950/80 border-green-500/50 text-green-400' : 'bg-purple-950/80 border-purple-500/50 text-purple-300'}`}><Cpu size={12}/> {product.type === 'TOPUP' ? 'AUTO' : 'ID'}</span></div>
                            </div>

                            <div className="p-6 relative z-20 flex flex-col h-auto">
                              <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-cyan-400 transition-colors">{product.name}</h3>
                              <p className="text-gray-500 text-xs mb-6 line-clamp-2 font-medium">{product.description}</p>
                              <div className="mt-auto flex justify-between items-end border-t border-dashed border-white/10 pt-4">
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-wider">Starting at</span>
                                  <div className="flex items-center gap-2"><span className="text-3xl font-black text-white">฿{product.price}</span>{product.discount > 0 && (<span className="text-xs text-gray-600 line-through font-bold">฿{Math.round(product.price * (100 / (100 - product.discount)))}</span>)}</div>
                                </div>
                                <Link href={`/product/${product.id}`}>
                                  <button className="bg-white text-black px-5 py-2.5 rounded-xl text-xs font-black transition-all hover:bg-cyan-400 hover:scale-105 active:scale-95 flex items-center gap-1 group/btn shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                    BUY <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform"/>
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

      <footer className="border-t border-cyan-900/30 bg-[#020202] py-16 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]"></div>
         <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">NEON<span className="text-cyan-500">STORE</span></h2>
         <p className="text-gray-500 text-xs">© 2025 All rights reserved.</p>
      </footer>
      
      {/* Styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .perspective-container { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .cyber-grid { position: absolute; width: 200%; height: 200%; top: -50%; left: -50%; background-image: linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px); background-size: 60px 60px; transform: rotateX(60deg); mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%); animation: gridMove 20s linear infinite; }
        .scanlines { background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1)); background-size: 100% 4px; position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 10; }
        @keyframes gridMove { 0% { transform: rotateX(60deg) translateY(0); } 100% { transform: rotateX(60deg) translateY(60px); } }
      `}</style>
    </div>
  );
}

// Components
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

function FeatureCard({ icon: Icon, title, desc, color }) {
    const colors = { 
        cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', 
        green: 'bg-green-500/10 text-green-400 border-green-500/30', 
        yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' 
    };
    return (
        <div className={`p-6 rounded-2xl border ${colors[color].split(' ')[2]} bg-[#0a0a0a] hover:-translate-y-1 transition-transform duration-300 shadow-lg`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors[color].split(' ')[0]} ${colors[color].split(' ')[1]}`}>
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
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