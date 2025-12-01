import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Save, ArrowLeft, UploadCloud, X, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminEditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [form, setForm] = useState({
    name: '', price: '', discount: '', category: '', 
    description: '', type: 'ID_ACCOUNT', stockContent: '',
    images: [], imageUrl: ''
  });

  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/product/get?id=${id}`)
      .then(res => res.json())
      .then(data => {
        let loadedImages = [];
        if (data.images) { try { const parsed = JSON.parse(data.images); if (Array.isArray(parsed)) loadedImages = parsed; } catch (e) {} }
        if (loadedImages.length === 0 && data.imageUrl) loadedImages = [data.imageUrl];
        
        let loadedOptions = [];
        if (data.options) { try { const parsed = JSON.parse(data.options); if (Array.isArray(parsed)) loadedOptions = parsed; } catch (e) {} }

        setForm({ ...data, price: data.price.toString(), discount: data.discount.toString(), images: loadedImages, stockContent: '' });
        setOptions(loadedOptions);
        setIsFetching(false);
      });
  }, [id]);

  const addOption = () => setOptions([...options, { base: '', bonusPercent: '', price: '' }]);
  const removeOption = (index) => setOptions(options.filter((_, i) => i !== index));
  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  // Image functions...
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
  const removeImage = (index) => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) return toast.error("ต้องมีรูปภาพ");
    setLoading(true);
    try {
      const res = await fetch('/api/product/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id, imageUrl: form.images[0], images: form.images, options: options.filter(o => o.base && o.price) })
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('✅ แก้ไขเรียบร้อย!');
      router.push('/admin/products'); 
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  };

  if (isFetching) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 flex justify-center font-sans">
      <div className="max-w-3xl w-full bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative">
        <Link href="/admin/products"><button className="absolute top-8 right-8 text-gray-500 hover:text-white"><ArrowLeft size={24} /></button></Link>
        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center gap-3">
          <div className="bg-yellow-500/20 p-2 rounded-lg border border-yellow-500/30"><Save className="text-yellow-400" /></div>
          แก้ไขสินค้า
        </h1>

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* (Input ชื่อ, หมวดหมู่, ราคา เหมือนเดิม) */}
          <div><label className="block text-gray-400 text-sm mb-2">ชื่อสินค้า</label><input required value={form.name} className="w-full bg-[#111] border border-gray-700 p-4 rounded-xl text-white" onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div className="grid grid-cols-3 gap-4">
             <input required value={form.category} className="bg-[#111] border border-gray-700 p-4 rounded-xl text-white" onChange={e => setForm({...form, category: e.target.value})} />
             <input required type="number" value={form.price} className="bg-[#111] border border-gray-700 p-4 rounded-xl text-white" onChange={e => setForm({...form, price: e.target.value})} />
             <input type="number" value={form.discount} className="bg-[#111] border border-gray-700 p-4 rounded-xl text-white" onChange={e => setForm({...form, discount: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button type="button" onClick={() => setForm({...form, type: 'ID_ACCOUNT'})} className={`p-4 rounded-xl border text-sm font-bold ${form.type === 'ID_ACCOUNT' ? 'bg-purple-500/20 border-purple-500' : 'bg-[#111] border-gray-700'}`}>👤 ขายไอดี / แอพ</button>
            <button type="button" onClick={() => setForm({...form, type: 'TOPUP'})} className={`p-4 rounded-xl border text-sm font-bold ${form.type === 'TOPUP' ? 'bg-green-500/20 border-green-500' : 'bg-[#111] border-gray-700'}`}>🎮 บริการเติมเกม</button>
          </div>

          {/* 🔥 แก้ไข: เปลี่ยนช่องแถมเป็น % 🔥 */}
          {form.type === 'TOPUP' && (
            <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-2xl">
              <label className="block text-green-400 text-sm font-bold mb-4">📦 แก้ไขแพ็คเกจ (ใส่ % เพื่อคำนวณของแถม)</label>
              <div className="space-y-3">
                {options.map((opt, index) => (
                  <div key={index} className="flex gap-2 items-center bg-black/40 p-2 rounded-xl border border-gray-700">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                        <input type="number" placeholder="จำนวนหลัก" className="bg-[#151515] border border-gray-600 p-2 rounded-lg text-sm text-white text-center" value={opt.base || ''} onChange={(e) => updateOption(index, 'base', e.target.value)}/>
                        <input type="number" placeholder="โบนัส (%)" className="bg-[#151515] border border-gray-600 p-2 rounded-lg text-sm text-yellow-400 text-center" value={opt.bonusPercent || ''} onChange={(e) => updateOption(index, 'bonusPercent', e.target.value)}/>
                    </div>
                    <div className="text-gray-500">=</div>
                    <input type="number" placeholder="ราคา" className="w-24 bg-[#151515] border border-green-600/50 p-2 rounded-lg text-sm text-green-400 font-bold text-right" value={opt.price} onChange={(e) => updateOption(index, 'price', e.target.value)}/>
                    <button type="button" onClick={() => removeOption(index)} className="text-red-500 hover:text-red-400 p-2"><Trash2 size={18}/></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addOption} className="mt-4 flex items-center gap-2 text-xs text-cyan-400 font-bold hover:underline">+ เพิ่มตัวเลือก</button>
            </div>
          )}

          {/* (ส่วนรูปภาพและอื่นๆ เหมือนเดิม) */}
          <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-yellow-500 relative bg-[#111]">
             <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
             <div className="text-gray-500 flex flex-col items-center"><UploadCloud size={32} className={uploading ? "animate-bounce text-yellow-400" : ""} /><span className="mt-2 text-sm">{uploading ? "กำลังอัปโหลด..." : "คลิกเพิ่มรูปภาพ"}</span></div>
          </div>
          <div className="grid grid-cols-4 gap-4">
             {form.images.map((img, idx) => (
               <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-700 bg-[#222]">
                 <img src={img} className="w-full h-full object-cover" /><button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"><X size={12} /></button>
               </div>
             ))}
          </div>
          <textarea rows="4" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-[#111] border border-gray-700 p-4 rounded-xl text-white" />
          
          {form.type === 'ID_ACCOUNT' && (
            <div className="bg-yellow-900/10 p-4 rounded-xl border border-yellow-500/20"><label className="block text-yellow-400 text-xs mb-1 font-bold">➕ เพิ่มสต็อกใหม่</label><input type="text" className="w-full bg-[#050505] border border-yellow-900/50 p-3 rounded-lg text-yellow-200 text-sm" onChange={e => setForm({...form, stockContent: e.target.value})} /></div>
          )}

          <button disabled={loading || uploading} className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-4 rounded-xl shadow-lg">{loading ? 'บันทึก...' : 'บันทึกการแก้ไข'}</button>
        </form>
      </div>
      <style jsx global>{`input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; } input[type=number] { -moz-appearance: textfield; }`}</style>
    </div>
  );
}