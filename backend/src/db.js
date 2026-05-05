import mysql from 'mysql2/promise';
import config from './config.js';

let pool;

try {
  pool = mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: 'Z',
    connectTimeout: 5000
  });

  // Test the connection
  await pool.execute('SELECT 1');
  console.log('Database connection pool created and tested');
} catch (error) {
  console.warn('Database connection failed, running in offline mode:', error.message);
  pool = null;
}

export default pool;
