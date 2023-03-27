import express from "express";
import {
    addTeam,
    deleteTeam,
    getTeam,
    getTeams,
    getTeamsByCompetition,
    getTeamsByUsers,
    updateTeam
} from "../controller/team";
import auth from "../middlewares/auth";

const router = express.Router();

router.post('/', addTeam);
router.get('/', auth, getTeams);
router.get('/getByUser/:email',auth, getTeamsByUsers);
router.get('/getByID/:id',auth, getTeam);
router.get('/getByCompetition/:competition',auth, getTeamsByCompetition);
router.put('/:id',auth, updateTeam);
router.delete('/:id',auth, deleteTeam);

export default router;
