import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function AdminEditProduct() {
  const router = useRouter();
  const { id } = router.query; // รับ ID สินค้าจาก URL
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [form, setForm] = useState({
    name: '', price: '', discount: '', category: '', 
    description: '', imageUrl: '', type: 'ID_ACCOUNT', stockContent: '' 
  });

  // ดึงข้อมูลสินค้าเดิมมาแสดง
  useEffect(() => {
    if (!id) return;
    fetch(`/api/product/get?id=${id}`) // (เดี๋ยวเราสร้าง API get นี้แถมให้ด้านล่าง หรือใช้ getServerSideProps ก็ได้ แต่แบบนี้ง่ายกว่าสำหรับมือใหม่)
      .then(res => res.json())
      .then(data => {
        setForm({
            ...data,
            // แปลงค่าให้เป็น String เพื่อใส่ใน Input
            price: data.price.toString(),
            discount: data.discount.toString()
        });
        setIsFetching(false);
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/product/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id })
      });
      if (!res.ok) throw new Error('Failed');
      alert('✅ แก้ไขสินค้าเรียบร้อย!');
      router.push('/admin/products'); 
    } catch (error) {
      alert('แก้ไขไม่สำเร็จ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // แอบสร้าง API get ตรงนี้ชั่วคราวเพื่อให้โค้ดสั้น (จริงๆ ควรแยกไฟล์)
  // แต่เพื่อความง่าย ผมแนะนำให้ใช้วิธีนี้ดึงข้อมูลใน useEffect ด้านบน โดยเราต้องมี API ดึงข้อมูล
  // ดังนั้น *ข้าม* ไปดูวิธีสร้าง api/product/get.js ด้านล่างสุดด้วยนะครับ

  if (isFetching) return <div className="text-white text-center mt-20">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 flex justify-center font-sans">
      <div className="max-w-3xl w-full bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative">
        
        <Link href="/admin/products">
          <button className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </button>
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center gap-3">
          <div className="bg-yellow-500/20 p-2 rounded-lg border border-yellow-500/30"><Save className="text-yellow-400" /></div>
          แก้ไขสินค้า
        </h1>

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* ชื่อสินค้า */}
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">ชื่อสินค้า</label>
            <input required type="text" value={form.name} className="w-full bg-[#111] border border-gray-700 p-4 rounded-xl focus:border-yellow-500 outline-none transition-all text-white" 
              onChange={e => setForm({...form, name: e.target.value})} />
          </div>

          {/* หมวดหมู่ & ราคา & ส่วนลด */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-medium">หมวดหมู่</label>
              <input required type="text" value={form.category} className="w-full bg-[#111] border border-gray-700 p-4 rounded-xl focus:border-yellow-500 outline-none transition-all text-white" 
                onChange={e => setForm({...form, category: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-medium">ราคา (บาท)</label>
              <input required type="number" value={form.price} style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }} className="appearance-none w-full bg-[#111] border border-gray-700 p-4 rounded-xl focus:border-yellow-500 outline-none transition-all font-mono text-yellow-400 font-bold text-lg" 
                onChange={e => setForm({...form, price: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-medium text-red-400">ส่วนลด (%)</label>
              <input type="number" value={form.discount} style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }} className="appearance-none w-full bg-[#111] border border-red-900/50 p-4 rounded-xl focus:border-red-500 outline-none transition-all font-mono text-red-400 font-bold text-lg" 
                onChange={e => setForm({...form, discount: e.target.value})} />
            </div>
          </div>

          {/* ประเภท */}
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">ประเภทสินค้า</label>
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setForm({...form, type: 'ID_ACCOUNT'})} className={`p-4 rounded-xl border transition-all text-sm font-bold flex flex-col items-center gap-2 ${form.type === 'ID_ACCOUNT' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-[#111] border-gray-700 text-gray-500'}`}>👤 ขายไอดี / แอพ</button>
              <button type="button" onClick={() => setForm({...form, type: 'TOPUP'})} className={`p-4 rounded-xl border transition-all text-sm font-bold flex flex-col items-center gap-2 ${form.type === 'TOPUP' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-[#111] border-gray-700 text-gray-500'}`}>🎮 บริการเติมเกม</button>
            </div>
          </div>

          {/* รูปภาพ */}
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">รูปภาพ (URL)</label>
            <div className="flex gap-4">
              <input required type="text" value={form.imageUrl} className="flex-1 bg-[#111] border border-gray-700 p-4 rounded-xl focus:border-yellow-500 outline-none transition-all text-sm text-white" 
                onChange={e => setForm({...form, imageUrl: e.target.value})} />
              <div className="w-14 h-14 bg-[#111] border border-gray-700 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                {form.imageUrl ? <img src={form.imageUrl} className="w-full h-full object-cover"/> : <ImageIcon className="text-gray-600"/>}
              </div>
            </div>
          </div>

          {/* รายละเอียด */}
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">รายละเอียด</label>
            <textarea rows="3" value={form.description || ''} className="w-full bg-[#111] border border-gray-700 p-4 rounded-xl focus:border-yellow-500 outline-none transition-all text-sm leading-relaxed text-white" 
              onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          {/* เพิ่ม Stock (Optional) */}
          {form.type === 'ID_ACCOUNT' && (
            <div className="bg-yellow-900/10 p-6 rounded-2xl border border-yellow-500/20">
              <label className="block text-yellow-400 text-sm mb-2 font-bold">➕ เพิ่มสต็อกใหม่ (ถ้าต้องการ)</label>
              <input type="text" placeholder="ใส่รหัสเพิ่ม... (ถ้าไม่ใส่ ของเดิมจะไม่หาย)" className="w-full bg-[#050505] border border-yellow-900/50 p-4 rounded-xl text-yellow-200 focus:border-yellow-500 outline-none font-mono text-sm" 
                onChange={e => setForm({...form, stockContent: e.target.value})} />
            </div>
          )}

          <button disabled={loading} className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black py-4 rounded-xl font-bold text-lg shadow-lg shadow-yellow-900/20 transition-all hover:-translate-y-1">
            {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
          </button>
        </form>
      </div>
    </div>
  );
}