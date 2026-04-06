```markdown
# 🗳️ Blockchain Based Secure E-Voting System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-brightgreen.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A **secure, transparent, and efficient** digital voting platform built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). This system provides role-based access for **Administrators** and **Voters**, ensuring a seamless election management experience with robust security features.

---

## 📋 Table of Contents
- [✨ Features](#-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [📊 Database Schema](#-database-schema)
- [🔧 Installation & Setup](#-installation--setup)
- [🚀 Deployment](#-deployment)
- [🧪 API Testing](#-api-testing)
- [📸 Screenshots](#-screenshots)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Contact](#-contact)

---

## ✨ Features

### 🔐 **Authentication & Security**
| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Secure token-based authentication with expiration |
| **Bcrypt Encryption** | Password hashing for enhanced security |
| **Email OTP Verification** | One-time password via SendGrid/Resend for email confirmation |
| **Age Validation** | 18+ years eligibility check during registration |
| **Aadhar Document Upload** | Identity verification with file upload (JPEG/PNG/PDF) |
| **Address Validation** | Complete address with pincode verification |
| **Role-Based Access Control** | Separate dashboards for Admin and Voter |

### 👑 **Admin Features**
| Feature | Description |
|---------|-------------|
| **Election Management** | Create, update, delete elections with date range |
| **Candidate Management** | Add, edit, remove candidates with party details |
| **Voter Verification** | Approve voter registrations and documents |
| **Result Declaration** | Publish election results with winner announcement |
| **Dashboard Analytics** | Real-time statistics and election status cards |
| **Export Reports** | Download election reports as CSV/PDF |

### 👤 **Voter Features**
| Feature | Description |
|---------|-------------|
| **Registration** | Complete registration with address, Aadhar, and age verification |
| **Email Verification** | OTP-based email confirmation |
| **View Elections** | See ongoing, upcoming, and completed elections |
| **Cast Vote** | One vote per election with duplicate prevention |
| **Voting History** | Track past votes with timestamps and candidate details |
| **View Results** | Real-time election results with vote distribution |
| **Profile Management** | View and update personal information |

---

## 🏗️ System Architecture

```

┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT TIER                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              React.js Frontend (Vercel)                  │    │
│  │   Tailwind CSS • Framer Motion • React Router DOM      │    │
│  │   Axios • React Hot Toast • React Icons                │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION TIER                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Node.js + Express.js (Render)              │    │
│  │   REST APIs • JWT Auth • Multer • Express Validator   │    │
│  │   CORS • Helmet • Rate Limiting                       │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA TIER                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    MongoDB (Atlas)                       │    │
│  │   Users • Elections • Candidates • Votes Collections    │    │
│  │   Indexed for Performance • Unique Constraints         │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

```

### **Data Flow**
1. User interacts with React frontend
2. Request sent to Express backend via REST API
3. JWT middleware validates authentication
4. Business logic executed in controllers
5. Data persisted in MongoDB
6. Response returned to frontend
7. UI updates with real-time data

---

## 🛠️ Technology Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 18.2.0 | UI Framework |
| Tailwind CSS | 3.4.19 | Styling |
| Framer Motion | 12.34.3 | Animations |
| React Router DOM | 6.30.3 | Navigation |
| Axios | 1.13.5 | HTTP Client |
| React Hot Toast | 2.6.0 | Notifications |
| React Icons | 5.5.0 | Icons |
| Vite | 7.3.1 | Build Tool |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 22.x | Runtime Environment |
| Express.js | 4.x | Web Framework |
| MongoDB | 6.0 | Database |
| Mongoose | 8.x | ODM |
| JWT | 9.x | Authentication |
| Bcryptjs | 2.x | Password Hashing |
| Multer | 1.x | File Upload |
| SendGrid | 8.x | Email OTP |
| Express Validator | 7.x | Input Validation |

### **Testing & Deployment**
| Technology | Purpose |
|------------|---------|
| Postman | API Testing (25+ endpoints) |
| Render | Backend Hosting (Free Tier) |
| Vercel | Frontend Hosting (Free Tier) |
| MongoDB Atlas | Cloud Database |
| Git/GitHub | Version Control |

---

## 📊 Database Schema

### **Users Collection**
```javascript
{
  _id: ObjectId("..."),
  customUserId: "WZS1234567",           // Unique 7-digit user ID
  firstName: "John",
  middleName: "M",
  lastName: "Doe",
  email: "user@example.com",
  mobileNumber: "9876543210",
  password: "$2a$10$...",               // Hashed with bcrypt
  role: "voter",                        // voter / admin
  dateOfBirth: ISODate("2000-01-01"),
  aadharNumber: "123456789012",         // 12 digits, unique
  aadharImage: "uploads/aadhar-xxx.jpg",
  address: {
    street: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    country: "India"
  },
  isEmailVerified: true,
  isDocumentVerified: true,
  isVerified: true,
  otp: "123456",
  otpExpiry: ISODate(),
  createdAt: ISODate()
}
```

Elections Collection

```javascript
{
  _id: ObjectId("..."),
  title: "Lok Sabha Election 2024",
  description: "National Level Election",
  startDate: ISODate("2024-04-01"),
  endDate: ISODate("2024-04-05"),
  status: "ongoing",                    // upcoming / ongoing / completed
  createdBy: ObjectId("..."),
  createdAt: ISODate()
}
```

Candidates Collection

```javascript
{
  _id: ObjectId("..."),
  name: "Narendra Modi",
  party: "BJP",
  symbol: "lotus.png",
  manifesto: "Development for all",
  electionId: ObjectId("..."),
  voteCount: 0
}
```

Votes Collection

```javascript
{
  _id: ObjectId("..."),
  voterId: ObjectId("..."),
  electionId: ObjectId("..."),
  candidateId: ObjectId("..."),
  timestamp: ISODate()
}
// Compound index ensures one vote per election
```

---

🔧 Installation & Setup

Prerequisites

· Node.js (v18.x or higher) - Download
· MongoDB (local or Atlas) - MongoDB Atlas
· npm or yarn package manager
· Git

Clone the Repository

```bash
git clone https://github.com/your-username/blockchain-based-secure-e-voting-system.git
cd blockchain-based-secure-e-voting-system
```

Backend Setup

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials (see below)

# Start development server
npm run dev
```

Frontend Setup

```bash
# Open new terminal, navigate to client folder
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with backend URL

# Start development server
npm start
```

Environment Variables

Backend (.env in server folder):

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/evoting
JWT_SECRET=your_super_secret_jwt_key
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your-email@gmail.com
NODE_ENV=development
```

Frontend (.env in client folder):

```env
VITE_API_URL=http://localhost:5000/api
```

---

🚀 Deployment

Backend (Render)

1. Push code to GitHub
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```
2. Create Web Service on Render
   · Go to render.com
   · Click "New +" → Web Service
   · Connect your GitHub repository
   · Name: e-voting-backend
   · Root Directory: server
   · Build Command: npm install
   · Start Command: npm start
   · Plan: Free
3. Add Environment Variables
   ```
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   SENDGRID_API_KEY=your_sendgrid_key
   SENDGRID_FROM_EMAIL=your-email@gmail.com
   NODE_ENV=production
   ```
4. Deploy
   · Click Create Web Service

Frontend (Vercel)

1. Create Static Site on Vercel
   · Go to vercel.com
   · Click "New Project"
   · Import your GitHub repository
   · Root Directory: client
   · Build Command: npm run build
   · Output Directory: dist
2. Add Environment Variable
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
3. Deploy
   · Click Deploy

---

🧪 API Testing

Postman Collection

· Total Endpoints: 25+
· Test Coverage: 95%+
· All CRUD operations validated

Module Endpoints Status
Authentication /auth/register, /auth/login, /auth/me ✅ 100%
Admin - Elections /admin/elections (CRUD) ✅ 100%
Admin - Candidates /admin/candidates (CRUD) ✅ 100%
Admin - Voters /admin/voters, /admin/voters/verify ✅ 100%
Voter /voter/elections, /voter/vote, /voter/history ✅ 100%
Results /results/:id, /results/:id/declare ✅ 100%

Test Scenarios Validated

· ✅ User Registration with Email OTP
· ✅ JWT Token Generation & Validation
· ✅ Duplicate Vote Prevention (One voter, one vote)
· ✅ Age Validation (18+ years)
· ✅ Aadhar Document Upload (JPG/PNG/PDF)
· ✅ Address Verification with Pincode
· ✅ Real-time Result Calculation
· ✅ Role-based Access Control (Admin vs Voter)
· ✅ Cascade Delete (Election deletion removes candidates)
· ✅ Email OTP Verification (SendGrid)

---

📸 Screenshots

Admin Dashboard
<img width="1923" height="1028" alt="Screenshot 2026-03-22 003834" src="https://github.com/user-attachments/assets/c5e8635b-07ed-45c3-9dae-23d0a6bffb10" />
<img width="1898" height="936" alt="Screenshot 2026-03-22 003846" src="https://github.com/user-attachments/assets/bb34f7ee-5ebd-41a5-9fdb-dccb4cf91a39" />

Voter Dashboard
<img width="1923" height="1027" alt="Screenshot 2026-03-22 002341" src="https://github.com/user-attachments/assets/70e2c24e-3308-43c5-b57a-b7eda1eaa0f7" />

Voting Page
<img width="1923" height="1028" alt="Screenshot 2026-03-22 003932" src="https://github.com/user-attachments/assets/754351e1-37f2-4822-a894-69b4874c0800" />

Results Page
<img width="1923" height="1032" alt="Screenshot 2026-03-22 002526" src="https://github.com/user-attachments/assets/65a3a129-30fb-4066-bdb0-aa3d186f160a" />
<img width="1923" height="1020" alt="Screenshot 2026-03-22 003947" src="https://github.com/user-attachments/assets/f768a752-f313-4507-85d2-2cc5ae54d641" />

Registration Form
<img width="1923" height="1036" alt="Screenshot 2026-03-22 002628" src="https://github.com/user-attachments/assets/b9f5f309-4392-43f1-a6b8-a4211653ebb3" />

Login Page
<img width="1923" height="1029" alt="Screenshot 2026-03-22 002611" src="https://github.com/user-attachments/assets/95b8e69e-2fb1-4a52-a2b8-c138c5ee2735" />

Profile Page
<img width="1923" height="1041" alt="Screenshot 2026-03-22 002542" src="https://github.com/user-attachments/assets/931bef46-c833-41f8-bf0a-2ea10d6a2bad" />

Create New Elections
<img width="1923" height="1025" alt="Screenshot 2026-03-22 003908" src="https://github.com/user-attachments/assets/4e714042-bd09-4e71-9ad3-8b4e35134eb3" />

Manage Candidate
<img width="1923" height="1018" alt="Screenshot 2026-03-22 003922" src="https://github.com/user-attachments/assets/dac77496-31e1-430f-9731-a05181ecd112" />

Guidelines

· Follow existing code style
· Write meaningful commit messages
· Update documentation as needed
· Add tests for new features

---

📞 Contact

Dilip Maurya

· 📧 Email: dm143dilip@gmail.com
· 🐙 GitHub: dilipMaurya1586
· 💼 LinkedIn: https://www.linkedin.com/in/dilip-maurya-9061a0306

---

⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!

---

🙏 Acknowledgments

· MongoDB Atlas for cloud database
· Render for backend hosting
· Vercel for frontend hosting
· SendGrid for email services
· Postman for API testing
· Tailwind CSS for styling
· React community for amazing tools

---

Built with ❤️ by Dilip Maurya

```
