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
const express_1 = __importDefault(require("express"));
const cli_color_1 = __importDefault(require("cli-color"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const MongoDB_1 = __importDefault(require("./utils/MongoDB"));
const cors = require('cors');
const dotenv = __importStar(require("dotenv"));
//import Routers
const user_1 = __importDefault(require("./routes/user"));
const team_1 = __importDefault(require("./routes/team"));
const path_1 = __importDefault(require("path"));
dotenv.config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)(`${cli_color_1.default.red("[:date[web]]")}  |  ${cli_color_1.default.yellow(":method")} ' ${cli_color_1.default.blue(":url")} ' ${cli_color_1.default.green(":status")} - :res[content-length] - :response-time ms `, {
    skip: (req) => {
        return req.originalUrl === "/" || req.originalUrl === "/favicon.ico" || req.originalUrl === "/manifest.json" || req.originalUrl === "/logo192.png" || req.originalUrl.startsWith("/static");
    },
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname + "/../public")));
app.use(cors());
app.listen(process.env.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Server started on port " + process.env.PORT);
    yield (0, MongoDB_1.default)();
}));
// app.use("/", indexRouter);
app.use("/api/user", user_1.default);
app.use("/api/team", team_1.default);
app.get('/*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname + "/../public/index.html"));
});
