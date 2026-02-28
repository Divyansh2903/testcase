const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000")
    : "";

const defaultOptions: RequestInit = {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
};

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthApiError {
  success: false;
  message?: string;
  error?: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (data as AuthApiError).message ??
      (data as AuthApiError).error ??
      res.statusText;
    throw new Error(message);
  }
  return data as T;
}

export const authApi = {
  async signIn(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/sign-in`, {
      ...defaultOptions,
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<{ success: true; data: { user: AuthUser } }>(res);
  },

  async signUp(name: string, email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/sign-up`, {
      ...defaultOptions,
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse<{ success: true; data: AuthUser }>(res);
  },

  async signOut() {
    const res = await fetch(`${API_BASE}/auth/sign-out`, {
      ...defaultOptions,
      method: "POST",
    });
    return handleResponse<{ success: true }>(res);
  },

  async getUser(): Promise<AuthUser | null> {
    const res = await fetch(`${API_BASE}/auth/get-user`, {
      ...defaultOptions,
      method: "GET",
    });
    if (res.status === 401) return null;
    const json = await handleResponse<{ success: true; data: AuthUser }>(res);
    return json.data;
  },
};


const JUDGE0_LANG_IDS = { javascript: 63, python: 71, cpp: 54 } as const;

export type BackendDifficulty = "EASY" | "MEDIUM" | "HARD";

export type BackendProblemStatus = "solved" | "attempted" | "unsolved";

export interface BackendProblemList {
  id: string;
  name: string;
  description: string;
  difficulty: BackendDifficulty;
  timeLimit: number;
  memoryLimit: number;
  published: boolean;
  tags: { title: string }[];
  status?: BackendProblemStatus;
}

export interface BackendProblemDetail extends BackendProblemList {
  examples: { input: string; output: string; explanation: string }[];
  tags: { title: string }[];
  testCases: { input: string; expectedOutput: string }[];
  starterCodes: { languageId: number; code: string }[];
  status?: BackendProblemStatus;
}

export interface SubmissionLanguage {
  id: number;
  name: string;
}

export const problemsApi = {
  async getAll() {
    const res = await fetch(`${API_BASE}/problemset/get-all`, {
      ...defaultOptions,
      method: "GET",
    });
    const json = await handleResponse<{ success: true; data: BackendProblemList[] }>(res);
    return json.data;
  },

  async getById(id: string) {
    const res = await fetch(`${API_BASE}/problemset/${encodeURIComponent(id)}`, {
      ...defaultOptions,
      method: "GET",
    });
    if (res.status === 404) return null;
    const json = await handleResponse<{ success: true; data: BackendProblemDetail }>(res);
    return json.data;
  },
};

export const submissionApi = {
  async getLanguages() {
    const res = await fetch(`${API_BASE}/submission/languages`, {
      ...defaultOptions,
      method: "GET",
    });
    const json = await handleResponse<{ success: true; data: SubmissionLanguage[] }>(res);
    return json.data;
  },

  async submit(problemId: string, source_code: string, language_id: number) {
    const res = await fetch(`${API_BASE}/submission/${encodeURIComponent(problemId)}`, {
      ...defaultOptions,
      method: "POST",
      body: JSON.stringify({ source_code, language_id }),
    });
    const json = await handleResponse<{ success: true; data: { submissionId: number } }>(res);
    return json.data.submissionId;
  },

  async pollResult(submissionId: number) {
    const res = await fetch(`${API_BASE}/submission/poller/${submissionId}`, {
      ...defaultOptions,
      method: "GET",
    });
    const json = await handleResponse<{
      success: true;
      data: { status: string; submissions: unknown[] };
    }>(res);
    return json.data;
  },

  async getLastAccepted(problemId: string) {
    const res = await fetch(
      `${API_BASE}/submission/problem/${encodeURIComponent(problemId)}/last-accepted`,
      { ...defaultOptions, method: "GET" }
    );
    if (res.status === 404) return null;
    const json = await handleResponse<{
      success: true;
      data: { submittedCode: string; languageId: number };
    }>(res);
    return json.data;
  },

  /** Last submission (any status) per language: { [languageId]: { submittedCode } } */
  async getLastByLanguage(problemId: string) {
    const res = await fetch(
      `${API_BASE}/submission/problem/${encodeURIComponent(problemId)}/last-by-language`,
      { ...defaultOptions, method: "GET" }
    );
    if (!res.ok) return null;
    const json = await handleResponse<{
      success: true;
      data: Record<number, { submittedCode: string }>;
    }>(res);
    return json.data;
  },
};

export function mapBackendProblemToList(p: BackendProblemList): import("./types").Problem {
  return {
    id: p.id,
    title: p.name,
    slug: p.id,
    difficulty: p.difficulty.toLowerCase() as "easy" | "medium" | "hard",
    tags: p.tags.map((t) => t.title),
    description: p.description,
    examples: [],
    constraints: [],
    starterCode: { javascript: "", python: "", cpp: "" },
    testCases: [],
    acceptance: 0,
    submissions: 0,
    status: p.status,
  };
}


function buildStarterCode(
  starterCodes: { languageId: number; code: string }[]
): { javascript: string; python: string; cpp: string } {
  const byId: Record<number, string> = {};
  for (const s of starterCodes) byId[s.languageId] = s.code;
  return {
    javascript: byId[JUDGE0_LANG_IDS.javascript] ?? "",
    python: byId[JUDGE0_LANG_IDS.python] ?? "",
    cpp: byId[JUDGE0_LANG_IDS.cpp] ?? "",
  };
}


export function mapBackendProblemToDetail(p: BackendProblemDetail): import("./types").Problem {
  return {
    id: p.id,
    title: p.name,
    slug: p.id,
    difficulty: p.difficulty.toLowerCase() as "easy" | "medium" | "hard",
    tags: p.tags.map((t) => t.title),
    description: p.description,
    examples: p.examples.map((e) => ({
      input: e.input,
      output: e.output,
      explanation: e.explanation,
    })),
    constraints: [],
    starterCode: buildStarterCode(p.starterCodes),
    testCases: p.testCases.map((tc) => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
    })),
    acceptance: 0,
    submissions: 0,
    status: p.status,
  };
}
