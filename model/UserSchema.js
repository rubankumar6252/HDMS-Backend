import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    regno: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

var User = mongoose.model('User', userSchema)

export default User;