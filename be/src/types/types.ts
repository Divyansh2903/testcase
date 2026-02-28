export interface Language {
    id: number
    name: string
}

export interface JUDGE0_RES_BODY {
    token?: string
    source_code?: string
    language_id?: number
    status_id: number
    stdin?: string
    expected_output?: string
    stderr?: string | null
    stdout?: string | null
    time?: string | null
    memory?: number | null
}
export interface JUDGE0_GET_TOKEN_RES {
    submissions: JUDGE0_RES_BODY[]
}