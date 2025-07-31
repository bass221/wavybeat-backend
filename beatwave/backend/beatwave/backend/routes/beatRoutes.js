const express = require('express');
const multer = require('multer');
const path = require('path');
const Beat = require('../models/Beat');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Check Admin Middleware
function checkAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
}

// ✅ Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const allowedMimeTypes = [
  'audio/mpeg', 'audio/wav', 'audio/mp3',
  'image/jpeg', 'image/png', 'image/jpg',
  'application/zip', 'application/x-zip-compressed',
  'application/x-rar-compressed', 'application/vnd.rar',
  'application/x-7z-compressed', 'application/octet-stream',
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type'), false);
};

const upload = multer({ storage, fileFilter });


// ✅ POST /api/beats/upload — Upload a new beat (Admin only)
router.post(
  '/upload',
  verifyToken,
  checkAdmin,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'zip', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, genre, price } = req.body;
      const audio = req.files.audio?.[0];
      const image = req.files.image?.[0];
      const zip = req.files.zip?.[0];

      if (!audio) return res.status(400).json({ error: 'Audio file is required' });

      const newBeat = new Beat({
        title,
        genre,
        price,
        filePath: audio.path,
        imagePath: image?.path || null,
        zipPath: zip?.path || null,
      });

      await newBeat.save();
      res.status(201).json(newBeat);
    } catch (err) {
      console.error('❌ Upload failed:', err.message);
      res.status(500).json({ error: 'Server error: ' + err.message });
    }
  }
);


// ✅ GET /api/beats — Fetch all beats (public)
router.get('/', async (req, res) => {
  try {
    const beats = await Beat.find();
    res.json(beats);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ DELETE /api/beats/:id — Delete a beat (Admin only)
router.delete('/:id', verifyToken, checkAdmin, async (req, res) => {
  try {
    const deleted = await Beat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Beat not found' });
    res.json({ message: 'Beat deleted successfully' });
  } catch (err) {
    console.error('❌ Delete failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ PUT /api/beats/:id — Update a beat (Admin only)
router.put('/:id', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { title, genre, price } = req.body;
    const updated = await Beat.findByIdAndUpdate(
      req.params.id,
      { title, genre, price },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Beat not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Update failed:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
