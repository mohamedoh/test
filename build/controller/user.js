"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = exports.resetPassword = exports.confirmResetCode = exports.sendResetCode = exports.login = exports.updateUser = exports.getUserByEmail = exports.getUserByID = exports.getUsers = exports.addUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv = __importStar(require("dotenv"));
const jwt = __importStar(require("jsonwebtoken"));
dotenv.config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail", auth: {
        user: process.env.EMAIL, pass: process.env.PASS,
    },
});
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userBody = req.body;
        if (!userBody.email || !userBody.password || !userBody.name)
            return res.status(400).json({ error: "Missing fields" });
        const existUser = yield user_1.default.findOne({ email: userBody.email });
        // check if user already exists
        if (existUser)
            return res.status(400).json({ error: "User already exists" });
        const user = new user_1.default(Object.assign(Object.assign({}, userBody), { password: yield bcrypt_1.default.hash(userBody.password, 10) }));
        yield user.save();
        yield transporter.sendMail({
            from: '"ESPRIT RAS ROBOTS 1.0" <Contact@esprit-ras-robots.tn>',
            to: user.email,
            subject: "Account Created ✅",
            html: "You Have created your account successfully to reset your password click this Button <a href='google.com'>Forget Pass</a>", // html body
        });
        res.status(200).json(user);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.addUser = addUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find();
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getUsers = getUsers;
const getUserByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield user_1.default.findById(id);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getUserByID = getUserByID;
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const user = yield user_1.default.findOne({ email: email });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getUserByEmail = getUserByEmail;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userBody = req.body;
        const { id } = req.params;
        let user = yield user_1.default.findByIdAndUpdate(id, userBody);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        user = yield user_1.default.findOne({ _id: id });
        res.status(200).json({ message: 'User Updated', user });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.updateUser = updateUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password)
            return res.status(400).json({ error: "Please provide an email and password" });
        const user = yield user_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ error: "Email not found" });
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(404).json({ error: "Password is incorrect" });
        const JWT_SECRET = process.env.JWT_SECRET || 'secret';
        const token = jwt.sign({ user }, JWT_SECRET);
        res.status(200).json({ token, user });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.login = login;
const sendResetCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const code = Math.floor(100000 + Math.random() * 900000);
        const user = yield user_1.default.findOneAndUpdate({ email }, { resetCode: code });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        yield transporter.sendMail({
            from: '"ESPRIT RAS ROBOTS 1.0" <Contact@esprit-ras-robots.tn>',
            to: email,
            subject: "Reset Password",
            html: `Your Reset Code is <b>${code}</b>`,
        });
        res.status(200).json({ message: "Code Sent" });
    }
    catch (e) {
        return res.status(500).json({ error: e.message });
    }
});
exports.sendResetCode = sendResetCode;
const confirmResetCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, code } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        if (user.resetCode !== code)
            return res.status(404).json({ error: "Code Invalid" });
        res.status(200).json({ message: "Code Valid" });
    }
    catch (e) {
        return res.status(500).json({ error: e.message });
    }
});
exports.confirmResetCode = confirmResetCode;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.default.findOneAndUpdate({ email }, { password: yield bcrypt_1.default.hash(password, 10) });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        res.status(200).json({ message: "Password Updated" });
    }
    catch (e) {
        return res.status(500).json({ error: e.message });
    }
});
exports.resetPassword = resetPassword;
const sendMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, message } = req.body;
        yield transporter.sendMail({
            from: `"Contact ESPRIT RAS ROBOTS" <Contact@esprit-ras-robots.tn>`,
            to: "mohamedhabiballah.bibani@esprit.tn",
            subject: "Contact ESPRIT RAS ROBOTS 1.0",
            html: `Email: ${email}<br/>Name: ${name}<br/>${message}`, // html body
        });
        res.status(200).json({ message: "Mail Sent" });
    }
    catch (e) {
        return res.status(500).json({ error: e.message });
    }
});
exports.sendMail = sendMail;
