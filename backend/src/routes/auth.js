import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import config from '../config.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // For testing without database
  if (!pool) {
    if (email === 'user@example.com' && password === 'Password123!') {
      const token = jwt.sign(
        { id: 1, email: 'user@example.com', role: 'user', name: 'Demo User' },
        config.JWT_SECRET,
        { expiresIn: '8h' }
      );
      return res.json({
        token,
        user: {
          id: 1,
          name: 'Demo User',
          email: 'user@example.com',
          role: 'user'
        }
      });
    }
    return res.status(401).json({ error: 'Invalid credentials (database offline)' });
  }

  const [rows] = await pool.execute(
    'SELECT id, name, email, password, role FROM users WHERE email = ?',
    [email]
  );

  if (!rows.length) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const user = rows[0];
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    config.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

export default router;
