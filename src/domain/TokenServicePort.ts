export interface TokenPayload {
    iss: string
    sub: string
    email: string
    aud: string
    role?: string
}

export interface TokenServicePort {
    sign: (payload: TokenPayload) => string;
    verify: (token: string) => TokenPayload | null; 
}