import AdminLayout from '@/components/AdminLayout';
import { useState } from 'react';
import { Plus, Trash2, Save, UploadCloud, Star, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { jwtVerify } from 'jose';

export default function AdminCategories({ categories }) {
  const [localCats, setLocalCats] = useState(categories);
  const [form, setForm] = useState({ name: '', imageUrl: '', isRecommended: false });
  const [uploading, setUploading] = useState(false);

  // --- ฟังก์ชันอัปโหลดรูป (Cloudinary) ---
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const loadingToast = toast.loading('กำลังอัปโหลดรูป...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'neonstore_uploads'); // เช็คชื่อ Preset ให้ตรงกับใน Cloudinary
    formData.append('cloud_name', 'ddypmn9df'); 

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/ddypmn9df/image/upload`, { 
          method: 'POST', 
          body: formData 
        });
        const data = await res.json();
        
        if (data.secure_url) {
            setForm({ ...form, imageUrl: data.secure_url });
            toast.success('อัปโหลดรูปสำเร็จ');
        } else {
            throw new Error('Upload failed');
        }
    } catch (err) { 
        toast.error('อัปโหลดไม่ผ่าน กรุณาลองใหม่');
        console.error(err);
    } finally {
        toast.dismiss(loadingToast);
        setUploading(false);
    }
  };

  // --- ฟังก์ชันบันทึกหมวดหมู่ ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.imageUrl) return toast.error('กรุณากรอกชื่อและอัปโหลดรูปภาพ');

    const loadingToast = toast.loading('กำลังบันทึก...');
    try {
        const res = await fetch('/api/category/manage', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(form)
        });
        
        if (res.ok) { 
            toast.success('เพิ่มหมวดหมู่สำเร็จ!'); 
            // รีโหลดหน้าเว็บเพื่อแสดงข้อมูลใหม่
            window.location.reload(); 
        } else {
            throw new Error('Failed');
        }
    } catch (e) { 
        toast.error('เกิดข้อผิดพลาด'); 
    } finally {
        toast.dismiss(loadingToast);
    }
  };

  // --- ฟังก์ชันลบหมวดหมู่ ---
  const handleDelete = async (id) => {
    if (!confirm('⚠️ ยืนยันการลบหมวดหมู่นี้? (สินค้าในหมวดนี้อาจได้รับผลกระทบ)')) return;
    
    try {
        const res = await fetch('/api/category/manage', { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ id }) 
        });
        
        if (res.ok) {
            setLocalCats(localCats.filter(c => c.id !== id));
            toast.success('ลบเรียบร้อย');
        } else {
            toast.error('ลบไม่สำเร็จ');
        }
    } catch (e) {
        toast.error('Error deleting');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
            <Layers size={32} className="text-cyan-400" />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-white">จัดการหมวดหมู่เกม</h1>
            <p className="text-gray-400 text-sm">เพิ่มและแก้ไขหมวดหมู่สินค้าที่แสดงหน้าแรก</p>
        </div>
      </div>
      
      {/* --- Form Section (เพิ่มหมวดหมู่) --- */}
      <div className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-3xl mb-10 shadow-lg relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-600"></div>
         
         <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Plus className="text-cyan-400" size={20}/> เพิ่มหมวดหมู่ใหม่
         </h3>

         <div className="flex flex-col md:flex-row gap-6 items-end">
            
            {/* ชื่อหมวดหมู่ */}
            <div className="flex-1 w-full">
                <label className="text-xs text-gray-400 mb-2 block font-bold uppercase tracking-wider">ชื่อหมวดหมู่ (เช่น ROV, Netflix)</label>
                <input 
                    type="text" 
                    placeholder="กรอกชื่อหมวดหมู่..." 
                    className="w-full bg-[#151515] border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-all" 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})}
                />
            </div>

            {/* รูปภาพ */}
            <div className="w-full md:w-48">
                <label className="text-xs text-gray-400 mb-2 block font-bold uppercase tracking-wider">รูปปก (Icon)</label>
                <div className={`relative bg-[#151515] border-2 border-dashed ${form.imageUrl ? 'border-cyan-500' : 'border-gray-700'} rounded-xl h-[58px] flex items-center justify-center cursor-pointer hover:border-cyan-400 transition-all group/upload overflow-hidden`}>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleUpload}/>
                    {form.imageUrl ? (
                        <img src={form.imageUrl} className="h-full w-full object-cover opacity-80 group-hover/upload:opacity-100 transition-opacity"/>
                    ) : (
                        <div className="flex items-center gap-2 text-gray-500 group-hover/upload:text-cyan-400">
                            {uploading ? <Loader2 className="animate-spin" size={18}/> : <UploadCloud size={20}/>}
                            <span className="text-xs font-medium">{uploading ? 'Loading...' : 'อัปโหลด'}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ปุ่มแนะนำ (Checkbox แบบเท่ๆ) */}
            <div 
                className={`flex items-center gap-3 bg-[#151515] border ${form.isRecommended ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-gray-700'} p-4 rounded-xl cursor-pointer transition-all select-none h-[58px] min-w-[140px] justify-center`} 
                onClick={() => setForm({...form, isRecommended: !form.isRecommended})}
            >
                <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${form.isRecommended ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-transparent border border-gray-600'}`}>
                    <Star size={14} fill="currentColor"/>
                </div>
                <span className={`text-sm font-bold ${form.isRecommended ? 'text-yellow-400' : 'text-gray-400'}`}>แนะนำ?</span>
            </div>

            {/* ปุ่มบันทึก */}
            <button 
                onClick={handleSubmit} 
                disabled={uploading || !form.name} 
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 h-[58px] rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-cyan-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Save size={20}/> บันทึก
            </button>
         </div>
      </div>

      {/* --- List Section (รายการหมวดหมู่) --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {localCats.map(cat => (
            <div key={cat.id} className="bg-[#0a0a0a] border border-white/10 p-5 rounded-2xl flex flex-col items-center relative group hover:border-cyan-500/50 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                
                {/* รูปภาพ */}
                <div className="w-16 h-16 rounded-2xl bg-[#151515] flex items-center justify-center mb-4 overflow-hidden shadow-inner border border-white/5">
                    <img src={cat.imageUrl} className="w-full h-full object-cover"/>
                </div>
                
                {/* ชื่อ */}
                <h4 className="font-bold text-white text-center mb-1">{cat.name}</h4>
                
                {/* ป้ายแนะนำ */}
                {cat.isRecommended ? (
                    <span className="text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 mt-1">
                        <Star size={8} fill="currentColor"/> แนะนำ
                    </span>
                ) : (
                    <span className="text-[10px] text-gray-600 mt-1">- ทั่วไป -</span>
                )}

                {/* ปุ่มลบ (โผล่มาตอน Hover) */}
                <button 
                    onClick={() => handleDelete(cat.id)} 
                    className="absolute top-2 right-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
                    title="ลบหมวดหมู่"
                >
                    <Trash2 size={14}/>
                </button>
            </div>
        ))}

        {localCats.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 bg-[#0a0a0a] border border-dashed border-gray-800 rounded-2xl">
                ยังไม่มีหมวดหมู่สินค้า
            </div>
        )}
      </div>
    </AdminLayout>
  );
}

// Loader Component เล็กๆ (ถ้ายังไม่มีก็เอาออกได้)
function Loader2({ className, size }) {
    return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>;
}

export async function getServerSideProps(context) {
  // 🔒 ตรวจสอบสิทธิ์ Admin
  const { req } = context;
  const token = req.cookies.admin_token;
  if (!token) return { redirect: { destination: '/admin/login', permanent: false } };

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
  } catch (e) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }

  // ดึงข้อมูลหมวดหมู่
  const prisma = (await import('@/lib/prisma')).default;
  const categories = await prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
  
  return { props: { categories: JSON.parse(JSON.stringify(categories)) } };
}