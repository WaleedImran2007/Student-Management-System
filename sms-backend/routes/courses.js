import express from 'express';
import Course from '../models/Course.js';

import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// REST APIs

// GET: ALL COURSES
router.get('/', roleMiddleware(['Admin', 'Teacher', 'Student']), async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET: TOTAL ACTIVE COURSES COUNT
router.get('/totalCourses', roleMiddleware(['Admin', 'Teacher', 'Student']), async (req, res) => {
    try {
        const total = await Course.countDocuments();
        res.json(total);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET: COURSE BY CODE
router.get('/:code', roleMiddleware(['Admin', 'Teacher', 'Student']), async (req, res) => {
    try {
        const course = await Course.findOne({ code: req.params.code });
        if (!course) return res.status(404).json({ message: 'Course Not Found' });
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST: ADD NEW COURSE
router.post('/', roleMiddleware(['Admin']), async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json(course);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: `Course Code is already registered.`,
            });
        }

        res.status(400).json({ message: err.message });
    }
});

// PUT: UPDATE COURSE
router.put('/:code', roleMiddleware(['Admin']), async (req, res) => {
    try {
        const updated = await Course.findOneAndUpdate(
            { code: req.params.code },
            req.body,
            { returnDocument: 'after' }
        )

        if (!updated) return res.status(404).json({ message: 'Course Not Found' });
        res.json(updated);

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: `Course Code is already registered.`,
            });
        }

        res.status(400).json({ message: err.message });
    }
});

// DELETE: DELETE COURSE
router.delete('/:code', roleMiddleware(['Admin']), async (req, res) => {
    try {
        const deleted = await Course.deleteOne({ code: req.params.code });
        if (!deleted) return res.status(404).json({ message: 'Course Not Found' });

        res.status(200).json({ message: 'Course deleted Successfully' });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

export default router;
