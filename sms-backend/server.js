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
import { authMiddleware } from './middleware/authMiddleware.js';


dotenv.config();
const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://student-management-system-gray-psi.vercel.app/",
    ],
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use(authMiddleware); // checks whether user logged in or not

app.use('/api/students' ,studentRoutes);
app.use('/api/courses' ,courseRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/teachers', teacherRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on port ${process.env.PORT || 5000}`);
        })
    })
    .catch(err => console.error(err));
