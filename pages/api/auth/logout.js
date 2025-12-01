export default function handler(req, res) {
  // ลบ Cookie โดยการตั้งเวลาให้หมดอายุทันที
  res.setHeader(
    'Set-Cookie',
    'admin_token=; Path=/; HttpOnly; Max-Age=0;'
  );
  res.status(200).json({ success: true });
}