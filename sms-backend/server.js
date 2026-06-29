// CORE MODULES

// EXTERNAL MODULES
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// LOCAL MODULES
import studentRoutes from './routes/students.js';
import courseRoutes from './routes/courses.js';
import attendanceRoutes from './routes/attendances.js';
import authRoutes from './routes/authRouter.js';
import teacherRoutes from './routes/teachers.js';
import aiRoutes from './routes/aiRouter.js';
import { authMiddleware } from './middleware/authMiddleware.js';

import { connectDB } from './config/db.js';


dotenv.config();
const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://student-management-system-gray-psi.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use(authMiddleware); // checks whether user logged in or not

app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/ai', aiRoutes);

await connectDB();

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
})