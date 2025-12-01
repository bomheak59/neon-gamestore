import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, ShoppingBag, Package, LogOut, Zap } from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();

  // ฟังก์ชันออกจากระบบ
  const handleLogout = async () => {
    // ถามยืนยันก่อน (Optional)
    if (!confirm("ต้องการออกจากระบบใช่หรือไม่?")) return;

    try {
      await fetch('/api/auth/logout'); // เรียก API เพื่อล้าง Cookie
      router.push('/admin/login');     // ดีดกลับไปหน้า Login
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const menuItems = [
    { name: 'ภาพรวม (Dashboard)', icon: LayoutDashboard, path: '/admin' },
    { name: 'รายการสั่งซื้อ (Orders)', icon: ShoppingBag, path: '/admin/orders' },
    { name: 'สินค้า (Products)', icon: Package, path: '/admin/products' },
    { name: 'ลงสินค้าใหม่', icon: Zap, path: '/admin/add' },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white flex font-sans">
      {/* Sidebar (เมนูด้านซ้าย) */}
      <aside className="w-64 border-r border-white/10 bg-[#050505] hidden md:flex flex-col fixed h-full z-20">
        
        {/* Logo Admin */}
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <span className="font-bold text-xl tracking-tighter">
            NEON<span className="text-cyan-400">ADMIN</span>
          </span>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 mt-2">
          {menuItems.map((item) => {
            const isActive = router.pathname === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}>
                  <item.icon size={20} />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* 👇👇👇 ปุ่มออกจากระบบ (อยู่ด้านล่างสุด) 👇👇👇 */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl w-full transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform"/>
            <span className="font-medium text-sm">ออกจากระบบ</span>
          </button>
        </div>

      </aside>

      {/* Main Content (เนื้อหาด้านขวา) */}
      <main className="flex-1 md:ml-64 bg-[#020202]">
        {/* Header Bar */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-[#050505]/80 backdrop-blur sticky top-0 z-10">
          <h2 className="font-bold text-lg text-gray-200">ระบบจัดการหลังบ้าน</h2>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-black text-xs shadow-lg shadow-cyan-500/20">
              AD
            </div>
            <span className="text-sm text-gray-400 font-medium">Admin User</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}