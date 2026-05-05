import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/validate', authenticateToken, async (req, res) => {
  const code = req.query.code?.trim();
  if (!code) {
    return res.status(400).json({ valid: false, message: 'Customer code is required' });
  }

  // For testing without database
  if (!pool) {
    const validCodes = ['CUST1001', 'CUST1002'];
    if (validCodes.includes(code)) {
      return res.json({ valid: true, message: 'Customer code is valid (offline mode)' });
    }
    return res.json({ valid: false, message: 'Invalid customer code (offline mode)' });
  }

  const [rows] = await pool.execute(
    'SELECT id, status FROM customer_codes WHERE customer_code = ?',
    [code]
  );

  if (!rows.length || rows[0].status !== 'active') {
    return res.json({ valid: false, message: 'Invalid or inactive customer code' });
  }

  return res.json({ valid: true, message: 'Customer code is valid' });
});

export default router;
