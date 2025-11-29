import { useState, useEffect } from 'react';
import { Timer, Zap } from 'lucide-react';

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      // (Logic นับถอยหลังแบบง่ายๆ)
      setTimeLeft(prev => {
        if(prev.seconds > 0) return {...prev, seconds: prev.seconds - 1};
        if(prev.minutes > 0) return {...prev, minutes: prev.minutes - 1, seconds: 59};
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-4 mt-8 mb-4 max-w-7xl lg:mx-auto bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-[0_0_30px_rgba(220,38,38,0.4)] animate-pulse-slow">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div className="bg-white/20 p-3 rounded-full"><Zap className="text-white fill-white" size={32}/></div>
        <div>
          <h2 className="text-2xl font-bold text-white italic uppercase tracking-wider">Flash Sale 🔥</h2>
          <p className="text-red-100 text-sm">ลดกระหน่ำ 50% เฉพาะชั่วโมงนี้!</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-white font-bold uppercase tracking-widest text-xs">Ends in:</span>
        <div className="flex gap-2 text-center">
          <TimeBox val={timeLeft.hours} label="HRS" />
          <span className="text-2xl font-bold text-white">:</span>
          <TimeBox val={timeLeft.minutes} label="MIN" />
          <span className="text-2xl font-bold text-white">:</span>
          <TimeBox val={timeLeft.seconds} label="SEC" />
        </div>
      </div>
    </div>
  );
}

function TimeBox({ val, label }) {
  return (
    <div>
      <div className="bg-black/40 backdrop-blur-md text-white font-mono text-xl font-bold w-12 h-12 flex items-center justify-center rounded-lg border border-white/20">
        {String(val).padStart(2, '0')}
      </div>
      <div className="text-[10px] font-bold text-red-200 mt-1">{label}</div>
    </div>
  );
}