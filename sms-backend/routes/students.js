import express from 'express';
import Student from '../models/Student.js';

import jwt from 'jsonwebtoken';

import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// REST APIs

// GET: All students
router.get('/', roleMiddleware(['Admin', 'Teacher']), async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET: TOTAL NUMBER OF STUDENTS
router.get('/totalStudents', roleMiddleware(['Admin', 'Teacher', 'Student']), async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        res.json(totalStudents);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET: Students count by department (for pie chart)
router.get('/byDepartment', roleMiddleware(['Admin', 'Teacher', 'Student']), async (req, res) => {
    try {
        const data = await Student.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 } } }
        ]);

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET: Recent students (last 5 added)
router.get('/recent', roleMiddleware(['Admin', 'Teacher', 'Student']), async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 }).limit(5);
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET: Student by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role === 'Student' && decoded.userID !== id) {
            return res.status(403).json({ message: 'Not Authorized' });
        }

        const student = await Student.findOne({ id });

        if (!student) return res.status(404).json({ message: 'Student Not Found' });

        res.json(student);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }

});


// POST: Add New Student
router.post('/', roleMiddleware(['Admin']), async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyValue)[0]; // returns 'id' or 'email'

            return res.status(409).json({
                message: `This ${duplicateField} is already registered.`,
                field: duplicateField
            });
        }

        res.status(400).json({ message: err.message });
    }

});

// PUT: Update Student
router.put('/:id', roleMiddleware(['Admin']), async (req, res) => {
    try {
        const updated = await Student.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { returnDocument: 'after' }
        )

        if (!updated) return res.status(404).json({ message: 'Student Not Found' });
        res.json(updated);

    } catch (err) {
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyValue)[0]; // returns 'id' or 'email'

            return res.status(409).json({
                message: `This ${duplicateField} is already registered.`,
                field: duplicateField
            });
        }
        
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Delete Student
router.delete('/:id', roleMiddleware(['Admin']), async (req, res) => {
    try {
        const deleted = await Student.deleteOne({ id: req.params.id });

        if (!deleted) return res.status(404).json({ message: 'Student Not Found' });

        res.status(200).json({ message: 'Student deleted Successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST: Add Result to Student
router.post('/:id/results', roleMiddleware(['Admin', 'Teacher']), async (req, res) => {
    try {
        const student = await Student.findOne({ id: req.params.id });
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const { courseCode, marks } = req.body;

        const alreadyExists = student.results.some(
            result => result.courseCode === courseCode
        )

        if (alreadyExists) return res.status(400).json({ message: 'Result already exists for this course' })

        let totalGradePoints = 0;
        let totalCreditHours = 0;

        for (const result of student.results) {
            totalGradePoints += result.gpa * result.creditHours;
            totalCreditHours += result.creditHours;
        }

        student.cgpa = Number(
            (totalGradePoints/totalCreditHours).toFixed(2)
        );

        await student.save();

        student.results.push(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
