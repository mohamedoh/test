import jwt, {JwtPayload} from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";
import * as dotenv from 'dotenv';

dotenv.config();

export interface CustomRequest extends Request {
    user: any;
}

export default (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token || token === "") return res.status(401).json({
            message: "You need to login to access this page"
        });

        (req as CustomRequest).user = jwt.decode(token);
        if (!(req as CustomRequest).user.isAdmin) return res.status(401).json({
            message: "You need to be an admin to access this page"
        });

        next();
    } catch (e: any) {
        res.status(401).json({
            message: "Auth failed", error: e.message
        });
    }
}
