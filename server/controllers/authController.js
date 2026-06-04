const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const SAFE_USER_COLS = 'id, full_name, email, role, created_at';

const safeUser = (row) => ({
  id: row.id,
  full_name: row.full_name,
  email: row.email,
  role: row.role,
  created_at: row.created_at,
});

exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'Сите полиња се задолжителни.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Лозинката мора да има најмалку 6 карактери.' });
    }

    const existingUser = await db.query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Корисникот со оваа адреса веќе постои.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING ${SAFE_USER_COLS}`,
      [full_name, email, hashedPassword, 'reader']
    );

    const user = safeUser(result.rows[0]);
    const token = jwt.sign(
      { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Емаил и лозинка се задолжителни.' });
    }

    const result = await db.query(`SELECT ${SAFE_USER_COLS}, password FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Невалиден емаил или лозинка.' });
    }

    const userRow = result.rows[0];
    const isMatch = await bcrypt.compare(password, userRow.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Невалиден емаил или лозинка.' });
    }

    const { password: _, ...safeData } = userRow;
    const user = safeUser(safeData);
    const token = jwt.sign(
      { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT ${SAFE_USER_COLS} FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Корисникот не е пронајден.' });
    }

    res.json(safeUser(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};
