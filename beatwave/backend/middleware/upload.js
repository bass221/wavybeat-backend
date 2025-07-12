const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const finalName = `${Date.now()}-${safeName}`;
    cb(null, finalName);
  },
});

const upload = multer({ storage: storage }).fields([
  { name: 'audio', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'zip', maxCount: 1 },
]);

module.exports = upload;
