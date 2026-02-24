import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { prisma } from "../lib/prisma.js";
import { sendError } from "../helpers/responseHelpers.js";
import axios from "axios";
import { JUDGE0_URL } from "../configs/constants.js";

const problemRouter = express.Router();

problemRouter.get("/get-all", async (req, res) => {
    const allProblems = await prisma.problem.findMany({
        where: { published: true },
        include: {
            tags: { select: { title: true } },
        },
    });
    res.json({
        success: true,
        data: allProblems
    })
});

problemRouter.get("/:id", async (req, res) => {
    const problemId = req.params.id as string;
    console.log(problemId);
    if (!problemId) {
        return sendError(res, 400, "Please provide an id");
    }

    const problem = await prisma.problem.findUnique({
        where: {
            id: problemId
        },
        include: {
            examples: { select: { input: true, output: true, explanation: true } },
            tags: { select: { title: true } },
            testCases: { select: { input: true, expectedOutput: true } },
            starterCodes: { select: { languageId: true, code: true } },
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

