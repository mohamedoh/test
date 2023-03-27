"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const team_1 = require("../controller/team");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.post('/', team_1.addTeam);
router.get('/', auth_1.default, team_1.getTeams);
router.get('/getByUser/:email', auth_1.default, team_1.getTeamsByUsers);
router.get('/getByID/:id', auth_1.default, team_1.getTeam);
router.get('/getByCompetition/:competition', auth_1.default, team_1.getTeamsByCompetition);
router.put('/:id', auth_1.default, team_1.updateTeam);
router.delete('/:id', auth_1.default, team_1.deleteTeam);
exports.default = router;
