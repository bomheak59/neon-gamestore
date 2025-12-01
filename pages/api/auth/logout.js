export default function handler(req, res) {
  // ล้าง Cookie โดยตั้งเวลาหมดอายุทันที
  res.setHeader(
    'Set-Cookie',
    'admin_token=; Path=/; HttpOnly; Max-Age=0;'
  );
  res.status(200).json({ success: true });
}