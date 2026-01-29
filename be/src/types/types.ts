export interface Language {
    id: number
    name: string
}

export interface JUDGE0_RES {
    token?: string
    source_code?: string
    language_id?: string
    stdin?: string
    expected_output?: string
}