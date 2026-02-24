import { type NextFunction, type Request, type Response } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken";
import { sendError } from "../helpers/responseHelpers.js";
import { JWTSECRET, AUTH_COOKIE_NAME } from "../configs/constants.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token =
        req.cookies?.[AUTH_COOKIE_NAME] ??
        req.headers["authorization"]?.split(" ")[1] ??
        "";
    if (!token) {
        return sendError(res, 401, "Unauthorized.");
    }
    const decoded = jwt.verify(token, JWTSECRET) as JwtPayload;
    req.userId = decoded.userId;
    next();
};
