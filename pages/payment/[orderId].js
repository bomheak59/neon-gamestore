import { useRouter } from 'next/router';
import useSWR from 'swr';
import Confetti from 'react-confetti';

const fetcher = url => fetch(url).then(r => r.json());

export default function PaymentPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const { data } = useSWR(orderId ? `/api/order/status?orderId=${orderId}` : null, fetcher, { refreshInterval: 2000 });

  if (data?.status === 'PAID') {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <Confetti numberOfPieces={200} recycle={false}/>
        <h1 className="text-3xl font-bold text-green-400 mb-4">จ่ายเงินสำเร็จ!</h1>
        <div className="bg-black p-4 rounded text-2xl font-mono">{data.code || "TEST-CODE-1234"}</div>
        <button onClick={() => router.push('/')} className="mt-8 underline">กลับหน้าแรก</button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAY-${orderId}`} className="bg-white p-2 rounded mb-4"/>
      <p className="animate-pulse">กำลังรอการชำระเงิน...</p>
    </div>
  );
}