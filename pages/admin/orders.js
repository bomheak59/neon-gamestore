import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminOrders({ orders }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  // ฟังก์ชันเปลี่ยนสถานะ
  const updateStatus = async (orderId, newStatus) => {
    if(!confirm('ยืนยันการเปลี่ยนสถานะ?')) return;
    
    try {
      const res = await fetch('/api/admin/update-order', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ orderId, status: newStatus })
      });
      if(res.ok) router.replace(router.asPath); // Refresh หน้า
    } catch (error) {
      alert('Error updating status');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.contactValue.includes(searchTerm) || o.id.includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">รายการสั่งซื้อ</h1>
        <div className="relative">
          <input 
            type="text" 
            placeholder="ค้นหา (Email, Order ID)..." 
            className="bg-[#0a0a0a] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:border-cyan-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500"/>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-gray-300">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">ลูกค้า</th>
              <th className="p-4">สินค้า</th>
              <th className="p-4">ราคา</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-white/5">
                <td className="p-4 font-mono text-gray-400">{order.id.slice(0,8)}...</td>
                <td className="p-4">
                  <div className="font-bold">{order.contactValue}</div>
                  <div className="text-xs text-gray-500">{order.contactChannel}</div>
                </td>
                <td className="p-4 text-gray-300">
                  {order.orderItems.map(item => (
                    <div key={item.id}>• {item.product.name}</div>
                  ))}
                </td>
                <td className="p-4 font-bold text-cyan-400">฿{order.totalAmount}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
                    order.status === 'PAID' ? 'bg-green-500/20 text-green-400' : 
                    order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {order.status === 'PAID' && <CheckCircle size={12}/>}
                    {order.status === 'PENDING' && <Clock size={12}/>}
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  {order.status === 'PENDING' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'PAID')}
                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-xs mr-2 transition-colors"
                    >
                      อนุมัติ
                    </button>
                  )}
                  {order.status !== 'CANCELLED' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'CANCELLED')}
                      className="text-red-400 hover:text-red-300 text-xs underline"
                    >
                      ยกเลิก
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  const prisma = (await import('@/lib/prisma')).default;
  const orders = await prisma.order.findMany({ 
    include: { orderItems: { include: { product: true } } },
    orderBy: { createdAt: 'desc' } 
  });
  return { props: { orders: JSON.parse(JSON.stringify(orders)) } };
}