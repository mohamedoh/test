import express from "express";
import {
    addUser,
    confirmResetCode,
    getUserByEmail,
    getUserByID,
    getUsers,
    login,
    resetPassword,
    sendMail,
    sendResetCode,
    updateUser
} from "../controller/user";
import auth from "../middlewares/auth";

const router = express.Router();

router.get('/', auth, getUsers);
router.get('/getByID/:id', getUserByID);
router.get('/getByEmail/:email', getUserByEmail);

router.post('/', auth, addUser);
router.post('/login', login);
router.post('/sendResCode', sendResetCode);
router.post('/confirmResCode', confirmResetCode);
router.post('/resetPassword', resetPassword);
router.post('/sendMail', sendMail);

router.put('/:id', updateUser);

export default router;
