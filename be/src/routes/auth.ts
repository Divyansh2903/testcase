import express, { Router } from "express";
import { signinSchema, signupSchema } from "../zod/auth.js";
import { prisma } from "../lib/prisma.js";
import { checkPassword, hashPassword } from "../helpers/passwordHelper.js";
import jwt from "jsonwebtoken";
import { JWTSECRET } from "../configs/constants.js";
import { sendError } from "../helpers/responseHelpers.js";
import { Prisma } from "../generated/prisma/client.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/sign-up", async (req, res) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({
            success: false,
            error: "Invalid request schema",
        });
    const { name, email, password } = parsed.data;
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) throw new Error("Password Hashing failed");
    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
            select:{
                name:true,
                email:true,
                role:true
            }
        });
        return res.status(201).json({
            success: true,
            data: user,
        });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
            return sendError(res, 409, "Email already exists");
        }
    }

})

authRouter.post("/sign-in", async (req, res) => {
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({
            success: false,
            error: "Invalid request schema",
        });
    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return sendError(res, 404, "User not found");
    }
    const isPassCorrect = await checkPassword(password, user.password);
    if (!isPassCorrect) {
        return sendError(res, 401, "Incorrect Email or Password.");
    }
    const token = jwt.sign({ email: user.email, role: user.role }, JWTSECRET);
    return res.status(201).json({
        success: true,
        data: {
            token
        }
    });
})

authRouter.get("/get-user",authMiddleware,async (req,res)=>{
    if (!req.email) {
        return sendError(res, 401, "Unauthorized");
    }
    const user = await prisma.user.findUnique({
        where:{
            email: req.email
        },
        select:{
            id:true,
            email:true,
            name:true,
            role:true
        }
    });
    return res.status(200).json({
        success: true,
        data: user
    });
})

export default authRouter;