import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { Edit, Trash2, Plus, Package } from 'lucide-react';
import { useRouter } from 'next/router';

export default function AdminProducts({ products }) {
  const router = useRouter();

  const handleDelete = async (id) => {
    if(!confirm('⚠️ ยืนยันการลบ? ข้อมูลจะหายไปถาวร!')) return;
    
    try {
      const res = await fetch('/api/product/delete', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ id })
      });
      
      if(res.ok) {
          alert('ลบสินค้าเรียบร้อย');
          router.replace(router.asPath); // รีเฟรชหน้า
      } else {
          alert('ลบไม่สำเร็จ');
      }
    } catch (e) { alert('Error'); }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">จัดการสินค้า</h1>
          <p className="text-gray-400 text-sm">สินค้าทั้งหมด {products.length} รายการ</p>
        </div>
        <Link href="/admin/add">
          <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-cyan-900/20 transition-all hover:-translate-y-1">
            <Plus size={20} /> เพิ่มสินค้าใหม่
          </button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-[#0a0a0a] border border-white/10 rounded-2xl border-dashed">
          <Package size={48} className="mx-auto text-gray-600 mb-4"/>
          <p className="text-gray-400">ยังไม่มีสินค้าในร้าน</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden group hover:border-cyan-500/30 transition-all">
              <div className="h-48 overflow-hidden relative">
                <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur px-2 py-1 text-xs font-bold rounded border border-white/20 text-white">
                  {p.category}
                </div>
                {/* แสดงส่วนลด */}
                {p.discount > 0 && <div className="absolute bottom-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">-{p.discount}%</div>}
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-white truncate text-lg mb-1">{p.name}</h3>
                <p className="text-gray-500 text-xs line-clamp-2 mb-4 h-8">{p.description}</p>
                
                <div className="flex justify-between items-center mb-4 pt-4 border-t border-white/5">
                  <span className="text-2xl font-bold text-cyan-400">฿{p.price}</span>
                  <span className="text-xs text-gray-500">ID: {p.id}</span>
                </div>

                <div className="flex gap-2">
                  {/* ปุ่มแก้ไข - ลิงก์ไปหน้า Edit */}
                  <Link href={`/admin/edit/${p.id}`} className="flex-1">
                    <button className="w-full bg-white/5 hover:bg-yellow-500/20 hover:text-yellow-400 py-2.5 rounded-lg text-xs font-bold text-gray-300 flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-yellow-500/50">
                        <Edit size={14} /> แก้ไข
                    </button>
                  </Link>
                  
                  {/* ปุ่มลบ */}
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="flex-1 bg-white/5 hover:bg-red-500/20 hover:text-red-400 py-2.5 rounded-lg text-xs font-bold text-gray-300 flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-red-500/50"
                  >
                    <Trash2 size={14} /> ลบ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  const prisma = (await import('@/lib/prisma')).default;
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  return { props: { products: JSON.parse(JSON.stringify(products)) } };
}