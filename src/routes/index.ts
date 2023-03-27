import express from "express";
const indexRouter = express.Router();
indexRouter.get("/", (req, res) => {
    res.send("Welcome To ESPRIT RAS ROBOTS 1.0!");
});

export default indexRouter;
