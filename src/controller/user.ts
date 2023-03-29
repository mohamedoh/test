import UserModel from "../models/user"
import teamModel from "../models/team"
import {Request, Response} from "express";
import {IUser} from "../interfaces";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer"
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail", auth: {
        user: process.env.EMAIL, pass: process.env.PASS,
    },
});

export const addUser = async (req: Request, res: Response) => {
    try {
        const userBody: IUser = req.body;

        if (!userBody.email || !userBody.password || !userBody.name) return res.status(400).json({error: "Missing fields"});

        const existUser: IUser | null = await UserModel.findOne({email: userBody.email});

        // check if user already exists
        if (existUser) return res.status(400).json({error: "User already exists"});

        const user = new UserModel({...userBody, password: await bcrypt.hash(userBody.password, 10)});
        await user.save();

        await transporter.sendMail({
            from: '"ESPRIT RAS ROBOTS 1.0" <midouca82@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: "Account Created ✅", // Subject line
            html: "You Have created your account successfully to reset your password click this Button <a href='google.com'>Forget Pass</a>", // html body
        });

        res.status(200).json(user);
    } catch (err: any) {
        return res.status(500).json({error: err.message});
    }
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users: IUser[] | null = await UserModel.find();
        res.status(200).json(users);
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
};

export const getUserByID = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const user: IUser | null = await UserModel.findById(id);
        if (!user) return res.status(404).json({error: "User not found"});
        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
};

export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        const {email} = req.params;
        const user: IUser | null = await UserModel.findOne({email: email});

        if (!user) return res.status(404).json({error: "User not found"});

        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const userBody: IUser = req.body;
        const {id} = req.params;

        let user: IUser | null = await UserModel.findByIdAndUpdate(id, userBody);

        if (!user) return res.status(404).json({error: "User not found"});

        user = await UserModel.findOne({_id: id});

        res.status(200).json({message: 'User Updated', user});
    } catch (err: any) {
        return res.status(500).json({error: err.message});
    }
}

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        if (!email || !password) return res.status(400).json({error: "Please provide an email and password"});

        const user: IUser | null = await UserModel.findOne({email});

        if (!user) return res.status(404).json({error: "Email not found"});

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(404).json({error: "Password is incorrect"});

        const JWT_SECRET: string = process.env.JWT_SECRET || 'secret';
        const token = jwt.sign({user}, JWT_SECRET);
        res.status(200).json({token, user});
    } catch (err: any) {
        return res.status(500).json({error: err.message});
    }
}

export const sendResetCode = async (req: Request, res: Response) => {
    try {
        const {email} = req.body;

        const code = Math.floor(100000 + Math.random() * 900000);
        const user: IUser | null = await UserModel.findOneAndUpdate({email}, {resetCode: code});

        if (!user) return res.status(404).json({error: "User not found"});

        await transporter.sendMail({
            from: '"ESPRIT RAS ROBOTS 1.0" <Contact@esprit-ras-robots.tn>',
            to: email,
            subject: "Reset Password",
            html: `Your Reset Code is <b>${code}</b>`,
        });

        res.status(200).json({message: "Code Sent"});
    } catch (e: any) {
        return res.status(500).json({error: e.message});
    }
}

export const confirmResetCode = async (req: Request, res: Response) => {
    try {
        const {email, code} = req.body;

        const user: IUser | null = await UserModel.findOne({email});

        if (!user) return res.status(404).json({error: "User not found"});

        if (user.resetCode !== code) return res.status(404).json({error: "Code Invalid"});

        res.status(200).json({message: "Code Valid"});
    } catch (e: any) {
        return res.status(500).json({error: e.message});
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        const user = await UserModel.findOneAndUpdate({email}, {password: await bcrypt.hash(password, 10)});

        if (!user) return res.status(404).json({error: "User not found"});

        res.status(200).json({message: "Password Updated"});
    } catch (e: any) {
        return res.status(500).json({error: e.message});
    }
}

export const sendMail = async (req: Request, res: Response) => {
    try {
        const {email, name, message} = req.body;
        await transporter.sendMail({
            from: `"Contact ESPRIT RAS ROBOTS" <Contact@esprit-ras-robots.tn>`, // sender address
            to: "mohamedhabiballah.bibani@esprit.tn", // list of receivers
            subject: "Contact ESPRIT RAS ROBOTS 1.0", // Subject line
            html: `Email: ${email}<br/>Name: ${name}<br/>${message}`, // html body
        });
        res.status(200).json({message: "Mail Sent"});
    } catch (e: any) {
        return res.status(500).json({error: e.message});
    }
}
