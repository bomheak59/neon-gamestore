import AdminLayout from '@/components/AdminLayout';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';

export default function AdminDashboard({ stats }) {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">ภาพรวมร้านค้า</h1>
        <p className="text-gray-400">สรุปข้อมูลสถิติประจำวันนี้</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="รายได้รวม" value={`฿${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="cyan" />
        <StatCard title="ออเดอร์ทั้งหมด" value={stats.totalOrders} icon={ShoppingCart} color="purple" />
        <StatCard title="สินค้าในร้าน" value={stats.totalProducts} icon={Package} color="green" />
        <StatCard title="รอตรวจสอบ" value={stats.pendingOrders} icon={Users} color="yellow" />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-bold text-lg text-white">คำสั่งซื้อล่าสุด</h3>
          <button className="text-cyan-400 text-sm hover:underline">ดูทั้งหมด</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-gray-200">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">ยอดเงิน</th>
                <th className="p-4">สถานะ</th>
                <th className="p-4">วันที่</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-white">{order.id.split('-')[0]}...</td>
                  <td className="p-4 text-cyan-400 font-bold">฿{order.totalAmount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      order.status === 'PAID' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  {/* 👇👇👇 แก้ไขตรงนี้ครับ (บังคับ 'th-TH') 👇👇👇 */}
                  <td className="p-4">
                    {new Date(order.createdAt).toLocaleDateString('th-TH')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

// Component การ์ดเล็กๆ
function StatCard({ title, value, icon: Icon, color }) {
  const colors = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };

  return (
    <div className={`p-6 rounded-2xl border ${colors[color].split(' ')[2]} bg-[#0a0a0a]`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

export async function getServerSideProps() {
  const prisma = (await import('@/lib/prisma')).default;
  
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  const productsCount = await prisma.product.count();

  const totalRevenue = orders
    .filter(o => o.status === 'PAID')
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  return {
    props: {
      stats: {
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: productsCount,
        pendingOrders: orders.filter(o => o.status === 'PENDING').length,
        recentOrders: JSON.parse(JSON.stringify(orders.slice(0, 5))),
      }
    }
  };
}