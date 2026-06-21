import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
            trim: true
        },

        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ['Student', 'Admin', 'Teacher'],
            default: 'Student'
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        verificationToken: {
            type: String,
        },

        aiRequests: {
            type: Number,
            default: 0,
        },

        aiResetDate: {
            type: Date,
            default: () => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                return tomorrow;
            }
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('User', userSchema);