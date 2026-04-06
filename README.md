<div align="center">

<img src="https://img.shields.io/badge/SECURE-E--VOTING%20SYSTEM-1a1a2e?style=for-the-badge&labelColor=0f3460&color=e94560" alt="Project Title" />

<br/>
<br/>

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=black)](https://render.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](https://opensource.org/licenses/MIT)

<br/>

**A secure, transparent, and efficient digital voting platform built with the MERN stack.**
Role-based access for Administrators and Voters with JWT authentication, OTP verification, and real-time results.

<br/>

[View Demo](https://secure-e-voting-system-phi.vercel.app) &nbsp;&bull;&nbsp; [Report Bug](https://github.com/dilipMaurya1586/Secure-E-Voting-System/issues) &nbsp;&bull;&nbsp; [API Docs](#-api-endpoints)

</div>

---

## Demo Access

> Live deployment available at: **[secure-e-voting-system-phi.vercel.app](https://secure-e-voting-system-phi.vercel.app)**

<table>
<tr>
<th align="center">Role</th>
<th align="center">Email</th>
<th align="center">Password</th>
</tr>
<tr>
<td align="center"><strong>Voter</strong></td>
<td><code>dm143dilip@gmail.com</code></td>
<td><code>Dilip@123456</code></td>
</tr>
<tr>
<td align="center"><strong>Admin</strong></td>
<td><code>mauryadilip.work@gmail.com</code></td>
<td><code>Kumar@123456</code></td>
</tr>
</table>

> **Note:** Backend is hosted on Render Free Tier. First request may take 30-50 seconds to wake up.

---

## Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Installation & Setup](#-installation--setup)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contact](#-contact)

---

## Overview

The **Secure E-Voting System** is a full-stack digital voting platform that ensures election integrity through robust authentication, document verification, and duplicate vote prevention. Built to handle the complete election lifecycle — from voter registration to result declaration.

**Key Highlights:**
- 25+ REST API endpoints tested with Postman (95%+ coverage)
- JWT-based authentication with role separation
- Email OTP verification via SendGrid
- Aadhar document upload & admin verification
- One vote per election enforced at database level
- Real-time vote counts and result declaration

---

## Features

### Authentication & Security

| Feature | Description |
|---|---|
| JWT Authentication | Secure token-based auth with expiration |
| Bcrypt Password Hashing | Industry-standard password encryption |
| Email OTP Verification | One-time password via SendGrid for email confirmation |
| Age Validation | 18+ eligibility check at registration |
| Aadhar Document Upload | Identity verification with JPG/PNG/PDF support |
| Role-Based Access Control | Separate Admin and Voter dashboards |

### Admin Panel

| Feature | Description |
|---|---|
| Election Management | Create, update, and delete elections with date ranges |
| Candidate Management | Add and manage candidates with party details |
| Voter Verification | Approve registrations and verify uploaded documents |
| Result Declaration | Publish results with automatic winner announcement |
| Dashboard Analytics | Real-time statistics and election status overview |

### Voter Portal

| Feature | Description |
|---|---|
| Secure Registration | Full registration with Aadhar, address, and age verification |
| Election Browsing | View ongoing, upcoming, and completed elections |
| Vote Casting | One vote per election with duplicate prevention |
| Voting History | Full audit trail with timestamps and candidate details |
| Live Results | Real-time result viewing with vote distribution |

---

## System Architecture

```
┌──────────────────────────────────────────────┐
│              CLIENT TIER                      │
│   React.js + Vite (Deployed on Vercel)       │
│   Tailwind CSS  |  Axios  |  React Router    │
└─────────────────────┬────────────────────────┘
                      │ HTTPS / REST API
┌─────────────────────▼────────────────────────┐
│            APPLICATION TIER                   │
│   Node.js + Express.js (Deployed on Render)  │
│   JWT Auth  |  Multer  |  CORS  |  Helmet   │
└─────────────────────┬────────────────────────┘
                      │ Mongoose ODM
┌─────────────────────▼────────────────────────┐
│               DATA TIER                       │
│         MongoDB Atlas (Cloud)                 │
│   Users | Elections | Candidates | Votes     │
└──────────────────────────────────────────────┘
```

**Request Flow:**
1. User action triggers Axios request from React frontend
2. Express middleware validates JWT token
3. Controller executes business logic
4. Mongoose persists / queries MongoDB Atlas
5. JSON response returned and UI updates

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React.js | 18.2.0 | UI Framework |
| Vite | 7.3.1 | Build Tool |
| Tailwind CSS | 3.4.19 | Styling |
| Framer Motion | 12.34.3 | Animations |
| React Router DOM | 6.30.3 | Client-side Routing |
| Axios | 1.13.5 | HTTP Client |
| React Hot Toast | 2.6.0 | Notifications |
| React Icons | 5.5.0 | Icon Library |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 22.x | Runtime Environment |
| Express.js | 4.x | Web Framework |
| MongoDB | 6.0 | NoSQL Database |
| Mongoose | 8.x | ODM Layer |
| JSON Web Token | 9.x | Authentication |
| Bcryptjs | 2.x | Password Hashing |
| Multer | 1.x | File Uploads |
| SendGrid | 8.x | Email OTP Service |
| Express Validator | 7.x | Input Validation |

### Infrastructure & Tools

| Tool | Purpose |
|---|---|
| MongoDB Atlas | Cloud-hosted Database |
| Render | Backend Hosting |
| Vercel | Frontend Hosting |
| Postman | API Testing (25+ endpoints) |
| GitHub | Version Control |

---

## Database Schema

<details>
<summary><strong>Users Collection</strong></summary>

```javascript
{
  _id: ObjectId,
  customUserId: "WZS1234567",       // Auto-generated unique ID
  firstName: "John",
  middleName: "M",
  lastName: "Doe",
  email: "user@example.com",        // Unique
  mobileNumber: "9876543210",
  password: "$2a$10$...",           // Bcrypt hashed
  role: "voter",                    // "voter" | "admin"
  dateOfBirth: ISODate,
  aadharNumber: "123456789012",     // 12 digits, unique
  aadharImage: "uploads/xxx.jpg",
  address: {
    street, city, state,
    pincode, country
  },
  isEmailVerified: Boolean,
  isDocumentVerified: Boolean,
  isVerified: Boolean,
  otp: String,
  otpExpiry: ISODate,
  createdAt: ISODate
}
```
</details>

<details>
<summary><strong>Elections Collection</strong></summary>

```javascript
{
  _id: ObjectId,
  title: "Lok Sabha Election 2024",
  description: "National Level Election",
  startDate: ISODate,
  endDate: ISODate,
  status: "ongoing",               // "upcoming" | "ongoing" | "completed"
  createdBy: ObjectId,             // Ref: Users
  createdAt: ISODate
}
```
</details>

<details>
<summary><strong>Candidates Collection</strong></summary>

```javascript
{
  _id: ObjectId,
  name: "Candidate Name",
  party: "Party Name",
  symbol: "symbol.png",
  manifesto: "Description",
  electionId: ObjectId,            // Ref: Elections
  voteCount: Number
}
```
</details>

<details>
<summary><strong>Votes Collection</strong></summary>

```javascript
{
  _id: ObjectId,
  voterId: ObjectId,               // Ref: Users
  electionId: ObjectId,            // Ref: Elections
  candidateId: ObjectId,           // Ref: Candidates
  timestamp: ISODate
}
// Compound index on (voterId, electionId) — enforces one vote per election
```
</details>

---

## API Endpoints

| Module | Endpoint | Method | Auth |
|---|---|---|---|
| Auth | `/api/auth/register` | POST | Public |
| Auth | `/api/auth/login` | POST | Public |
| Auth | `/api/auth/me` | GET | Voter/Admin |
| Auth | `/api/auth/verify-otp` | POST | Public |
| Admin | `/api/admin/elections` | GET, POST | Admin |
| Admin | `/api/admin/elections/:id` | PUT, DELETE | Admin |
| Admin | `/api/admin/candidates` | GET, POST | Admin |
| Admin | `/api/admin/candidates/:id` | PUT, DELETE | Admin |
| Admin | `/api/admin/voters` | GET | Admin |
| Admin | `/api/admin/voters/verify` | PUT | Admin |
| Voter | `/api/voter/elections` | GET | Voter |
| Voter | `/api/voter/vote` | POST | Voter |
| Voter | `/api/voter/history` | GET | Voter |
| Results | `/api/results/:id` | GET | Public |
| Results | `/api/results/:id/declare` | PUT | Admin |

> Full Postman collection available on request.

---

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18.x or higher
- [MongoDB Atlas](https://www.mongodb.com/atlas) account or local MongoDB
- [SendGrid](https://sendgrid.com/) API key for email OTP
- Git

### Clone Repository

```bash
git clone https://github.com/dilipMaurya1586/Secure-E-Voting-System.git
cd Secure-E-Voting-System
```

### Backend Setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/evoting
JWT_SECRET=your_super_secret_jwt_key
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your-verified@email.com
NODE_ENV=development
```

```bash
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
# Frontend runs on http://localhost:5173
```

---

## Deployment

### Backend — Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
5. Add Environment Variables (same as `.env` above, with `NODE_ENV=production`)
6. Click **Deploy**

### Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Configure:
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
5. Click **Deploy**

---

## Screenshots

### Admin Panel

| Dashboard | Election Management |
|---|---|
| ![Dashboard](https://github.com/user-attachments/assets/8a13acdd-bce7-474b-b783-9fc1a7b2ee3e) | ![Elections](https://github.com/user-attachments/assets/fa27a9dd-f8b8-4cd4-aadf-d6e9880dcb5e) |

| Candidate Management | Voter Verification |
|---|---|
| ![Candidates](https://github.com/user-attachments/assets/4c4d23aa-0595-4ec8-97c4-0ab4da3876b0) | ![Voters](https://github.com/user-attachments/assets/643f9cce-b568-4a29-9905-28ed8d6a23fa) |

### Voter Portal

| Home | Elections |
|---|---|
| ![Home](https://github.com/user-attachments/assets/2477dcff-c4a9-42f2-b86c-353877c9e76f) | ![Elections](https://github.com/user-attachments/assets/30d9cff4-601b-4be6-9b0d-1c2006a3437c) |

| Voting | Results |
|---|---|
| ![Vote](https://github.com/user-attachments/assets/a995206d-118a-40f1-a6d9-a20de8e98c57) | ![Results](https://github.com/user-attachments/assets/b682e8d6-8711-4ab1-9e84-41a1c0e18727) |

---

## Contact

**Dilip Maurya** — Final Year B.E. Computer Engineering

[![Email](https://img.shields.io/badge/Email-dm143dilip@gmail.com-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:dm143dilip@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-dilipMaurya1586-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/dilipMaurya1586)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-dilip--maurya-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/dilip-maurya-9061a0306)

---

<div align="center">

If this project helped you, please consider giving it a star on GitHub.

[![GitHub Stars](https://img.shields.io/github/stars/dilipMaurya1586/Secure-E-Voting-System?style=social)](https://github.com/dilipMaurya1586/Secure-E-Voting-System)

**Built with dedication by Dilip Maurya**

</div>
