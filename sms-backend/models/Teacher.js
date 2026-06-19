import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        age: {
            type: Number,
            required: true,
            min: 20,
            max: 80
        },

        gender: {
            type: String,
            required: true,
            enum: ['Male', 'Female', 'Other']
        },

        department: {
            type: String,
            required: true,
            enum: [
                'Computer Science',
                'Software Engineering',
                'Data Science'
            ]
        },

        experience: {
            type: String,
            required: true,
            trim: true
        },

        designation: {
            type: String,
            required: true,
            enum: [
                'Lecturer',
                'Assistant Professor',
                'Associate Professor',
                'Professor'
            ]
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Teacher', teacherSchema);