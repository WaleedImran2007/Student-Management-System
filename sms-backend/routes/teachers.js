import express from 'express';
import Teacher from '../models/Teacher.js';

import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// GET: ALL TEACHERS
router.get(
    '/',
    roleMiddleware(['Admin', 'Teacher', 'Student']),
    async (req, res) => {
        try {
            const teachers = await Teacher.find();
            res.json(teachers);
        } catch (err) {
            res.status(500).json({
                message: 'Server error',
                error: err.message
            });
        }
    }
);

// GET: TEACHER BY ID
router.get(
    '/:id',
    roleMiddleware(['Admin', 'Teacher', 'Student']),
    async (req, res) => {
        try {
            const teacher = await Teacher.findOne({
                id: req.params.id
            });

            if (!teacher) {
                return res.status(404).json({
                    message: 'Teacher Not Found'
                });
            }

            res.json(teacher);

        } catch (err) {
            res.status(500).json({
                message: 'Server error',
                error: err.message
            });
        }
    }
);

// POST: ADD TEACHER
router.post(
    '/',
    roleMiddleware(['Admin']),
    async (req, res) => {
        try {
            const teacher = new Teacher(req.body);

            await teacher.save();

            res.status(201).json(teacher);

        } catch (err) {
            if (err.code === 11000) {
                const duplicateField = Object.keys(err.keyValue)[0]; // returns 'id' or 'email'

                return res.status(409).json({
                    message: `This ${duplicateField} is already registered.`,
                    field: duplicateField
                });
            }

            res.status(400).json({
                message: err.message
            });
        }
    }
);

// PUT: UPDATE TEACHER
router.put(
    '/:id',
    roleMiddleware(['Admin']),
    async (req, res) => {
        try {
            const updated = await Teacher.findOneAndUpdate(
                { id: req.params.id },
                req.body,
                { returnDocument: 'after' }
            );

            if (!updated) {
                return res.status(404).json({
                    message: 'Teacher Not Found'
                });
            }

            res.json(updated);

        } catch (err) {
            if (err.code === 11000) {
                const duplicateField = Object.keys(err.keyValue)[0]; // returns 'id' or 'email'

                return res.status(409).json({
                    message: `This ${duplicateField} is already registered.`,
                    field: duplicateField
                });
            }

            res.status(400).json({
                message: err.message
            });
        }
    }
);

// DELETE: TEACHER
router.delete(
    '/:id',
    roleMiddleware(['Admin']),
    async (req, res) => {
        try {
            const deleted = await Teacher.deleteOne({
                id: req.params.id
            });

            if (!deleted) {
                return res.status(404).json({
                    message: 'Teacher Not Found'
                });
            }

            res.status(200).json({
                message: 'Teacher deleted successfully'
            });

        } catch (err) {
            res.status(400).json({
                message: err.message
            });
        }
    }
);

export default router;