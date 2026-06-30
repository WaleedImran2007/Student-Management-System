import express from 'express';
import Attendance from '../models/Attendance.js';

import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// GET: GET ALL ATTENDANCES
router.get('/', roleMiddleware(['Admin', 'Teacher', 'Student']), async (req, res) => {
    try {
        const attendances = await Attendance.find();
        res.json(attendances);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET: STUDENTS PRESENT TODAY
router.get('/todayPresent', roleMiddleware(['Admin', 'Teacher', 'Student']), async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const attendance = await Attendance.findOne({ date: today });
        if (!attendance) return res.json(0);
        const presentCount = attendance.records.filter(r => r.status === 'Present').length;
        res.json(presentCount);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET: WEEKLY ATTENDANCE TREND (last 7 days)
router.get('/weeklyTrend', roleMiddleware(['Admin', 'Teacher', 'Student']), async (req, res) => {
    try {
        const days = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            days.push(d.toISOString().split('T')[0]);
        }

        const attendance = await Attendance.find({ date: { $in: days } });

        const trend = days.map(day => {
            const dayData = attendance.find(a => a.date === day);

            if (!dayData) {
                return {
                    date: day,
                    label: new Date(day).toLocaleDateString(
                        'en-US',
                        { weekday: 'short' }
                    ),
                    percentage: 0
                };
            }

            const totalStudents = dayData.records.length;
            const presentStudents = dayData.records.filter(record => {
                return record.status === 'Present';
            }).length;

            return {
                date: day,
                label: new Date(day).toLocaleDateString(
                    'en-US',
                    { weekday: 'short' }
                ),
                percentage: Math.round(
                    (presentStudents / totalStudents) * 100
                )
            };
        });

        res.json(trend);

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET: GET ATTENDANCE BY DATE
router.get('/:date', roleMiddleware(['Admin', 'Teacher', 'Student']), async (req, res) => {
    try {
        const attendance = await Attendance.findOne({ date: req.params.date });

        if (!attendance) {
            return res.status(404).json({
                message: 'Attendance not Found'
            });
        }
        
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST: ADD NEW ATTENDANCE
router.post('/', roleMiddleware(['Admin', 'Teacher']), async (req, res) => {
    try {
        const attendance = new Attendance(req.body);
        await attendance.save();
        res.status(201).json(attendance);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT: UPDATE ATTENDANCE BY DATE
router.put('/:date', roleMiddleware(['Admin', 'Teacher']), async (req, res) => {
    try {
        const updated = await Attendance.findOneAndUpdate(
            { date: req.params.date },
            req.body,
            { returnDocument: 'after' },
        )

        if (!updated) res.status(404).json({ message: 'Attendance Record doesnot Exist for this date' });

        res.json(updated);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})



export default router;
