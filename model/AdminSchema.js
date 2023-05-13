import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin','subadmin'],
        default: 'admin'
    }
})

var Admin = mongoose.model('Admin', adminSchema)

export default Admin;