import express from 'express';
import pool from '../db.js';
import upload from '../middleware/validateFile.js';
import dropbox, { getDropboxFilePath } from '../utils/dropboxClient.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  const customerCode = req.body.customer_code?.trim();
  const sendToCA = req.body.send_to_ca === 'true' || req.body.send_to_ca === true;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'File upload is required' });
  }
  if (!customerCode) {
    return res.status(400).json({ error: 'Customer code is required' });
  }

  // For testing without database
  if (!pool) {
    const validCodes = ['CUST1001', 'CUST1002'];
    if (!validCodes.includes(customerCode)) {
      return res.status(400).json({ error: 'Invalid customer code (offline mode)' });
    }

    return res.json({
      fileName: file.originalname,
      customerCode,
      sentToCA,
      dropboxPath: `offline/${req.user.email}/${customerCode}/${file.originalname}`,
      message: 'Upload completed successfully (offline mode - no actual upload)'
    });
  }

  const [codeRows] = await pool.execute(
    'SELECT id, status FROM customer_codes WHERE customer_code = ?',
    [customerCode]
  );

  if (!codeRows.length || codeRows[0].status !== 'active') {
    return res.status(400).json({ error: 'Invalid or inactive customer code' });
  }

  const dropboxPath = getDropboxFilePath(req.user.email, customerCode, file.originalname);

  try {
    const uploadResult = await dropbox.filesUpload({
      path: dropboxPath,
      contents: file.buffer,
      autorename: true
    });

    const filePath = uploadResult?.result?.path_display ?? uploadResult?.result?.path_lower ?? dropboxPath;

    await pool.execute(
      'INSERT INTO documents (user_id, customer_code, dropbox_path, sent_to_ca) VALUES (?, ?, ?, ?)',
      [req.user.id, customerCode, filePath, sendToCA ? 1 : 0]
    );

    return res.json({
      fileName: file.originalname,
      customerCode,
      sentToCA,
      dropboxPath: filePath,
      message: 'Upload completed successfully'
    });
  } catch (error) {
    console.error('Dropbox upload error:', error);
    return res.status(500).json({ error: 'Failed to upload file to Dropbox' });
  }
});

router.get('/user', authenticateToken, async (req, res) => {
  // For testing without database
  if (!pool) {
    return res.json([
      {
        id: 1,
        customer_code: 'CUST1001',
        dropbox_path: 'offline/user@example.com/CUST1001/sample.pdf',
        sent_to_ca: false,
        created_at: new Date().toISOString()
      }
    ]);
  }

  const [rows] = await pool.execute(
    'SELECT id, customer_code, dropbox_path, sent_to_ca, created_at FROM documents WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.id]
  );
  return res.json(rows.map((row) => ({
    id: row.id,
    customer_code: row.customer_code,
    dropbox_path: row.dropbox_path,
    sent_to_ca: Boolean(row.sent_to_ca),
    created_at: row.created_at
  })));
});

router.get('/ca', authenticateToken, authorizeRoles('admin', 'ca_officer'), async (req, res) => {
  // For testing without database
  if (!pool) {
    return res.json([
      {
        id: 1,
        customer_code: 'CUST1001',
        dropbox_path: 'offline/user@example.com/CUST1001/sample.pdf',
        sent_to_ca: true,
        created_at: new Date().toISOString(),
        user_name: 'Demo User',
        user_email: 'user@example.com'
      }
    ]);
  }

  const [rows] = await pool.execute(
    `SELECT d.id, d.customer_code, d.dropbox_path, d.sent_to_ca, d.created_at, u.name AS user_name, u.email AS user_email
     FROM documents d
     JOIN users u ON u.id = d.user_id
     ORDER BY d.created_at DESC`,
    []
  );
  return res.json(rows.map((row) => ({
    id: row.id,
    customer_code: row.customer_code,
    dropbox_path: row.dropbox_path,
    sent_to_ca: Boolean(row.sent_to_ca),
    created_at: row.created_at,
    user_name: row.user_name,
    user_email: row.user_email
  })));
});

router.get('/download/:id', authenticateToken, authorizeRoles('admin', 'ca_officer'), async (req, res) => {
  const documentId = Number(req.params.id);
  if (!documentId) {
    return res.status(400).json({ error: 'Invalid document ID' });
  }

  // For testing without database
  if (!pool) {
    return res.json({ downloadUrl: 'https://example.com/download/offline-file.pdf' });
  }

  const [rows] = await pool.execute('SELECT dropbox_path FROM documents WHERE id = ?', [documentId]);
  if (!rows.length) {
    return res.status(404).json({ error: 'Document not found' });
  }

  try {
    const linkResponse = await dropbox.sharingCreateSharedLinkWithSettings({
      path: rows[0].dropbox_path
    });

    const downloadUrl = linkResponse?.result?.url?.replace('?dl=0', '?dl=1');
    return res.json({ downloadUrl });
  } catch (error) {
    console.error('Dropbox shared link error:', error);
    return res.status(500).json({ error: 'Unable to create shared download link' });
  }
});

export default router;
