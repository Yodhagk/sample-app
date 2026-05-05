# ✅ FULL BUILD PROMPT – WEB APP WITH LOGIN, DOCUMENT UPLOAD, PREVIEW & DROPBOX INTEGRATION

## 🔹 ROLE

You are a **senior full-stack engineer + DevOps engineer**.  
Your task is to **design, develop, secure, and deploy** a **production-ready web application** on **Hostinger hosting**.

## 🔹 OBJECTIVE

Build a **secure web application** with:

*   User login & authentication
*   User dashboard
*   Document upload with live preview
*   Dropbox storage (user-wise folders)
*   Customer code verification during upload
*   Checkbox option to send documents to CA Officer
*   Deployment on **Hostinger**

## 🔹 TECH STACK (MANDATORY)

*   **Frontend:** React (Vite or Next.js)
*   **Backend:** Node.js + Express
*   **Database:** MySQL (Hostinger compatible)
*   **Authentication:** JWT + bcrypt
*   **Storage:** Dropbox API
*   **Hosting:** Hostinger (shared / VPS)
*   **UI:** Responsive, clean dashboard layout

## 🔹 CORE FEATURES & REQUIREMENTS

### 1️⃣ Authentication System

*   Login page
*   Secure JWT-based authentication
*   Password hashing (bcrypt)
*   Role: `User`, `Admin/CA Officer`

### 2️⃣ User Dashboard Layout

Split screen / two panels:

#### 🔹 Left Panel – Upload Section

*   File upload (PDF, JPG, PNG, DOC)
*   Input field: **Customer Code**
*   ✅ Real-time validation of Customer Code
*   Checkbox: **“Send to CA Officer”**
*   Upload button
*   Success & error messages

#### 🔹 Right Panel – Document Preview

*   Preview uploaded document instantly
*   Show:
    *   File name
    *   Upload date
    *   Customer code
    *   Status (Uploaded / Sent to CA)

### 3️⃣ Dropbox Integration (CRITICAL)

*   Each user gets **automatic folder creation**
*   Folder structure:

    Dropbox/
     └── AppName/
         └── UserID_or_Email/
             └── CustomerCode/
                 └── UploadedFiles

*   Upload files directly to Dropbox on submit
*   Store Dropbox file path in database
*   Handle API errors gracefully

### 4️⃣ Customer Code Verification

*   Customer Code must:
    *   Exist in database
    *   Be active
*   Block upload if invalid
*   Show inline validation message

### 5️⃣ CA Officer Notification

If checkbox is checked:

*   Mark file as **“Sent to CA”**
*   Notify CA Officer (email or dashboard queue)
*   CA Officer dashboard to:
    *   View documents
    *   Download files
    *   See customer code & user details

## 🔹 DATABASE SCHEMA (MINIMUM)

### Users Table

*   id
*   name
*   email
*   password
*   role

### Customer Codes Table

*   id
*   customer_code
*   status

### Documents Table

*   id
*   user_id
*   customer_code
*   dropbox_path
*   sent_to_ca (boolean)
*   created_at

## 🔹 SECURITY REQUIREMENTS

*   Input validation (frontend + backend)
*   File size & type validation
*   JWT protected routes
*   Environment variables for secrets
*   Dropbox API key security
*   SQL injection protection

## 🔹 DEPLOYMENT REQUIREMENTS (HOSTINGER)

*   Configure backend on Hostinger
*   Set up MySQL DB
*   Configure environment variables
*   Build frontend and serve via Hostinger
*   Enable HTTPS
*   Provide deployment steps

## 🔹 DELIVERABLES

✅ Complete source code  
✅ Database schema SQL  
✅ Dropbox integration code  
✅ Deployment guide for Hostinger  
✅ `.env` variable list  
✅ Admin/CA dashboard

## 🔹 BONUS (IF POSSIBLE)

*   Activity logs
*   Upload progress bar
*   Search/filter documents
*   Mobile responsive UI

## 🔹 OUTPUT FORMAT REQUIRED

1.  Architecture overview
2.  Folder structure
3.  Backend API routes
4.  Frontend components
5.  Dropbox integration code
6.  Deployment steps for Hostinger

## 🔹 FINAL GOAL

A **secure, scalable, production-ready document management web app** deployed on **Hostinger**, ready for real users.
