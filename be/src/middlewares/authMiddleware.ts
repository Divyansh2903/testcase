import { type NextFunction, type Request, type Response } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken";
import { sendError } from "../helpers/responseHelpers.js";
import { JWTSECRET } from "../constants.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token=req.headers["authorization"];
    if(!token){
        return sendError(res,401,"Unauthorized.");
    }
    
    const decoded=jwt.verify(token,JWTSECRET) as JwtPayload;
    req.email=decoded.email;
    next();
}
