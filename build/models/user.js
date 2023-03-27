"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
});
exports.default = (0, mongoose_1.model)('User', userSchema);
