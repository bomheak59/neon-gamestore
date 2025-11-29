import { useState } from 'react';
import { useRouter } from 'next/router';
import { Plus, Image as ImageIcon, ArrowLeft, Percent } from 'lucide-react';
import Link from 'next/link';

export default function AdminAddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    price: '',
    discount: '', // เพิ่ม state ส่วนลด
    category: '',
    description: '',
    imageUrl: '',
    type: 'ID_ACCOUNT', 
    stockContent: '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/product/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed');
      alert('✅ ลงขายสินค้าเรียบร้อย!');
      router.push('/admin/products'); 
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 flex justify-center font-sans">
      <div className="max-w-3xl w-full bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative">
        <Link href="/admin/products">
          <button className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </button>
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-3">
          <div className="bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/30"><Plus className="text-cyan-400" /></div>
          ลงขายสินค้า
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">ชื่อสินค้า</label>
            <input required type="text" placeholder="ชื่อสินค้า..." className="w-full bg-[#111] border border-gray-700 p-4 rounded-xl focus:border-cyan-500 outline-none transition-all text-white" 
              onChange={e => setForm({...form, name: e.target.value})} />
          </div>

          {/* Grid ราคา และ ส่วนลด */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-medium">หมวดหมู่</label>
              <input required type="text" placeholder="เช่น Valorant" className="w-full bg-[#111] border border-gray-700 p-4 rounded-xl focus:border-cyan-500 outline-none transition-all text-white" 
                onChange={e => setForm({...form, category: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-medium">ราคาขายจริง (บาท)</label>
              <input required type="number" placeholder="0.00" style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }} className="appearance-none w-full bg-[#111] border border-gray-700 p-4 rounded-xl focus:border-cyan-500 outline-none transition-all font-mono text-cyan-400 font-bold text-lg" 
                onChange={e => setForm({...form, price: e.target.value})} />
            </div>
            {/* ช่องกรอกส่วนลด (เพิ่มใหม่) */}
            <div className="relative">
              <label className="block text-gray-400 text-sm mb-2 font-medium text-red-400">ส่วนลด (%)</label>
              <input type="number" placeholder="0" style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }} className="appearance-none w-full bg-[#111] border border-red-900/50 p-4 rounded-xl focus:border-red-500 outline-none transition-all font-mono text-red-400 font-bold text-lg pl-10" 
                onChange={e => setForm({...form, discount: e.target.value})} />
              <Percent size={18} className="absolute left-3 top-[46px] text-red-500"/>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">ประเภทสินค้า</label>
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setForm({...form, type: 'ID_ACCOUNT'})} className={`p-4 rounded-xl border transition-all text-sm font-bold flex flex-col items-center gap-2 ${form.type === 'ID_ACCOUNT' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-[#111] border-gray-700 text-gray-500'}`}><span className="text-xl">👤</span> ขายไอดี / แอพ</button>
              <button type="button" onClick={() => setForm({...form, type: 'TOPUP'})} className={`p-4 rounded-xl border transition-all text-sm font-bold flex flex-col items-center gap-2 ${form.type === 'TOPUP' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-[#111] border-gray-700 text-gray-500'}`}><span className="text-xl">🎮</span> บริการเติมเกม</button>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">รูปภาพ (URL)</label>
            <div className="flex gap-4">
              <input required type="text" placeholder="https://..." className="flex-1 bg-[#111] border border-gray-700 p-4 rounded-xl focus:border-cyan-500 outline-none transition-all text-sm text-white" 
                onChange={e => setForm({...form, imageUrl: e.target.value})} />
              <div className="w-14 h-14 bg-[#111] border border-gray-700 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                {form.imageUrl ? <img src={form.imageUrl} className="w-full h-full object-cover"/> : <ImageIcon className="text-gray-600"/>}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">รายละเอียด</label>
            <textarea rows="3" className="w-full bg-[#111] border border-gray-700 p-4 rounded-xl focus:border-cyan-500 outline-none transition-all text-sm leading-relaxed text-white" placeholder="รายละเอียด..." onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          {form.type === 'ID_ACCOUNT' && (
            <div className="bg-cyan-900/10 p-6 rounded-2xl border border-cyan-500/20 animate-in fade-in zoom-in duration-300">
              <label className="block text-cyan-400 text-sm mb-2 font-bold">🔐 ข้อมูลลับ (Username | Password)</label>
              <input required type="text" placeholder="user | pass" className="w-full bg-[#050505] border border-cyan-900/50 p-4 rounded-xl text-cyan-200 focus:border-cyan-500 outline-none font-mono text-sm" onChange={e => setForm({...form, stockContent: e.target.value})} />
            </div>
          )}

          <button disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-cyan-900/20 transition-all hover:-translate-y-1">
            {loading ? 'กำลังบันทึก...' : 'ลงขายทันที'}
          </button>
        </form>
      </div>
    </div>
  );
}