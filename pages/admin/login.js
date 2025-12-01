import { useState } from 'react';
import { useRouter } from 'next/router';
import { ShieldCheck, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success('เข้าสู่ระบบสำเร็จ');
        router.push('/admin'); // ไปหน้า Dashboard
      } else {
        toast.error('รหัสผ่านไม่ถูกต้อง');
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-cyan-900/20 mb-4 border border-cyan-500/20">
             <ShieldCheck size={40} className="text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">ADMIN ACCESS</h1>
          <p className="text-gray-500 text-sm">ระบบจัดการหลังบ้าน (Security Secured)</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Username</label>
            <div className="flex items-center bg-[#111] border border-gray-800 rounded-xl px-4 py-3 mt-1">
              <User size={18} className="text-gray-500" />
              <input type="text" className="bg-transparent border-none outline-none text-white w-full ml-3"
                placeholder="Username" onChange={(e) => setForm({...form, username: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
            <div className="flex items-center bg-[#111] border border-gray-800 rounded-xl px-4 py-3 mt-1">
              <Lock size={18} className="text-gray-500" />
              <input type="password" className="bg-transparent border-none outline-none text-white w-full ml-3"
                placeholder="••••••••" onChange={(e) => setForm({...form, password: e.target.value})} />
            </div>
          </div>

          <button disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-4">
            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
}