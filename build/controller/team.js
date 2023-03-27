"use strict";
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
exports.getTeamsByCompetition = exports.getTeamsByUsers = exports.deleteTeam = exports.updateTeam = exports.addTeam = exports.getTeam = exports.getTeams = void 0;
const team_1 = __importDefault(require("../models/team"));
const user_1 = __importDefault(require("../models/user"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail", auth: {
        user: process.env.EMAIL, pass: process.env.PASS,
    },
});
const compete = ["FIGHTER", "JUNIOR", "LINE_FOLLOWER", "OFF_ROAD"];
const getTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = yield team_1.default.find();
        res.status(200).json(teams);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getTeams = getTeams;
const getTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const team = yield team_1.default.findById(id);
        if (!team)
            return res.status(404).json({ error: "Team not found" });
        res.status(200).json({ message: "Team found", team });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getTeam = getTeam;
const addTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teamBody = req.body;
        if (!teamBody.email || !teamBody.name || !teamBody.competition || !teamBody.teamMembers)
            return res.status(400).json({ error: "Missing fields" });
        const { teamMembers, competition } = teamBody;
        // check if competition is valid
        if (!compete.includes(competition))
            return res.status(400).json({ error: "Competition not found" });
        let ExistTeam = yield team_1.default.findOne({ name: teamBody.name });
        if (ExistTeam)
            return res.status(400).json({ error: "Team already exist" });
        ExistTeam = yield team_1.default.findOne({ email: teamBody.email });
        if (ExistTeam)
            return res.status(400).json({ error: "You are already team leader in another team" });
        const team = new team_1.default(teamBody);
        yield team.save();
        for (const member of teamMembers) {
            const user = yield user_1.default.findOne({ email: member.email });
            if (!user) {
                yield transporter.sendMail({
                    from: '"ESPRIT RAS ROBOTS 1.0" <Contact@esprit-ras-robots.tn>',
                    to: member.email,
                    subject: "ESPRIT RAS ROBOTS 1.0 Team",
                    html: `You have joined a Team<br/>Team ID: ${team._id}<br/>Don't forget to create an account so that u can get updated`, // html body
                });
            }
            else {
                yield transporter.sendMail({
                    from: '"ESPRIT RAS ROBOTS 1.0" <Contact@esprit-ras-robots.tn>',
                    to: member.email,
                    subject: "ESPRIT RAS ROBOTS 1.0 Team",
                    html: `You have joined a Team<br/>Team ID: ${team._id}`, // html body
                });
                yield user_1.default.findOneAndUpdate({ email: member.email }, { $push: { teams: team._id } });
            }
        }
        res.status(200).json({ message: "Team added successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.addTeam = addTeam;
const updateTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const teamBody = req.body;
        const team = yield team_1.default.findByIdAndUpdate(id, teamBody);
        if (!team)
            return res.status(404).json({ error: "Team not found" });
        res.status(200).json({ message: "Team updated successfully", team });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.updateTeam = updateTeam;
const deleteTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const team = yield team_1.default.findByIdAndDelete(id);
        if (!team)
            return res.status(404).json({ error: "Team not found" });
        res.status(200).json({ message: "Team deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.deleteTeam = deleteTeam;
const getTeamsByUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const teams = yield team_1.default.find({ teamMembers: { $elemMatch: { email } } });
        if (!teams)
            return res.status(404).json({ error: "Teams not found" });
        res.status(200).json({ message: "Teams found", teams });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getTeamsByUsers = getTeamsByUsers;
const getTeamsByCompetition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { competition } = req.params;
        const teams = yield team_1.default.find({ competition });
        if (!teams)
            return res.status(404).json({ error: "Teams not found" });
        res.status(200).json({ message: "Teams found", teams });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getTeamsByCompetition = getTeamsByCompetition;
