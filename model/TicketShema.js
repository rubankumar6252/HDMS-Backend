import mongoose from "mongoose";

const ticketShema = new mongoose.Schema({
    complaint_id: {
        type: String,
        required: true
    },
    comments: [
        {
            comment: {
                type: String
            }
        }
    ],
    email: {
        type: String
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
        required: true,
        enum: ["In Progress", "Resolved", "Rejected", "Close"],
        default: "In Progress"
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true 
});

const Ticket = mongoose.model('User-Ticket', ticketShema);

export default Ticket;
