import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { Edit, Trash2, Plus, Package, Cpu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function AdminProducts({ products }) {
  const router = useRouter();
  const [localProducts, setLocalProducts] = useState(products);

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const handleDelete = async (id) => {
    if(!confirm('⚠️ ยืนยันการลบ? ข้อมูลจะหายไปถาวร!')) return;
    
    const originalProducts = [...localProducts];
    setLocalProducts(prev => prev.filter(p => p.id !== id));

    const loadingToast = toast.loading('กำลังลบ...');

    try {
      const res = await fetch('/api/product/delete', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ id })
      });
      
      if(res.ok) {
          toast.dismiss(loadingToast);
          toast.success('ลบเรียบร้อย!');
          router.replace(router.asPath, undefined, { scroll: false });
      } else {
          throw new Error('ลบไม่สำเร็จ');
      }
    } catch (e) { 
        setLocalProducts(originalProducts);
        toast.dismiss(loadingToast);
        toast.error('เกิดข้อผิดพลาด! กู้คืนข้อมูลแล้ว');
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">จัดการสินค้า</h1>
          <p className="text-gray-400 text-sm">สินค้าทั้งหมด {localProducts.length} รายการ</p>
        </div>
        <Link href="/admin/add">
          <button className="flex items-center gap-2 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-cyan-900/20 transition-all hover:-translate-y-1">
            <Plus size={20} /> เพิ่มสินค้าใหม่
          </button>
        </Link>
      </div>

      {localProducts.length === 0 ? (
        <div className="text-center py-20 bg-[#0a0a0a] border border-white/10 rounded-2xl border-dashed">
          <Package size={48} className="mx-auto text-gray-600 mb-4"/>
          <p className="text-gray-400">ยังไม่มีสินค้าในร้าน</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* 👇 ใช้ index มาช่วยนับลำดับ 👇 */}
          {localProducts.map((p, index) => (
            <div key={p.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden group hover:border-cyan-500/30 transition-all relative">
              <div className="h-48 overflow-hidden relative">
                <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur px-2 py-1 text-xs font-bold rounded border border-white/20 text-white">
                  {p.category}
                </div>
                <div className="absolute top-2 left-2 z-20">
                     <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 px-2 py-1 rounded-md backdrop-blur-md border shadow-lg ${p.type === 'TOPUP' ? 'bg-green-950/60 border-green-500/50 text-green-400' : 'bg-purple-950/60 border-purple-500/50 text-purple-300'}`}>
                       <Cpu size={12}/> {p.type === 'TOPUP' ? 'AUTO' : 'ID'}
                     </span>
                </div>
                {p.discount > 0 && <div className="absolute bottom-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">-{p.discount}%</div>}
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-white truncate text-lg mb-1">{p.name}</h3>
                <p className="text-gray-500 text-xs line-clamp-2 mb-4 h-8">{p.description}</p>
                
                <div className="flex justify-between items-center mb-4 pt-4 border-t border-white/5">
                  <span className="text-2xl font-bold text-cyan-400">฿{p.price}</span>
                  
                  {/* 👇 เปลี่ยนจาก ID เป็น ลำดับที่ (NO.) 👇 */}
                  <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">
                    NO. {index + 1}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/edit/${p.id}`} className="flex-1">
                    <button className="w-full bg-white/5 hover:bg-yellow-500/20 hover:text-yellow-400 py-2.5 rounded-lg text-xs font-bold text-gray-300 flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-yellow-500/50">
                        <Edit size={14} /> แก้ไข
                    </button>
                  </Link>
                  
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
  // เรียงตาม ID ล่าสุด หรือจะเปลี่ยนเป็น orderBy: { name: 'asc' } ก็ได้
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  return { props: { products: JSON.parse(JSON.stringify(products)) } };
}