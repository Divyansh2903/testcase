import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { prisma } from "../lib/prisma.js";
import { sendError } from "../helpers/responseHelpers.js";
import axios from "axios";
import { JUDGE0_URL } from "../configs/constants.js";

const problemRouter = express.Router();

type ProblemStatus = "solved" | "attempted" | "unsolved";

problemRouter.get("/get-all", async (req, res) => {
    const allProblems = await prisma.problem.findMany({
        where: { published: true },
        include: {
            tags: { select: { title: true } },
        },
    });
    const userId = req.userId as string | undefined;
    let statusByProblemId: Record<string, ProblemStatus> = {};
    if (userId) {
        const accepted = await prisma.submission.findMany({
            where: { userId, submissionStatus: "ACCEPTED" },
            select: { problemId: true },
            distinct: ["problemId"],
        });
        const attempted = await prisma.submission.findMany({
            where: { userId },
            select: { problemId: true },
            distinct: ["problemId"],
        });
        const acceptedIds = new Set(accepted.map((s) => s.problemId));
        const attemptedIds = new Set(attempted.map((s) => s.problemId));
        for (const p of allProblems) {
            statusByProblemId[p.id] = acceptedIds.has(p.id)
                ? "solved"
                : attemptedIds.has(p.id)
                    ? "attempted"
                    : "unsolved";
        }
    }
    const data = allProblems.map((p) => ({
        ...p,
        status: statusByProblemId[p.id] ?? ("unsolved" as const),
    }));
    res.json({
        success: true,
        data,
    });
});

problemRouter.get("/:id", async (req, res) => {
    const problemId = req.params.id as string;
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
            testCases: { select: { input: true, expectedOutput: true }, orderBy: { id: "asc" } },
            starterCodes: { select: { languageId: true, code: true } },
        }
    });
    if (!problem) {
        return sendError(res, 404, "Problem not found");
    }
    const userId = req.userId as string | undefined;
    let status: ProblemStatus = "unsolved";
    if (userId) {
        const accepted = await prisma.submission.findFirst({
            where: { userId, problemId: problem.id, submissionStatus: "ACCEPTED" },
        });
        if (accepted) status = "solved";
        else {
            const anySubmission = await prisma.submission.findFirst({
                where: { userId, problemId: problem.id },
            });
            if (anySubmission) status = "attempted";
        }
    }
    res.json({
        success: true,
        data: { ...problem, status },
    });
});

export default problemRouter;

