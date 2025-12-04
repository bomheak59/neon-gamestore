import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, ShoppingBag, Package, LogOut, Zap, Menu, X, Layers } from 'lucide-react'; // เพิ่ม Layers
import { useState } from 'react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // สถานะเปิด/ปิดเมนูมือถือ

  const handleLogout = async () => {
    if (!confirm("ต้องการออกจากระบบใช่หรือไม่?")) return;
    try {
      await fetch('/api/auth/logout'); 
      router.push('/admin/login');
    } catch (error) { console.error('Logout failed', error); }
  };

  const menuItems = [
    { name: 'ภาพรวม (Dashboard)', icon: LayoutDashboard, path: '/admin' },
    { name: 'รายการสั่งซื้อ (Orders)', icon: ShoppingBag, path: '/admin/orders' },
    { name: 'สินค้า (Products)', icon: Package, path: '/admin/products' },
    { name: 'หมวดหมู่ (Categories)', icon: Layers, path: '/admin/categories' }, // 🔥 เมนูใหม่ที่เพิ่มเข้ามา
    { name: 'ลงสินค้าใหม่', icon: Zap, path: '/admin/add' },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white flex font-sans relative">
      
      {/* 🔥 ปุ่มเมนูมือถือ (จะโชว์เฉพาะจอเล็ก md:hidden) 🔥 */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 bg-gray-800 p-2 rounded-lg text-white shadow-lg hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24}/> : <Menu size={24}/>}
      </button>

      {/* Sidebar (เมนูข้าง) */}
      <aside className={`
          w-64 border-r border-white/10 bg-[#050505] flex-col fixed h-full z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 /* ในจอใหญ่ให้โชว์ตลอด */
      `}>
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <span className="font-bold text-xl tracking-tighter">NEON<span className="text-cyan-400">ADMIN</span></span>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-2">
          {menuItems.map((item) => {
            const isActive = router.pathname === item.path;
            return (
              <Link key={item.path} href={item.path} onClick={() => setIsOpen(false)}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                  <item.icon size={20} />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl w-full transition-all duration-200 group">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform"/>
            <span className="font-medium text-sm">ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 bg-[#020202] min-h-screen">
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-4 md:px-8 bg-[#050505]/80 backdrop-blur sticky top-0 z-30">
          <h2 className="font-bold text-lg text-gray-200">ระบบจัดการหลังบ้าน</h2>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-black text-xs shadow-lg shadow-cyan-500/20">AD</div>
            <span className="text-sm text-gray-400 font-medium hidden sm:block">Admin User</span>
          </div>
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </main>

      {/* ฉากหลังมืดๆ เวลากดเมนูมือถือ */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
}