import axios from "axios";
import express from "express";
import { JUDGE0_URL } from "../configs/constants.js";
import type { Language } from "../types/types.js";
import { SUPPORTED_LANGUAGES } from "../configs/supportedLanguages.js";

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
submissionRouter.post("/")
export default submissionRouter;