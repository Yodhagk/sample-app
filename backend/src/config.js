import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = [
  'JWT_SECRET',
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'DROPBOX_ACCESS_TOKEN',
  'DROPBOX_APP_FOLDER'
];

for (const name of requiredEnv) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

export default {
  PORT: process.env.PORT ?? 4000,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DROPBOX_ACCESS_TOKEN: process.env.DROPBOX_ACCESS_TOKEN,
  DROPBOX_APP_FOLDER: process.env.DROPBOX_APP_FOLDER,
  NODE_ENV: process.env.NODE_ENV ?? 'development'
};
