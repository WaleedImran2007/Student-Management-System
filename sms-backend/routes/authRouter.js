import express from 'express';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';

import sendEmail from '../utils/sendemail.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const router = express.Router();

// GET: GET USER BY _id
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    }
});


// TO VERIFY EMAIL
router.get('/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });

        if (!user) {
            return res.status(400).json({
                message: "Invalid token"
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;

        await user.save();
        res.json({
            message: "Email verified successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: "Server error"
        });
    }
});


// POST: ADD NEW USER
router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let role;

        const userEmailExists = await User.findOne({ email });
        const userNameExists = await User.findOne({ username });

        if (userEmailExists) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        if (userNameExists) {
            return res.status(410).json({ message: 'Username is already taken' });
        }

        let student = await Student.findOne({ email });
        let teacher = await Teacher.findOne({ email });

        let id = null;

        if (email === (process.env.ADMIN_EMAIL)) {
            role = 'Admin';
            id = "A-01";
        }

        else if (student) {
            role = 'Student';
            id = student.id;
        }

        else if (teacher) {
            role = 'Teacher';
            id = teacher.id;
        }

        else {
            return res.status(403).json({
                message: "You are not registered in our university"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = crypto.randomBytes(32).toString('hex');

        const user = new User({
            id,
            username,
            email,
            password: hashedPassword,
            role,
            verificationToken: verificationToken,
            isVerified: false,
        });

        await user.save();

        await sendEmail(
            user.email,
            user.verificationToken,
        );

        return res.status(201).json(user);
    }

    catch (err) {
        console.log("SIGNUP ERROR:", err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }

});


// POST: GENERATE TOKEN OR LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                message: "Please verify your email first"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            {
                userID: user.id,
                email: user.email,
                role: user.role,
            },

            process.env.JWT_SECRET,

            { expiresIn: '2d' }
        )

        res.status(200).json({
            message: "Login successful",
            token
        });
    }

    catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});


export default router;
