# 🎓 Student Management System (MERN Stack)

A full-stack **Student Management System** built using the MERN stack (MongoDB, Express.js, React.js, Node.js).
This application provides role-based access for **Admin, Teachers, and Students** with secure authentication and an interactive dashboard.

## 🚀 Live Demo

🔗 Frontend: YOUR_FRONTEND_URL
🔗 Backend API: YOUR_BACKEND_URL

---

## 📌 Features

### 🔐 Authentication & Authorization

* Secure user registration and login
* JWT-based authentication
* Protected routes
* Role-based access control

### 👨‍💼 Admin Features

* Manage students
* Manage teachers
* Manage courses
* View system dashboard
* Control user access

### 👨‍🏫 Teacher Features

* View assigned courses
* Mark student attendance
* Manage attendance records

### 👨‍🎓 Student Features

* View profile
* View courses
* Check attendance records

### 📊 Dashboard

* Interactive statistics
* Attendance overview
* Course analytics
* Data visualization using charts

### 📚 Course Management

* Add courses
* Update courses
* Delete courses
* Assign courses

### 📝 Attendance System

* Daily attendance tracking
* Attendance history
* Present/absent records

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Chart.js
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt

### Deployment

* Frontend: Railway / Vercel
* Backend: Railway
* Database: MongoDB Atlas

---

## 📂 Project Structure

```
Student-Management-System
│
├── sms-frontend
│   ├── src
│   ├── components
│   ├── pages
│   └── store
│
└── sms-backend
    ├── routes
    ├── models
    ├── middleware
    └── server.js
```

---

## ⚙️ Installation & Setup

### Clone Repository

```bash
git clone YOUR_REPOSITORY_URL

cd Student-Management-System
```

---

## Backend Setup

```bash
cd sms-backend

npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

---

## Frontend Setup

Open another terminal:

```bash
cd sms-frontend

npm install

npm run dev
```

---

## 🔑 User Roles

| Role    | Access                    |
| ------- | ------------------------- |
| Admin   | Full system control       |
| Teacher | Attendance & courses      |
| Student | View academic information |

---

## 📸 Screenshots

(Add your screenshots here)

---

## 🔒 Security

* Password hashing using bcrypt
* JWT token verification
* Protected API routes
* Role-based middleware protection

---

## 📈 Future Improvements

* Email notifications
* Password reset
* More analytics
* File uploads
* Mobile responsive improvements

---

## 👨‍💻 Author

**Waleed Imran**

BS Computer Science Student

GitHub: YOUR_GITHUB_PROFILE

---

⭐ If you like this project, consider giving it a star!
