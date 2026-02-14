import axios from "axios";
import express from "express";
import { JUDGE0_URL } from "../configs/constants.js";
import type { JUDGE0_GET_TOKEN_RES, Language } from "../types/types.js";
import { SUPPORTED_LANGUAGES } from "../configs/supportedLanguages.js";
import { submissionSchema } from "../zod/submission.js";
import { sendError } from "../helpers/responseHelpers.js";
import { prisma } from "../lib/prisma.js";

const submissionRouter = express.Router();


submissionRouter.get("/languages", async (req, res) => {
    const { data: languages } = (await axios.get<Language[]>(`${JUDGE0_URL}/languages`));

    const filteredLanguages = languages.filter(lang =>
        SUPPORTED_LANGUAGES.some(pattern => pattern.test(lang.name))
    );

    res.json({
        success: true,
        data: filteredLanguages
    });
})

submissionRouter.post("/:problemId", async (req, res) => {
    const parsed = submissionSchema.safeParse(req.body);
    if (!parsed.success) {
        return sendError(res, 400, "Invalid submission");
    }
    const problemId = req.params.problemId;

    try {
        const testCases = await prisma.testCase.findMany({
            where: {
                problemId: problemId
            },
            select: {
                input: true,
                expectedOutput: true,
                id: true
            }
        });

        const { source_code, language_id } = parsed.data;
        if (!req.userId) {
            return sendError(res, 401, "Unauthorized");
        }
        const newSubmission = await prisma.submission.create({
            data: {
                userId: req.userId,
                submittedCode: source_code,
                languageUsed: language_id,
                problemId,
            }
        })
        const batchSubmission = testCases.map((tc) => {
            return {
                source_code,
                language_id,
                stdin: tc.input,
                expected_output: tc.expectedOutput
            }
        });
        const { data } = await axios.post(`${JUDGE0_URL}/submissions/batch?base64_encoded=false`, {
            submissions: batchSubmission
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log("Response", data);
        await prisma.$transaction(
            data.map((result: { token: string }, index: number) => {
                const testCase = testCases[index];
                if (!testCase) {
                    throw new Error(`Test case at index ${index} not found`);
                }
                return prisma.testCaseRun.create({
                    data: {
                        submissionToken: result.token,
                        submissionId: newSubmission.id,
                        testCaseId: testCase.id,
                        status: "PENDING"
                    }
                });
            })
        );
        return res.status(201).json({
            success: true,
            data: {
                submissionId: newSubmission.id
            }
        });

    } catch (err) {
        console.log(err);
        return sendError(res, 500, "Failed to create submission");


    }
});

submissionRouter.get("/poller/:submissionId", async (req, res) => {
    const submissionId = Number(req.params.submissionId);
    if (!submissionId)
        throw new Error("No submission id provided");
    const submission = await prisma.submission.findUnique({
        where: {
            id: submissionId
        },
        select: {
            testRuns: true
        }
    });
    if (!submission) {
        return sendError(res, 404, "Submission not found");
    }
    const tokens = submission.testRuns.map((run) => run.submissionToken);
    const tokenStr = tokens.join(",");
    const { data }: { data: JUDGE0_GET_TOKEN_RES } = await axios.get(`${JUDGE0_URL}/submissions/batch?tokens=${tokenStr}&base64_encoded=false&fields=token,stdin,stdout,stderr,status_id,language_id,expected_output`, {
        headers: {
            "Content-Type": "application/json"
        }
    });

    let submissionStatus: string = "processing";
    const statusIds = data.submissions.map((d) => d.status_id);
    const allAccepted = statusIds.every((id) => id === 3);
    const anyProcessing = statusIds.some((id) => id === 1 || id === 2);

    if (!anyProcessing) {
        if (allAccepted) {
            submissionStatus = "Accepted";
        } else if (statusIds.some((id) => id === 4)) {
            submissionStatus = "Failed";
        } else if (statusIds.some((id) => id === 5)) {
            submissionStatus = "TLE";
        } else if (statusIds.some((id) => id > 5)) {
            submissionStatus = "Compilation Error";
        }
    }

    return res.json({
        success: true,
        data: {
            status: submissionStatus,
            submissions: data.submissions,
        },
    });
});


export default submissionRouter;