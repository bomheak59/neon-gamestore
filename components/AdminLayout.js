import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut, Zap } from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();

  const menuItems = [
    { name: 'ภาพรวม (Dashboard)', icon: LayoutDashboard, path: '/admin' },
    { name: 'รายการสั่งซื้อ (Orders)', icon: ShoppingBag, path: '/admin/orders' },
    { name: 'สินค้า (Products)', icon: Package, path: '/admin/products' },
    { name: 'ลงสินค้าใหม่', icon: Zap, path: '/admin/add' },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#050505] hidden md:flex flex-col">
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <span className="font-bold text-xl tracking-tighter">
            NEON<span className="text-cyan-400">ADMIN</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = router.pathname === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}>
                  <item.icon size={20} />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/">
            <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl w-full transition-all">
              <LogOut size={20} />
              <span className="font-medium text-sm">กลับหน้าร้านค้า</span>
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen">
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-[#050505]/50 backdrop-blur">
          <h2 className="font-bold text-lg text-gray-200">ระบบจัดการหลังบ้าน</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-black text-xs">
              AD
            </div>
            <span className="text-sm text-gray-400">Admin User</span>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}