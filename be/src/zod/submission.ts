import z from "zod";

export const submissionSchema=z.object({
    source_code:z.string(),
    language_id:z.number(),
})