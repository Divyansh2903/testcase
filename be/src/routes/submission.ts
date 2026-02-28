import axios from "axios";
import express from "express";
import { JUDGE0_URL } from "../configs/constants.js";
import type { JUDGE0_GET_TOKEN_RES, JUDGE0_RES_BODY, Language } from "../types/types.js";
import { SUPPORTED_LANGUAGES } from "../configs/supportedLanguages.js";
import { submissionSchema } from "../zod/submission.js";
import { sendError } from "../helpers/responseHelpers.js";
import { prisma } from "../lib/prisma.js";

const submissionRouter = express.Router();


function judge0StatusToRunStatus(statusId: number): "AC" | "WA" | "TLE" | "CE" | "RE" | "PENDING" {
    switch (statusId) {
        case 1:
        case 2:
            return "PENDING";
        case 3: return "AC";
        case 4: return "WA";
        case 5: return "TLE";
        case 6: return "CE";
        default: return "RE";
    }
}

function toSubmissionStatus(statusIds: number[]): "ACCEPTED" | "REJECTED" {
    const allAccepted = statusIds.every((id) => id === 3);
    return allAccepted ? "ACCEPTED" : "REJECTED";
}

function normalizeOutput(out: string): string {
    return out
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .trim()
        .split("\n")
        .map((l) => l.trimEnd())
        .join("\n")
        .trimEnd();
}


submissionRouter.get("/languages", async (req, res) => {
    const { data: languages } = (await axios.get<Language[]>(`${JUDGE0_URL}/languages`));

    const filteredLanguages = languages.filter(lang =>
        SUPPORTED_LANGUAGES.some(pattern => pattern.test(lang.name))
    );

    res.json({
        success: true,
        data: filteredLanguages
    });
});

submissionRouter.get("/problem/:problemId/last-accepted", async (req, res) => {
    const problemId = req.params.problemId;
    if (!problemId) {
        return sendError(res, 400, "Problem id required");
    }
    const userId = req.userId;
    if (!userId) {
        return sendError(res, 401, "Unauthorized");
    }
    const submission = await prisma.submission.findFirst({
        where: {
            userId,
            problemId,
            submissionStatus: "ACCEPTED",
        },
        orderBy: { submittedAt: "desc" },
        select: { submittedCode: true, languageUsed: true },
    });
    if (!submission) {
        return res.status(404).json({ success: false, message: "No accepted submission found" });
    }
    res.json({
        success: true,
        data: {
            submittedCode: submission.submittedCode,
            languageId: submission.languageUsed,
        },
    });
});

submissionRouter.get("/problem/:problemId/last-by-language", async (req, res) => {
    const problemId = req.params.problemId;
    if (!problemId) {
        return sendError(res, 400, "Problem id required");
    }
    const userId = req.userId;
    if (!userId) {
        return sendError(res, 401, "Unauthorized");
    }
    const submissions = await prisma.submission.findMany({
        where: { userId, problemId },
        orderBy: { submittedAt: "desc" },
        select: { languageUsed: true, submittedCode: true },
    });
    const byLanguage: Record<number, { submittedCode: string }> = {};
    for (const s of submissions) {
        if (byLanguage[s.languageUsed] == null) {
            byLanguage[s.languageUsed] = { submittedCode: s.submittedCode };
        }
    }
    res.json({
        success: true,
        data: byLanguage,
    });
});

submissionRouter.post("/:problemId", async (req, res) => {
    const parsed = submissionSchema.safeParse(req.body);
    if (!parsed.success) {
        return sendError(res, 400, "Invalid submission");
    }
    const problemId = req.params.problemId;

    try {
        const testCases = await prisma.testCase.findMany({
            where: { problemId },
            select: { input: true, expectedOutput: true, id: true },
            orderBy: { id: "asc" },
        });
        if (testCases.length === 0) {
            return sendError(res, 400, "Problem has no test cases");
        }

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
        const results = Array.isArray(data) ? data : (data as { submissions?: unknown[] })?.submissions;
        if (!Array.isArray(results) || results.length !== testCases.length) {
            console.error("[submission POST] Judge0 batch response invalid:", typeof data, Array.isArray(data) ? data?.length : (data as { submissions?: unknown[] })?.submissions?.length);
            return sendError(res, 502, "Judge0 returned an invalid response. Check JUDGE0_MACHINE_URL and Judge0 status.");
        }
        await prisma.$transaction(
            results.map((result: { token?: string }, index: number) => {
                const testCase = testCases[index];
                if (!testCase) {
                    throw new Error(`Test case at index ${index} not found`);
                }
                const token = result?.token ?? "";
                if (!token) {
                    throw new Error(`Judge0 did not return a token for test case ${index + 1}`);
                }
                return prisma.testCaseRun.create({
                    data: {
                        submissionToken: token,
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
        console.error("[submission POST] error:", err);
        const message =
            axios.isAxiosError(err)
                ? err.response?.data?.error ?? err.response?.statusText ?? err.message ?? "Judge0 request failed"
                : err instanceof Error
                    ? err.message
                    : "Failed to create submission";
        return sendError(res, 500, message);
    }
});

submissionRouter.get("/poller/:submissionId", async (req, res) => {
    const submissionId = Number(req.params.submissionId);
    if (!submissionId || !Number.isInteger(submissionId)) {
        return sendError(res, 400, "Invalid submission id");
    }
    const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        select: {
            userId: true,
            submissionStatus: true,
            testRuns: {
                orderBy: { testCaseId: "asc" },
                select: {
                    id: true,
                    submissionToken: true,
                    testCaseId: true,
                    testCase: { select: { expectedOutput: true } },
                },
            },
        },
    });
    if (!submission) {
        return sendError(res, 404, "Submission not found");
    }
    if (req.userId !== submission.userId) {
        return sendError(res, 403, "Forbidden");
    }
    const tokens = submission.testRuns.map((r) => r.submissionToken);
    const tokenStr = tokens.join(",");
    const fields = "token,stdin,stdout,stderr,status_id,language_id,expected_output,time,memory";
    const { data }: { data: JUDGE0_GET_TOKEN_RES } = await axios.get(
        `${JUDGE0_URL}/submissions/batch?tokens=${tokenStr}&base64_encoded=false&fields=${fields}`,
        { headers: { "Content-Type": "application/json" } }
    );

    type RawSubmission = (JUDGE0_RES_BODY & { token?: string }) & { status?: { id?: number } };
    const rawSubmissions = data.submissions as RawSubmission[] | undefined;
    const normalizeJudgeSubmission = (s: RawSubmission): JUDGE0_RES_BODY => ({
        ...s,
        status_id: s.status_id ?? s.status?.id ?? 0,
    });
    const byToken = new Map(rawSubmissions?.map((s) => [s.token ?? "", normalizeJudgeSubmission(s)]) ?? []);
    const judgeResults: (JUDGE0_RES_BODY | undefined)[] = tokens.map((t) => byToken.get(t));
    const statusIds = judgeResults.map((d) => d?.status_id ?? 0);
    const expectedOutputsByRun = submission.testRuns.map((r) => r.testCase.expectedOutput);
    const correctedStatusIds = statusIds.map((id, i) => {
        if (id !== 4) return id;
        const r = judgeResults[i];
        if (!r) return id;
        const expected = (r.expected_output ?? expectedOutputsByRun[i] ?? "").trim();
        const actual = (r.stdout ?? "").trim();
        if (expected === "" && actual === "") return id;
        const match = normalizeOutput(expected) === normalizeOutput(actual);
        return match ? 3 : id;
    });
    const anyProcessing = correctedStatusIds.some((id) => id === 1 || id === 2);
    let submissionStatus: string = "processing";

    if (!anyProcessing) {
        submissionStatus = correctedStatusIds.every((id) => id === 3)
            ? "Accepted"
            : correctedStatusIds.some((id) => id === 4)
                ? "Failed"
                : correctedStatusIds.some((id) => id === 5)
                    ? "TLE"
                    : correctedStatusIds.some((id) => id > 5)
                        ? "Compilation Error"
                        : "Failed";

        const runs = submission.testRuns;
        if (runs.length === judgeResults.length && submission.submissionStatus === "PENDING") {
            const dbStatus = toSubmissionStatus(correctedStatusIds);
            await prisma.$transaction(async (tx) => {
                for (let i = 0; i < runs.length; i++) {
                    const run = runs[i];
                    const result = judgeResults[i];
                    if (!run) continue;
                    const time = result?.time != null ? parseFloat(result.time) : null;
                    await tx.testCaseRun.update({
                        where: { id: run.id },
                        data: {
                            actualOutput: result?.stdout ?? null,
                            status: judge0StatusToRunStatus(correctedStatusIds[i] ?? result?.status_id ?? 0),
                            time: Number.isFinite(time) ? time : null,
                            memory: result?.memory ?? null,
                        },
                    });
                }
                await tx.submission.update({
                    where: { id: submissionId },
                    data: { submissionStatus: dbStatus },
                });
            });
        }
    }

    const submissionsWithCorrectedStatus = judgeResults.map((s, i) => {
        if (s == null) {
            return { token: tokens[i], status_id: 0, stdout: null, stderr: null };
        }
        return {
            token: s.token,
            status_id: correctedStatusIds[i] ?? s.status_id,
            stdout: s.stdout ?? null,
            stderr: s.stderr ?? null,
            time: s.time ?? null,
            memory: s.memory ?? null,
        };
    });

    return res.json({
        success: true,
        data: {
            status: submissionStatus,
            submissions: submissionsWithCorrectedStatus,
        },
    });
});


export default submissionRouter;