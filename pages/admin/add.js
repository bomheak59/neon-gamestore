import { useState } from 'react';
import { useRouter } from 'next/router';
import { Plus, ArrowLeft, UploadCloud, X, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminAddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [form, setForm] = useState({
    name: '', price: '', discount: '', category: '', 
    description: '', type: 'ID_ACCOUNT', stockContent: '',
    images: [] 
  });

  const [options, setOptions] = useState([]);

  const addOption = () => setOptions([...options, { base: '', bonusPercent: '', price: '' }]);
  const removeOption = (index) => setOptions(options.filter((_, i) => i !== index));
  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    setUploading(true);
    const newImages = [];
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      formData.append('upload_preset', 'neonstore_uploads'); 
      formData.append('cloud_name', 'ddypmn9df'); 
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/ddypmn9df/image/upload`, { method: 'POST', body: formData });
        const data = await res.json();
        if (data.secure_url) newImages.push(data.secure_url);
      } catch (err) { console.error(err); }
    }
    setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    setUploading(false);
  };

  const removeImage = (index) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) return alert("กรุณาอัปโหลดรูปอย่างน้อย 1 รูป");
    setLoading(true);
    try {
      const res = await fetch('/api/product/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          imageUrl: form.images[0],
          images: form.images,
          options: options.filter(o => o.base && o.price)
        })
      });
      if (!res.ok) throw new Error('Failed');
      alert('✅ ลงขายสินค้าเรียบร้อย!');
      router.push('/admin/products'); 
    } catch (error) { alert(error.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 flex justify-center font-sans">
      <div className="max-w-3xl w-full bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative">
        <Link href="/admin/products"><button className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><ArrowLeft size={24} /></button></Link>
        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-3">
          <div className="bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/30"><Plus className="text-cyan-400" /></div>
          ลงขายสินค้า
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">ชื่อสินค้า</label>
            <input required type="text" placeholder="ชื่อสินค้า..." className="w-full bg-[#111] border border-gray-700 p-4 rounded-xl text-white" onChange={e => setForm({...form, name: e.target.value})} />
          </div>

          <div className="grid grid-cols-3 gap-4">
             <input required type="text" placeholder="หมวดหมู่" className="bg-[#111] border border-gray-700 p-4 rounded-xl text-white" onChange={e => setForm({...form, category: e.target.value})} />
             <input required type="number" placeholder="ราคาเริ่มต้น" className="bg-[#111] border border-gray-700 p-4 rounded-xl text-white" onChange={e => setForm({...form, price: e.target.value})} />
             <input type="number" placeholder="ส่วนลด %" className="bg-[#111] border border-gray-700 p-4 rounded-xl text-white" onChange={e => setForm({...form, discount: e.target.value})} />
          </div>

          <div>
             <label className="block text-gray-400 text-sm mb-2 font-medium">ประเภทสินค้า</label>
             <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setForm({...form, type: 'ID_ACCOUNT'})} className={`p-4 rounded-xl border text-sm font-bold ${form.type === 'ID_ACCOUNT' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-[#111] border-gray-700 text-gray-500'}`}>👤 ขายไอดี / แอพ</button>
                <button type="button" onClick={() => setForm({...form, type: 'TOPUP'})} className={`p-4 rounded-xl border text-sm font-bold ${form.type === 'TOPUP' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-[#111] border-gray-700 text-gray-500'}`}>🎮 บริการเติมเกม</button>
             </div>
          </div>

          {/* 🔥 แก้ไข: เปลี่ยนช่องแถมเป็น % 🔥 */}
          {form.type === 'TOPUP' && (
            <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-2xl">
              <label className="block text-green-400 text-sm font-bold mb-4">📦 กำหนดแพ็คเกจ (ใส่ % เพื่อคำนวณของแถม)</label>
              <div className="space-y-3">
                {options.map((opt, index) => (
                  <div key={index} className="flex gap-2 items-center bg-black/40 p-2 rounded-xl border border-gray-700">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                        <input 
                            type="number" 
                            placeholder="จำนวนหลัก" 
                            className="bg-[#151515] border border-gray-600 p-2 rounded-lg text-sm text-white text-center"
                            value={opt.base}
                            onChange={(e) => updateOption(index, 'base', e.target.value)}
                        />
                        <input 
                            type="number" 
                            placeholder="โบนัส (%)" 
                            className="bg-[#151515] border border-gray-600 p-2 rounded-lg text-sm text-yellow-400 text-center"
                            value={opt.bonusPercent}
                            onChange={(e) => updateOption(index, 'bonusPercent', e.target.value)}
                        />
                    </div>
                    <div className="text-gray-500">=</div>
                    <input 
                        type="number" 
                        placeholder="ราคาขาย" 
                        className="w-24 bg-[#151515] border border-green-600/50 p-2 rounded-lg text-sm text-green-400 font-bold text-right"
                        value={opt.price}
                        onChange={(e) => updateOption(index, 'price', e.target.value)}
                    />
                    <button type="button" onClick={() => removeOption(index)} className="text-red-500 hover:text-red-400 p-2"><Trash2 size={18}/></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addOption} className="mt-4 flex items-center gap-2 text-xs text-cyan-400 font-bold hover:underline">+ เพิ่มแพ็คเกจ</button>
            </div>
          )}

          {/* (ส่วนอื่นๆ เหมือนเดิม) */}
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">รูปภาพสินค้า</label>
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer relative bg-[#111] group mb-4">
               <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
               <div className="flex flex-col items-center gap-3 text-gray-500 group-hover:text-cyan-400">
                 <UploadCloud size={40} className={uploading ? "animate-bounce" : ""} />
                 <div className="text-sm">{uploading ? "กำลังอัปโหลด..." : "คลิกเพิ่มรูปภาพ"}</div>
               </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-700">
                    <img src={img} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"><X size={12} /></button>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">รายละเอียด</label>
            <textarea rows="4" className="w-full bg-[#111] border border-gray-700 p-4 rounded-xl focus:border-cyan-500 outline-none transition-all text-sm text-white" onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          {form.type === 'ID_ACCOUNT' && (
            <div className="bg-cyan-900/10 p-6 rounded-2xl border border-cyan-500/20">
              <label className="block text-cyan-400 text-sm mb-2 font-bold">🔐 ข้อมูลลับ</label>
              <input required type="text" placeholder="user | pass" className="w-full bg-[#050505] border border-cyan-900/50 p-4 rounded-xl text-cyan-200 focus:border-cyan-500 outline-none" onChange={e => setForm({...form, stockContent: e.target.value})} />
            </div>
          )}

          <button disabled={loading || uploading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg">
            {loading ? 'กำลังบันทึก...' : 'ลงขายทันที'}
          </button>
        </form>
      </div>
      <style jsx global>{`input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; } input[type=number] { -moz-appearance: textfield; }`}</style>
    </div>
  );
}