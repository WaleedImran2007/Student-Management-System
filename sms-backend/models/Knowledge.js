import mongoose from 'mongoose';

const knowledgeSchema = new mongoose.Schema(
    {
        document: {
            type: String,
        },

        title: {
            type: String,
        },

        chunkIndex: {
            type: Number,
        },

        text: {
            type: String,
        },

        embedding: {
            type: [Number],
            default: [],
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Knowledge', knowledgeSchema);