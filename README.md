# 🩺 Health Analysis Web App

A full-stack healthcare simulation platform built using the **MERN Stack**. This application allows users to securely track health metrics, receive simulated AI-based analysis, and visualize their wellness trends over time.

---

## 🚀 Features

### 🔐 Authentication
- Secure user **Signup & Login**
- Password hashing using `bcryptjs`
- JWT-based authentication
- Protected routes for user data security

### 📝 Health Analysis Form
- Collects user inputs:
  - Sleep Quality
  - Appetite
  - Stress Levels
  - Activity Types
- Backend processes data to generate:
  - Health score
  - Personalized recommendations (mock AI)

### 📊 Dashboard
- Interactive charts using **Chart.js**
  - Pie charts
  - Bar graphs
- Real-time health insights
- Easy-to-understand visual feedback

### 📜 Health History
- Stores previous submissions
- Tracks health trends over time
- Helps users monitor improvements

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- Chart.js

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt.js

---

## 📁 Project Structure

root/
├── frontend/
│   ├── src/
│   │   ├── components/   
│   │   ├── pages/        
│   │   ├── api/          
│   │   └── App.jsx
│   └── ...
│
├── backend/
│   ├── models/           
│   ├── routes/           
│   ├── controllers/      
│   ├── middleware/       
│   ├── config/           
│   └── server.js         
│
└── README.md

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
git clone https://github.com/your-username/health-app.git
cd health-app

---

### 2️⃣ Backend Setup
cd backend
npm install

Create a `.env` file:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Run backend:
nodemon app.js

---

### 3️⃣ Frontend Setup
cd ../frontend
npm install
npm run dev

---

## 🔗 API Endpoints

POST   /api/auth/register  
POST   /api/auth/login  
POST   /api/health  
GET    /api/health  
GET    /api/health/:id  

---

## 💡 Future Improvements

- Real AI integration (Gemini / OpenAI)
- UI/UX enhancements
- Dark mode
- Role-based access
- Notifications
-Prakrathi Analysis Tool

---

## 👨‍💻 Author

U Vivek Shenoy  
Full-Stack Developer
9901177522
