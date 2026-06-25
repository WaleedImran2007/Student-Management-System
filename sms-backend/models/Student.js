import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
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
            min: 16,
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
            enum: ["Computer Science", "Software Engineering", "Data Science"],
        },

        semester: {
            type: String,
            required: true,
            trim: true,
            enum: [
                "1st",
                "2nd",
                "3rd",
                "4th",
                "5th",
                "6th",
                "7th",
                "8th"
            ]
        },

        results: [
            {
                courseCode: {
                    type: String,
                    required: true
                },

                creditHours: {
                    type: Number
                },

                marks: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: 100
                },

                gpa: {
                    type: Number,
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Student', studentSchema);