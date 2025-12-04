import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const { method } = req;
  const { id, name, imageUrl, isRecommended } = req.body;

  try {
    if (method === 'POST') {
      // สร้างหมวดหมู่ใหม่
      await prisma.category.create({
        data: { name, imageUrl, isRecommended: isRecommended || false }
      });
      return res.status(200).json({ success: true });
    } 
    
    if (method === 'PUT') {
      // แก้ไขหมวดหมู่
      await prisma.category.update({
        where: { id },
        data: { name, imageUrl, isRecommended }
      });
      return res.status(200).json({ success: true });
    }

    if (method === 'DELETE') {
      // ลบหมวดหมู่
      await prisma.category.delete({ where: { id } });
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}