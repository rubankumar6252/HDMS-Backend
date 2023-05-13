import mongoose from "mongoose";
// import moment from "moment";

const taskSchema = new mongoose.Schema({
    tasks: [
        {
            complaint_id: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            department: {
                type: String,
                required: true
            },
            priority: {
                type: String,
                required: true
            },
            problem: {
                type: String,
                required: true
            },
            status: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            comments: [
                {
                    comment: {
                        type: String
                    }
                }
            ]
        }
    ],

    completed: [
        {
            type: String
        }
    ]
})

const task = mongoose.model("task", taskSchema);

export default task;
