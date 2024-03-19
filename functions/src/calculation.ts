export interface CalculateRequest {
    readonly a: number
    readonly b: number
}

export interface Calculation {
    readonly request: CalculateRequest
    readonly sum: number
    readonly user: string
}

export interface CalculationCommand {
    readonly request: CalculateRequest
    readonly user: string
}
