// components/SkeletonCard.js
export default function SkeletonCard() {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
      {/* ส่วนรูปภาพ (กระพริบ) */}
      <div className="h-56 bg-gray-800/50 animate-pulse"></div>
      
      {/* ส่วนเนื้อหา */}
      <div className="p-6 space-y-4">
        {/* ชื่อสินค้า */}
        <div className="h-6 bg-gray-800/50 rounded w-3/4 animate-pulse"></div>
        
        {/* ราคาและปุ่ม */}
        <div className="flex justify-between items-end pt-2">
          <div className="space-y-2">
            <div className="h-3 bg-gray-800/50 rounded w-10 animate-pulse"></div>
            <div className="h-8 bg-gray-800/50 rounded w-20 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-800/50 rounded-xl w-24 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}