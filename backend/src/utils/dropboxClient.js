import fetch from 'node-fetch';
import { Dropbox } from 'dropbox';
import config from '../config.js';

const dropbox = new Dropbox({ accessToken: config.DROPBOX_ACCESS_TOKEN, fetch });

export function getDropboxFilePath(userEmail, customerCode, filename) {
  const safeEmail = userEmail.replace(/[^a-zA-Z0-9@._-]/g, '_');
  const safeCode = customerCode.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `/${config.DROPBOX_APP_FOLDER}/${safeEmail}/${safeCode}/${Date.now()}-${safeFilename}`;
}

export default dropbox;
