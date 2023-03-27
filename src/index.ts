import express from "express";
import clc from "cli-color";
import cookieParser from "cookie-parser";
import logger from "morgan";
import connectDB from "./utils/MongoDB";

const cors = require('cors')

import * as dotenv from "dotenv";

//import Routers
import userRouter from "./routes/user";
import teamRouter from "./routes/team";

import path from "path";

dotenv.config();

const app = express();

app.use(logger(`${clc.red("[:date[web]]")}  |  ${clc.yellow(":method")} ' ${clc.blue(":url")} ' ${clc.green(":status")} - :res[content-length] - :response-time ms `, {
    skip: (req) => {
        return req.originalUrl === "/" || req.originalUrl === "/favicon.ico" || req.originalUrl === "/manifest.json" || req.originalUrl === "/logo192.png" || req.originalUrl.startsWith("/static");
    },
}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname + "/../public")));
app.use(cors())

app.listen(process.env.PORT, async () => {
    console.log("Server started on port " + process.env.PORT);
    await connectDB();
});

// app.use("/", indexRouter);
app.use("/api/user", userRouter);
app.use("/api/team", teamRouter);
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + "/../public/index.html"));
});
