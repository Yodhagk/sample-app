# Sample Hostinger Document Management App

This repository contains a React + Vite frontend and an Express + Node.js backend with MySQL and Dropbox integration.

## Architecture overview

- `backend/` - Express API server with JWT authentication, file validation, Dropbox upload, and MySQL persistence.
- `frontend/` - React app with login, document upload, preview, user dashboard, and CA officer dashboard.
- `backend/schema.sql` - SQL schema and seed data for users, customer codes, and document tables.
- `DEPLOYMENT_HOSTINGER.md` - Hostinger deployment steps.

## Quick start

1. Copy environment variables:
   - `backend/.env.example` → `backend/.env`
   - `frontend/.env.example` → `frontend/.env`

2. Install dependencies:
   - `cd backend && npm install`
   - `cd frontend && npm install`

3. Run backend:
   - `cd backend && npm run dev`

4. Run frontend:
   - `cd frontend && npm run dev`

## Demo credentials

- User: `user@example.com` / `Password123!`
- CA Officer: `ca@example.com` / `Password123!`

## Notes

- The app serves the frontend from `frontend/dist` when the backend is started and build files are present.
- Dropbox folders are created automatically under `/AppName/{user}/{customerCode}`.
- The frontend can also be deployed as a static SPA on InfinityFree, but the backend must still run on a Node-compatible host.
