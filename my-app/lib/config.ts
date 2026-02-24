/**
 * When true, problems are loaded from the backend API and submissions
 * go to Judge0 via the backend. When false, problems come from local
 * data (lib/data.ts) and Run/Submit use simulated results.
 */
export const isDBloaded =
  process.env.NEXT_PUBLIC_USE_DB_PROBLEMS === "true";
