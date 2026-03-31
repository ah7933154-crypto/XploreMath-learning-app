require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const serverless = require('serverless-http');
const db = require('./database');

const app = express();
const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const dataDir = process.env.DATA_DIR || (isServerless ? '/tmp/data' : __dirname);
const uploadsDir = path.join(dataDir, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// create shared notes storage table
db.prepare(`
CREATE TABLE IF NOT EXISTS note_uploads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chapterId INTEGER,
  originalName TEXT,
  filename TEXT,
  url TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

// Middleware
app.use(cors({
  origin: [
    'https://xplore-math-learning-app.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.get('/api/notes', (req, res) => {
  const notes = db.prepare('SELECT * FROM note_uploads ORDER BY createdAt DESC').all();
  res.json(notes);
});

app.get('/api/notes/:chapterId', (req, res) => {
  const chapterId = Number(req.params.chapterId);
  const notes = db.prepare('SELECT * FROM note_uploads WHERE chapterId = ? ORDER BY createdAt DESC').all(chapterId);
  res.json(notes);
});

app.post('/api/notes/upload', upload.array('files'), (req, res) => {
  const { chapterId } = req.body;
  if (!chapterId) return res.status(400).json({ success: false, message: 'chapterId is required' });
  if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: 'No files uploaded' });

  const uploadedFiles = req.files.map((file) => {
    const url = `/uploads/${file.filename}`;
    db.prepare('INSERT INTO note_uploads (chapterId, originalName, filename, url) VALUES (?, ?, ?, ?)')
      .run(chapterId, file.originalname, file.filename, url);
    return {
      chapterId: Number(chapterId),
      originalName: file.originalname,
      filename: file.filename,
      url,
    };
  });

  res.json({ success: true, uploaded: uploadedFiles });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = isServerless ? serverless(app) : app;
