import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Marquee from "react-fast-marquee";
import { Search, Zap, Gamepad2, ShieldCheck, ChevronRight, Plus, Monitor, CreditCard, MessageSquareQuote, Bell, Cpu, Sparkles, CheckCircle, Clock, Headphones, Menu, X } from 'lucide-react'; // เพิ่ม Menu, X
import SkeletonCard from '@/components/SkeletonCard';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import Tilt from 'react-parallax-tilt';

export default function Home({ products }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State เมนูมือถือ

  const appKeywords = ['Netflix', 'Youtube', 'Spotify', 'Viu', 'Disney', 'Prime', 'App', 'Canva', 'Office', 'Windows', 'Premium'];
  const safeProducts = products || [];
  
  const filteredProducts = safeProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topupCategories = [...new Set(safeProducts.filter(p => p.type === 'TOPUP').map(p => p.category))];
  const appCategories = [...new Set(safeProducts.filter(p => appKeywords.some(keyword => p.category.toLowerCase().includes(keyword.toLowerCase()))).map(p => p.category))];
  const gameIdCategories = [...new Set(safeProducts.filter(p => p.type === 'ID_ACCOUNT' && !appKeywords.some(keyword => p.category.toLowerCase().includes(keyword.toLowerCase()))).map(p => p.category))];

  const [marqueeItems, setMarqueeItems] = useState([]);
  
  const generateMarqueeData = () => {
    const users = ['Kittisak', 'User99x', 'GamerPro', 'Somchai', 'Alice', 'BobGamer', 'NongMay', 'ProPlayer', 'DevMan', 'lnwZa', 'MisterK', 'Somsri', 'Hunter', 'Solo', 'GodHand', 'Tony_Stark', 'Peter_P', 'BlackWidow'];
    const items = ['ROV 115 Coupons', 'ID Valorant', 'Netflix 4K', 'Youtube Premium', 'Genshin Impact', 'Steam Wallet', 'Minecraft', 'Spotify', 'Discord Nitro', 'Roblox', 'Free Fire', 'Apex Coins', 'Apple Music'];
    const times = ['เมื่อสักครู่', '1 นาทีที่แล้ว', '3 นาทีที่แล้ว', '5 นาทีที่แล้ว', '12 นาทีที่แล้ว', '30 นาทีที่แล้ว', '45 นาทีที่แล้ว', '1 ชม. ที่แล้ว'];
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return Array.from({ length: 20 }).map((_, i) => {
      const type = i % 2 === 0 ? 'promo' : 'sale';
      if (type === 'sale') {
        return { id: `sale-${Date.now()}-${i}`, type: 'sale', user: getRandom(users), product: getRandom(items), time: getRandom(times) };
      } else {
        return { id: `promo-${Date.now()}-${i}`, type: 'promo', text: '🔥 FLASH SALE! ลดสูงสุดถึง 70% ทุก ID เกมส์ ช้าหมดอดนะจ๊ะ!', icon: 'fire' };
      }
    });
  };
  useEffect(() => { setMarqueeItems(generateMarqueeData()); }, []);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };

  return (
    <div className="min-h-screen bg-[#030305] text-white overflow-x-hidden font-sans selection:bg-cyan-500/50 relative">
      <Head><title>NEON STORE | The Future of Gaming</title></Head>

      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#050505] to-[#020202]">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[150px]" />
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity, delay: 1 }} className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-cyan-500/10 bg-[#050505]/90 backdrop-blur-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* Logo & Mobile Toggle */}
          <div className="flex items-center gap-3">
             {/* ปุ่มเมนูมือถือ (โชว์เฉพาะจอเล็ก) */}
             <button 
                className="lg:hidden text-gray-300 hover:text-white p-1 active:scale-95 transition-transform"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
             </button>

             <Link href="/">
                <div className="flex items-center gap-2 group cursor-pointer">
                <div className="relative w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Zap className="text-white w-5 h-5 lg:w-6 lg:h-6 fill-current relative z-10" />
                </div>
                {/* 🔥 ปรับขนาด Font ให้เล็กลงในมือถือ (text-xl) และใหญ่ในคอม (text-3xl) 🔥 */}
                <span className="font-extrabold text-xl lg:text-3xl tracking-tighter text-white">
                    NEON<span className="text-cyan-400">STORE</span>
                </span>
                </div>
             </Link>
          </div>

          {/* Desktop Menu (ซ่อนบนมือถือ) */}
          <div className="hidden lg:flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-gray-400">
            <Link href="/"><button className="px-3 py-2 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-all">หน้าแรก</button></Link>
            
            {/* Dropdown 1 */}
            <div className="relative group px-1">
              <button className="flex items-center gap-2 px-3 py-2 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-all"><Gamepad2 size={16}/> ซื้อรหัสเกม</button>
              <div className="absolute top-full left-0 w-56 bg-[#0a0a0a] border border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
                <div className="p-2 flex flex-col gap-1">{gameIdCategories.map((game) => (<Link key={game} href={`/category/${game}`}><div className="block px-3 py-2 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg text-xs font-medium cursor-pointer">{game}</div></Link>))}</div>
              </div>
            </div>

            {/* Dropdown 2 */}
            <div className="relative group px-1">
              <button className="flex items-center gap-2 px-3 py-2 hover:text-purple-400 hover:bg-white/5 rounded-lg transition-all"><Monitor size={16}/> แอพพรีเมียม</button>
              <div className="absolute top-full left-0 w-56 bg-[#0a0a0a] border border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
                <div className="p-2 flex flex-col gap-1">{appCategories.map((app) => (<Link key={app} href={`/category/${app}`}><div className="block px-3 py-2 hover:bg-purple-500/10 hover:text-purple-400 rounded-lg text-xs font-medium cursor-pointer">{app}</div></Link>))}</div>
              </div>
            </div>

            <Link href="/topup"><button className="flex items-center gap-2 px-3 py-2 hover:text-green-400 hover:bg-white/5 rounded-lg transition-all"><CreditCard size={16}/> เติมเกม</button></Link>
            <Link href="/reviews"><button className="flex items-center gap-2 px-3 py-2 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-all"><MessageSquareQuote size={16} /> รีวิว</button></Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex relative group w-64">
             <input type="text" placeholder="ค้นหาสินค้า..." className="w-full bg-[#0a0a0a]/80 border border-cyan-900/50 rounded-full pl-10 pr-4 py-2.5 text-sm text-cyan-100 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
             <Search className="absolute left-3 top-2.5 w-4 h-4 text-cyan-600" />
          </div>
        </div>

        {/* 🔥🔥 Mobile Menu Dropdown (เมนูมือถือ) 🔥🔥 */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="lg:hidden bg-[#0a0a0a] border-b border-white/10 overflow-hidden shadow-2xl"
                >
                    <div className="p-4 space-y-3">
                        {/* ช่องค้นหาบนมือถือ */}
                        <div className="relative">
                            <input type="text" placeholder="ค้นหาสินค้า..." className="w-full bg-[#151515] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-cyan-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <Link href="/"><div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 font-bold flex items-center justify-center gap-2"><Zap size={16}/> หน้าแรก</div></Link>
                            <Link href="/topup"><div className="p-3 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 font-bold flex items-center justify-center gap-2"><CreditCard size={16}/> เติมเกม</div></Link>
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

      {/* ... (Marquee & Hero Section เหมือนเดิม) ... */}
      <div className="relative z-40 bg-black/40 border-y border-cyan-500/30 backdrop-blur-md h-12 flex items-center overflow-hidden">
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
      <div className="relative pt-32 pb-48 text-center px-4 z-10 overflow-hidden perspective-container">
        <div className="absolute inset-0 -z-20 transform-style-3d overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="cyber-grid animate-gridMove opacity-30"></div>
          <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[120px] opacity-50"></div>
          <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] opacity-50"></div>
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none">
            <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-1/4 left-[10%]"><Gamepad2 size={50} className="text-cyan-500/30 drop-shadow-lg"/></motion.div>
            <motion.div animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-1/3 right-[12%]"><ShieldCheck size={45} className="text-purple-500/30 drop-shadow-lg"/></motion.div>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-1/3 right-[20%]"><Zap size={40} className="text-yellow-500/30 drop-shadow-lg"/></motion.div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span></span> GAME SHOP NO.1 IN THAILAND
          </div>
          <div className="mb-6"><div className="inline-block bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce-slow transform -rotate-2 border border-white/10">⚡ DISCOUNT UP TO 70% TODAY</div></div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-6 leading-none drop-shadow-2xl">
            <span className="block text-white mb-2 text-shadow-sm">ยินดีต้อนรับสู่</span>
            <div className="min-h-[1.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                <Typewriter options={{ strings: ['NEONSTORE', 'GAME ID SHOP', 'TOPUP SERVICE'], autoStart: true, loop: true, delay: 75, deleteSpeed: 50 }} />
            </div>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed font-medium">บริการขายรหัสเกมส์ แอพพรีเมี่ยม เติมเกมส์ครบวงจร <br className="hidden sm:block"/><span className="text-cyan-400">ปลอดภัย</span> • <span className="text-purple-400">รวดเร็ว</span> • <span className="text-green-400">บริการหลังการขายตลอด 24 ชั่วโมง</span></p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mx-auto">
             <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 p-6 rounded-2xl backdrop-blur-sm transition-all group"><div className="bg-cyan-500/20 p-4 rounded-full mb-3"><CheckCircle size={28} className="text-cyan-400"/></div><span className="text-base font-bold text-white">ผู้ขายยืนยันตัวตน</span><span className="text-xs text-gray-500 mt-1">Verified Seller</span></motion.div>
             <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 hover:border-yellow-500/50 p-6 rounded-2xl backdrop-blur-sm transition-all group"><div className="bg-yellow-500/20 p-4 rounded-full mb-3"><Clock size={28} className="text-yellow-400"/></div><span className="text-base font-bold text-white">ส่งสินค้าอัตโนมัติ</span><span className="text-xs text-gray-500 mt-1">Auto Delivery 24/7</span></motion.div>
             <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 hover:border-green-500/50 p-6 rounded-2xl backdrop-blur-sm transition-all group"><div className="bg-green-500/20 p-4 rounded-full mb-3"><Headphones size={28} className="text-green-400"/></div><span className="text-base font-bold text-white">บริการหลังการขายตลอด 24 ชั่วโมง</span><span className="text-xs text-gray-500 mt-1">Support Team</span></motion.div>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <main id="shop-section" className="max-w-8xl mx-auto px-6 pb-32 relative z-10">
        <div className="flex items-end justify-between mb-12 border-b-2 border-cyan-500/20 pb-6">
          <h2 className="text-4xl font-extrabold text-white flex items-center gap-4 uppercase tracking-wider">
            <span className="w-3 h-10 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-sm"></span> 
            {searchTerm ? `ผลการค้นหา: "${searchTerm}"` : 'สินค้าแนะนำ'}
          </h2>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
          {!products ? (
            [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
          ) : (
            filteredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                  <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="h-full">
                      <div className="group h-full relative bg-[#080808] border border-cyan-900/30 rounded-2xl overflow-hidden hover:border-cyan-400/80 transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]">
                        <div className="h-52 overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent z-10 opacity-80"></div>
                          <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          {product.discount > 0 && (<div className="absolute top-2 right-2 z-30"><span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg animate-pulse">-{product.discount}%</span></div>)}
                          <div className="absolute top-2 left-2 z-20"><span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 px-3 py-1 rounded-md backdrop-blur-md border shadow-lg ${product.type === 'TOPUP' ? 'bg-green-950/60 border-green-500/50 text-green-400' : 'bg-purple-950/60 border-purple-500/50 text-purple-300'}`}><Cpu size={12}/> {product.type === 'TOPUP' ? 'AUTO' : 'ID'}</span></div>
                        </div>
                        <div className="p-5 relative z-20 flex flex-col h-auto">
                          <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-cyan-300 transition-colors uppercase tracking-wide">{product.name}</h3>
                          <p className="text-gray-400 text-xs mb-4 line-clamp-2 h-8 leading-relaxed font-medium">{product.description}</p>
                          <div className="mt-auto flex justify-between items-end pt-4 border-t border-dashed border-cyan-900/50 relative">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-cyan-500 font-bold mb-0.5 uppercase tracking-wider flex items-center gap-1"><Sparkles size={10}/> PRICE</span>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">฿{product.price}</span>
                                {product.discount > 0 && (<span className="text-xs text-gray-600 line-through">฿{Math.round(product.price * (100 / (100 - product.discount)))}</span>)}
                              </div>
                            </div>
                            <Link href={`/product/${product.id}`}>
                              <button className="relative overflow-hidden bg-white text-black px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg hover:bg-cyan-400 hover:text-black active:scale-95 flex items-center gap-1 group/btn"><span className="relative z-10 flex items-center gap-1">BUY NOW <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform"/></span></button>
                            </Link>
                          </div>
                        </div>
                      </div>
                  </Tilt>
              </motion.div>
            ))
          )}
        </motion.div>
      </main>

      <footer className="border-t border-cyan-900/30 bg-[#020202] py-16 text-center"><h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 mb-4">NEONSTORE SYSTEMS</h2><p className="text-gray-500 text-xs">© 2025 All rights reserved.</p></footer>
      <style jsx>{`
        .perspective-container { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .cyber-grid { position: absolute; width: 200%; height: 200%; top: -50%; left: -50%; background-image: linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px); background-size: 40px 40px; transform: rotateX(60deg); mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%); }
        .animate-gridMove { animation: gridMove 1s linear infinite; }
        @keyframes gridMove { 0% { transform: rotateX(60deg) translateY(0); } 100% { transform: rotateX(60deg) translateY(40px); } }
      `}</style>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const prisma = (await import('@/lib/prisma')).default;
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    return { props: { products: JSON.parse(JSON.stringify(products)) } };
  } catch (e) { return { props: { products: [] } }; }
}