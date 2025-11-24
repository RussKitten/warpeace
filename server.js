import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Эндпоинт для загрузки PDF на Vercel Blob
app.post('/api/upload-pdf', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'https://wh2xlwnl38lxadpd.public.blob.vercel-storage.com/text.pdf'); // Путь к вашему PDF-файлу
    const fileBlob = fs.readFileSync(filePath);

    const blob = await put(`pdfs/text.pdf`, fileBlob, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN, // Токен для доступа к Vercel Blob
    });

    res.json({ url: blob.url });
  } catch (error) {
    console.error('Ошибка при загрузке PDF:', error);
    res.status(500).json({ error: 'Не удалось загрузить PDF' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
