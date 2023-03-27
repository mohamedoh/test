import {Schema, model} from 'mongoose';

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetCode: {
        type: Number,
        require: true,
        default: null
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
})

export default model('User', userSchema);
