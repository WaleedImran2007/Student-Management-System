import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    userID: {
        type: String,
        required: true
    },

    memory: {
        parameters: {
            type: Object,
            default: {},
        },

        filters: {
            type: Object,
            default: {}
        }
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