const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.post('/image', authenticate, authorizeAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Изберете слика.' });
  }
  const url = `/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

module.exports = router;
