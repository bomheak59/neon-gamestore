import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Star, ThumbsUp, User } from 'lucide-react';

export default function ReviewsPage() {
  // ข้อมูลรีวิวจำลอง (ในอนาคตเชื่อม DB ได้)
  const reviews = [
    { id: 1, user: "Kittisak Gamer", rating: 5, date: "2 ชั่วโมงที่แล้ว", comment: "ได้รับรหัสไวมากครับ ไม่ถึง 1 นาทีเข้าเล่นได้เลย แนะนำร้านนี้ครับ!", item: "ID Valorant Diamond" },
    { id: 2, user: "NongMay Ch.", rating: 5, date: "เมื่อวานนี้", comment: "เติม ROV คุ้มมาก ถูกกว่าเติมเองเยอะเลย แอดมินตอบไว", item: "ROV 115 Coupons" },
    { id: 3, user: "Somchai_99", rating: 4, date: "2 วันที่แล้ว", comment: "Netflix ดูได้ชัดแจ๋ว ไม่มีสะดุดครับ", item: "Netflix 4K 30 Days" },
    { id: 4, user: "ProPlayer TH", rating: 5, date: "3 วันที่แล้ว", comment: "ซื้อไอดีไก่ไปซ้อมมือ คุ้มราคามาก ได้ของตามภาพเป๊ะ", item: "ID Valorant Unranked" },
    { id: 5, user: "User1234", rating: 5, date: "สัปดาห์ที่แล้ว", comment: "บริการดีมากครับ ครั้งหน้าอุดหนุนใหม่แน่นอน", item: "Youtube Premium" },
    { id: 6, user: "DevMan", rating: 5, date: "สัปดาห์ที่แล้ว", comment: "ระบบเว็บลื่นมาก ใช้งานง่าย ชอบดีไซน์ครับ", item: "ID Minecraft" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 pt-10">
      <Head><title>รีวิวจากลูกค้า | NEON STORE</title></Head>

      <div className="max-w-6xl mx-auto">
        <Link href="/">
          <button className="flex items-center gap-2 text-gray-400 mb-8 hover:text-white transition-colors">
            <ArrowLeft /> กลับหน้าแรก
          </button>
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            เสียงตอบรับจาก <span className="text-yellow-400">ลูกค้าของเรา</span>
          </h1>
          <p className="text-gray-400">ความพึงพอใจของคุณ คือความสำเร็จของเรา</p>
          
          <div className="flex justify-center gap-8 mt-8">
            <div className="bg-gray-900/50 px-6 py-4 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
              <div className="flex text-yellow-400 gap-1 justify-center text-sm">
                 <Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/>
              </div>
              <div className="text-xs text-gray-500 mt-2">คะแนนเฉลี่ย</div>
            </div>
            <div className="bg-gray-900/50 px-6 py-4 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold text-white mb-1">10,000+</div>
              <div className="text-green-400 text-sm font-bold">Orders</div>
              <div className="text-xs text-gray-500 mt-2">รายการสั่งซื้อสำเร็จ</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl hover:border-yellow-500/30 transition-all hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center border border-white/10">
                    <User size={20} className="text-gray-400"/>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{review.user}</div>
                    <div className="text-xs text-gray-500">{review.date}</div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-700"} />
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-xs font-bold text-cyan-400 bg-cyan-900/20 px-2 py-1 rounded border border-cyan-500/20">
                  {review.item}
                </span>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">"{review.comment}"</p>
              
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-gray-500 cursor-pointer hover:text-white">
                <ThumbsUp size={14} /> ถูกใจรีวิวนี้
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12 pb-20">
          <button className="bg-white/5 border border-white/10 px-8 py-3 rounded-full text-white hover:bg-white/10 transition-all">
            ดูรีวิวทั้งหมด
          </button>
        </div>
      </div>
    </div>
  );
}