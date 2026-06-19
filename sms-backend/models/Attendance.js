import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true,
        },

        records: [
            {
                studentID: {
                    type: String,
                    required: true,
                },

                status: {
                    type: String,
                    enum: ["Present", "Absent"],
                    required: true,
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Attendance", attendanceSchema);