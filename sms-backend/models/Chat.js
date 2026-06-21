import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    userID: {
        type: String,
        required: true
    },

    messages: [
        {
            role: {
                type: String,
                enum: ['user', 'ai']
            },

            content: {
                type: String,
            }
        }
    ]
},
{
    timestamps: true
});

export default mongoose.model('Chat', chatSchema);