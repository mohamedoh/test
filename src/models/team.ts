import {model, Schema} from 'mongoose';

const teamMember = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    name: {
        type: String,
        required: true,
    }
}, {_id: false})

const teamSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    name: {
        type: String,
        required: true,
        length: 3,
    },
    teamMembers: {
        type: [teamMember],
        required: true,
    },
    competition: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
        default: 0
    },
    isValid: {
        type: Boolean,
        required: true,
        default: false,
    },
    isPresent: {
        type: Boolean,
        required: true,
        default: false,
    },
    getLunch: {
        type: Boolean,
        required: true,
        default: false,
    }
});

export default model('Team', teamSchema);
