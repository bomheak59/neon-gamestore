import AdminLayout from '@/components/AdminLayout';
import { useState } from 'react';
import { Search, CheckCircle, XCircle, Clock, Trash2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { jwtVerify } from 'jose'; // 👈 Import

export default function AdminOrders({ orders }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingId, setLoadingId] = useState(null); 

  const updateStatus = async (orderId, newStatus) => {
    setLoadingId(orderId);
    try {
      const res = await fetch('/api/admin/update-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });
      if (res.ok) { toast.success(`อัปเดตสถานะเป็น ${newStatus} เรียบร้อย`); router.replace(router.asPath); } 
      else { toast.error('เกิดข้อผิดพลาด'); }
    } catch (e) { toast.error('Error'); } finally { setLoadingId(null); }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm('⚠️ คุณแน่ใจหรือไม่ที่จะลบออเดอร์นี้? (ข้อมูลจะหายถาวร)')) return;
    setLoadingId(orderId);
    try {
        const res = await fetch('/api/order/delete', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: orderId })
        });
        if (res.ok) { toast.success('ลบออเดอร์เรียบร้อยแล้ว'); router.replace(router.asPath); } 
        else { toast.error('ลบไม่สำเร็จ'); }
    } catch (e) { toast.error('Error deleting order'); } finally { setLoadingId(null); }
  };

  const filteredOrders = orders.filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.contactValue.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">รายการสั่งซื้อ</h1>
        <div className="relative w-64"><input type="text" placeholder="ค้นหา (Email, Order ID)..." className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-cyan-500 outline-none" onChange={(e) => setSearchTerm(e.target.value)} /><Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4"/></div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-white/5 text-gray-200 uppercase font-bold text-xs">
            <tr><th className="p-5">Order ID</th><th className="p-5">ลูกค้า</th><th className="p-5">สินค้า</th><th className="p-5">ราคา</th><th className="p-5">สถานะ</th><th className="p-5 text-center">จัดการ</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-5 font-mono text-white"><span className="text-xs text-gray-500">#</span>{order.id.substring(0, 8)}</td>
                <td className="p-5"><div className="font-bold text-white">{order.contactValue}</div><div className="text-xs text-gray-500">{order.contactChannel}</div></td>
                <td className="p-5">
                   {order.orderItems.map((item, i) => (
                     <div key={i} className="flex items-center gap-2"><span className="text-white">• {item.product.name}</span>{item.userInput && (<span className="text-xs text-gray-500">({JSON.parse(item.userInput).uid || '-'})</span>)}</div>
                   ))}
                </td>
                <td className="p-5 text-cyan-400 font-bold">฿{order.totalAmount}</td>
                <td className="p-5"><span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${order.status === 'PAID' ? 'bg-green-500/20 text-green-400' : order.status === 'VERIFYING' ? 'bg-yellow-500/20 text-yellow-400' : order.status === 'PENDING' ? 'bg-gray-500/20 text-gray-400' : 'bg-red-500/20 text-red-400'}`}>{order.status}</span></td>
                <td className="p-5">
                  <div className="flex justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    {order.status !== 'PAID' && (<button disabled={loadingId === order.id} onClick={() => updateStatus(order.id, 'PAID')} className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50">{loadingId === order.id ? '...' : 'อนุมัติ'}</button>)}
                    {order.status !== 'FAILED' && order.status !== 'PAID' && (<button disabled={loadingId === order.id} onClick={() => updateStatus(order.id, 'FAILED')} className="bg-yellow-600/20 hover:bg-yellow-600 text-yellow-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 border border-yellow-600/50">ยกเลิก</button>)}
                    <button disabled={loadingId === order.id} onClick={() => deleteOrder(order.id)} className="bg-red-900/20 hover:bg-red-600 text-red-500 hover:text-white p-1.5 rounded-lg transition-all disabled:opacity-50 border border-red-900/50" title="ลบถาวร"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (<div className="p-10 text-center text-gray-500">ไม่พบรายการสั่งซื้อ</div>)}
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  // 🔒 2. เพิ่มระบบป้องกัน
  const { req } = context;
  const token = req.cookies.admin_token;

  if (!token) { return { redirect: { destination: '/admin/login', permanent: false } }; }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
  } catch (error) { return { redirect: { destination: '/admin/login', permanent: false } }; }

  const prisma = (await import('@/lib/prisma')).default;
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { orderItems: { include: { product: true } } }
  });
  return { props: { orders: JSON.parse(JSON.stringify(orders)) } };
}