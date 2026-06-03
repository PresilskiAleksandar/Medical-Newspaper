const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const categoryRoutes = require('./routes/categories');
const commentRoutes = require('./routes/comments');
const favoriteRoutes = require('./routes/favorites');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', async (req, res) => {
  try {
    const db = require('./config/db');
    const result = await db.query('SELECT NOW()');
    const count = await db.query('SELECT COUNT(*) as c FROM articles');
    res.json({ status: 'ok', db: result.rows[0].now, articles: count.rows[0].c });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message, stack: e.stack });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Внатрешна грешка на серверот.',
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Рутата не е пронајдена.' });
});

module.exports = app;
