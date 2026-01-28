import { type NextFunction, type Request, type Response } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken";
import { sendError } from "../helpers/responseHelpers.js";
import { JWTSECRET } from "../configs/constants.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader=req.headers["authorization"];
    if(!authHeader){
        return sendError(res,401,"Unauthorized.");
    }
    const token=authHeader?.split(" ")[1]??"";    
    const decoded=jwt.verify(token,JWTSECRET) as JwtPayload;
    req.email=decoded.email;
    next();
}
