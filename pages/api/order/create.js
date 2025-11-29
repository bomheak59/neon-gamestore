import prisma from '@/lib/prisma';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { productId, contact, userInput } = req.body;
  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error('Product not found');
    const order = await prisma.order.create({
      data: {
        contactChannel: contact.type,
        contactValue: contact.value,
        status: 'PENDING',
        totalAmount: product.price,
        orderItems: { create: { productId: product.id, userInput: userInput?.uid || '' } }
      }
    });
    res.status(200).json({ orderId: order.id });
  } catch (error) { res.status(500).json({ error: error.message }); }
}