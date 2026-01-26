import type { Response } from "express";

export function sendError(res: Response, code: number, error: string) {
    return res.status(code).json({ success: false, error });
}

