# Hostinger Deployment Guide

This guide explains how to deploy the document upload app on Hostinger using a Node.js-friendly environment.

## 1. Choose the Hostinger plan

Recommended options:

- Hostinger VPS (best)
- Hostinger Business Shared Hosting with Node.js support

## 2. Prepare MySQL database

1. Create a MySQL database in Hostinger control panel.
2. Create a dedicated DB user and set a strong password.
3. Import `backend/schema.sql` via phpMyAdmin or the Hostinger MySQL import tool.

## 3. Configure environment variables

Create a `.env` file in the `backend/` folder with:

```env
PORT=4000
CLIENT_ORIGIN=https://your-domain.com
JWT_SECRET=replace_with_a_secure_random_secret
DB_HOST=your_hostinger_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DROPBOX_ACCESS_TOKEN=replace_with_your_dropbox_token
DROPBOX_APP_FOLDER=AppName
```

Also configure frontend variables in `frontend/.env`:

```env
VITE_API_URL=https://your-domain.com/api
```

> On Hostinger VPS, you can run the backend from the root project folder or a deployed folder. On shared hosting, use the Node.js app manager if available.

## 4. Build the frontend

From the repo root:

```bash
cd frontend
npm install
npm run build
```

Then copy the output from `frontend/dist` to the server location where the backend can serve it.

### 4.1 Static deployment to InfinityFree

InfinityFree supports static hosting only, not Node.js. That means:

- You can deploy the built frontend from `frontend/dist` to InfinityFree.
- You must host the backend on another Node-compatible provider (Hostinger VPS, Render, Railway, Fly, etc.).
- Set `VITE_API_URL=https://your-backend-domain.com/api` in `frontend/.env` before building.
- Upload the contents of `frontend/dist` to InfinityFree `htdocs`.
- The app includes `frontend/public/.htaccess` to support SPA routing on Apache.

## 5. Install backend dependencies

```bash
cd backend
npm install
```

## 6. Deploy the backend

If using Hostinger VPS:

```bash
cd /path/to/sample-app/backend
npm install
npm start
```

If using Hostinger shared hosting with Node.js support:

- Use the Node.js app wizard.
- Configure the startup script as `node backend/src/index.js`.
- Set the working directory to the project root.

## 7. Configure HTTPS

- Use Hostinger control panel to enable HTTPS for your domain.
- If the Node.js app manager supports it, attach a valid SSL certificate.
- If using a reverse proxy, ensure traffic is forwarded to the app port.

## 8. Verify deployment

- Visit `https://your-domain.com`.
- Login at `/login`.
- Upload a file.
- Validate customer code and deliver files to Dropbox.

## 9. Additional production hardening

- Use a strong `JWT_SECRET`.
- Keep `DROPBOX_ACCESS_TOKEN` private.
- Enable appropriate CORS/HTTPS rules.
- Set `NODE_ENV=production`.
- Monitor logs for failed uploads.

## 10. Optional improvements

- Add an email notification workflow for CA officer alerts.
- Use a managed MySQL instance or Hostinger database cluster.
- Add logging or analytics for uploads.
