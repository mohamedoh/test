"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const indexRouter = express_1.default.Router();
indexRouter.get("/", (req, res) => {
    res.send("Welcome To ESPRIT RAS ROBOTS 1.0!");
});
exports.default = indexRouter;
