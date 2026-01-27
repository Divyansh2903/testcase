import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { prisma } from "../lib/prisma.js";
import { sendError } from "../helpers/responseHelpers.js";

const problemRouter = express.Router();

problemRouter.get("/get-all", async (req, res) => {
    const allProblems = await prisma.problem.findMany();
    res.json({
        success: true,
        data: allProblems
    })
});

problemRouter.get("/:id", async (req, res) => {
    const problemId = req.params.id as string;
    if (!problemId) {
        return sendError(res, 400, "Please provide an id");
    }

    const problem = await prisma.problem.findUnique({
        where: {
            id: problemId
        }
    });
    if (!problem) {
        return sendError(res, 404, "Problem not found");
    }
    res.json({
        success: true,
        data: problem
    })
});

export default problemRouter;

