import TeamModel from '../models/team';
import UserModel from "../models/user";
import {Request, Response} from "express";
import nodemailer from "nodemailer";
import {ITeam} from "../interfaces";

const transporter = nodemailer.createTransport({
    service: "gmail", auth: {
        user: process.env.EMAIL, pass: process.env.PASS,
    },
});

const compete = ["FIGHTER", "JUNIOR", "LINE_FOLLOWER", "OFF_ROAD"];

export const getTeams = async (req: any, res: Response) => {
    try {
        const teams: ITeam[] = await TeamModel.find();
        res.status(200).json(teams);
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
};

export const getTeam = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        const team: ITeam | null = await TeamModel.findById(id);
        if (!team) return res.status(404).json({error: "Team not found"});

        res.status(200).json({message: "Team found", team});
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
}

export const addTeam = async (req: Request, res: Response) => {
    try {
        const teamBody: ITeam = req.body;

        if (!teamBody.email || !teamBody.name || !teamBody.competition || !teamBody.teamMembers) return res.status(400).json({error: "Missing fields"});

        const {teamMembers, competition} = teamBody;

        // check if competition is valid
        if (!compete.includes(competition)) return res.status(400).json({error: "Competition not found"});

        let ExistTeam = await TeamModel.findOne({name: teamBody.name});
        if (ExistTeam) return res.status(400).json({error: "Team already exist"});

        ExistTeam = await TeamModel.findOne({email: teamBody.email});
        if (ExistTeam) return res.status(400).json({error: "You are already team leader in another team"});

        const team = new TeamModel(teamBody);
        await team.save();

        for (const member of teamMembers) {
            const user = await UserModel.findOne({email: member.email});

            if (!user) {
                await transporter.sendMail({
                    from: '"ESPRIT RAS ROBOTS 1.0" <Contact@esprit-ras-robots.tn>', // sender address
                    to: member.email, // list of receivers
                    subject: "ESPRIT RAS ROBOTS 1.0 Team", // Subject line
                    html: `You have joined a Team<br/>Team ID: ${team._id}<br/>Don't forget to create an account so that u can get updated`, // html body
                });
            } else {
                await transporter.sendMail({
                    from: '"ESPRIT RAS ROBOTS 1.0" <Contact@esprit-ras-robots.tn>', // sender address
                    to: member.email, // list of receivers
                    subject: "ESPRIT RAS ROBOTS 1.0 Team", // Subject line
                    html: `You have joined a Team<br/>Team ID: ${team._id}`, // html body
                });
                await UserModel.findOneAndUpdate({email: member.email}, {$push: {teams: team._id}});
            }
        }

        res.status(200).json({message: "Team added successfully"});
    } catch (err: any) {
        return res.status(500).json({error: err.message});
    }
}

export const updateTeam = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const teamBody: ITeam = req.body;

        const team: ITeam | null = await TeamModel.findByIdAndUpdate(id, teamBody);
        if (!team) return res.status(404).json({error: "Team not found"});

        res.status(200).json({message: "Team updated successfully", team});
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
}

export const deleteTeam = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        const team: ITeam | null = await TeamModel.findByIdAndDelete(id);
        if (!team) return res.status(404).json({error: "Team not found"});

        res.status(200).json({message: "Team deleted successfully"});
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
}

export const getTeamsByUsers = async (req: Request, res: Response) => {
    try {
        const {email} = req.params;

        const teams: ITeam[] = await TeamModel.find({teamMembers: {$elemMatch: {email}}});

        if (!teams) return res.status(404).json({error: "Teams not found"});

        res.status(200).json({message: "Teams found", teams});

    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
}

export const getTeamsByCompetition = async (req: Request, res: Response) => {
    try {
        const {competition} = req.params;

        const teams = await TeamModel.find({competition});

        if (!teams) return res.status(404).json({error: "Teams not found"});

        res.status(200).json({message: "Teams found", teams});
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
}
