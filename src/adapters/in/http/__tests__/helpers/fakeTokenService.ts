import { vi } from "vitest";
import { TokenPayload, TokenServicePort } from "../../../../../domain/TokenServicePort";

export const VALID_TOKEN = "valid-token";

export const DEFAULT_PAYLOAD: TokenPayload = {
    iss: "reciclemais-bff",
    sub: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    email: "user@example.com",
    aud: "reciclemais-web",
    role: "USER",
}

export function createFakeTokenService(payload: TokenPayload = DEFAULT_PAYLOAD): TokenServicePort {
    return {
        sign: vi.fn().mockReturnValue(VALID_TOKEN),
        verify: vi.fn((token: string) => (token === VALID_TOKEN ? payload : null))
    }
}