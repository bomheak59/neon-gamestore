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
        toast.success('ยินดีต้อนรับครับแอดมิน 😎');
        router.push('/admin'); // เข้าสู่ Dashboard
      } else {
        toast.error('รหัสผ่านไม่ถูกต้อง! ❌');
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Cyberpunk Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]"></div>

      <div className="relative bg-[#0a0a0a] border border-cyan-500/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.15)] w-full max-w-md backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-cyan-900/20 mb-4 border border-cyan-500/20">
             <ShieldCheck size={48} className="text-cyan-400 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">ADMIN ACCESS</h1>
          <p className="text-gray-500 text-sm mt-2">พื้นที่เฉพาะเจ้าหน้าที่เท่านั้น</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Username</label>
            <div className="flex items-center bg-black/50 border border-gray-700 rounded-xl px-4 py-3 focus-within:border-cyan-500 focus-within:text-cyan-400 transition-colors group">
              <User size={20} className="text-gray-500 group-focus-within:text-cyan-500 transition-colors" />
              <input 
                type="text" 
                className="bg-transparent border-none outline-none text-white w-full ml-3 placeholder:text-gray-700"
                placeholder="กรอกชื่อผู้ใช้"
                onChange={(e) => setForm({...form, username: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
            <div className="flex items-center bg-black/50 border border-gray-700 rounded-xl px-4 py-3 focus-within:border-cyan-500 focus-within:text-cyan-400 transition-colors group">
              <Lock size={20} className="text-gray-500 group-focus-within:text-cyan-500 transition-colors" />
              <input 
                type="password" 
                className="bg-transparent border-none outline-none text-white w-full ml-3 placeholder:text-gray-700"
                placeholder="••••••••"
                onChange={(e) => setForm({...form, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/40 transition-all hover:-translate-y-1 active:scale-95 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
}