import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        creditHours: {
            type: Number,
            required: true,
            enum: [1, 2, 3]
        },

        department: {
            type: String,
            required: true,
            trim: true,
            enum: ["Computer Science", "Software Engineering", "Data Science"],
        },

        instructor: {
            type: String,
            required: true,
            trim: true,
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

    },
    {
        timestamps: true
    }
);

export default mongoose.model('Course', courseSchema);