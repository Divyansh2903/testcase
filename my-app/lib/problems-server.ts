import type { BackendProblemList } from "./api"
import { mapBackendProblemToList } from "./api"
import type { Problem } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

export async function getProblemsListServer(cookieHeader: string | null): Promise<Problem[]> {
  const res = await fetch(`${API_BASE}/problemset/get-all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const message =
      (data as { message?: string }).message ??
      (data as { error?: string }).error ??
      res.statusText
    throw new Error(message)
  }

  const json = await res.json()
  const data = (json as { data: BackendProblemList[] }).data
  return data.map(mapBackendProblemToList)
}
