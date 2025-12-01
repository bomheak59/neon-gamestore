import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { images } = req.body; // รับ Array ของรูปภาพมา
  
  if (!images || images.length === 0) return res.status(200).json({ message: 'No images to delete' });

  try {
    // วนลูปเพื่อลบรูปทีละรูป
    const deletePromises = images.map(url => {
        // แกะ Public ID จาก URL (เช่น .../upload/v1234/sample.jpg -> sample)
        const parts = url.split('/');
        const fileName = parts[parts.length - 1];
        const publicId = fileName.split('.')[0]; 
        return cloudinary.uploader.destroy(publicId);
    });

    await Promise.all(deletePromises);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    res.status(500).json({ error: error.message });
  }
}