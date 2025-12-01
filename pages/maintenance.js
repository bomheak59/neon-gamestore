import Head from 'next/head';
import { ShieldAlert, Hammer } from 'lucide-react';

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center relative overflow-hidden font-sans">
      <Head><title>System Maintenance | NEON STORE</title></Head>

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black opacity-80"></div>

      <div className="relative z-10 max-w-lg animate-pulse">
        <div className="mx-auto bg-red-500/10 w-24 h-24 rounded-full flex items-center justify-center border border-red-500/30 mb-8 shadow-[0_0_30px_rgba(239,68,68,0.4)]">
          <Hammer size={48} className="text-red-500" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
          SYSTEM OFFLINE
        </h1>
        
        <div className="h-1 w-32 bg-red-500 mx-auto mb-6 rounded-full"></div>

        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          ขออภัยในความไม่สะดวก <br/>
          ระบบกำลังอยู่ระหว่างการปรับปรุงชั่วคราว
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 border border-gray-800 text-gray-500 text-sm font-mono">
          <ShieldAlert size={16} />
          <span>STATUS: MAINTENANCE</span>
        </div>
      </div>
    </div>
  );
}