import jwt from "jsonwebtoken";
import { TokenPayload, TokenServicePort } from "../../../domain/TokenServicePort";

export default class JwtTokenService implements TokenServicePort {

    public constructor(
        private readonly secret: string,
        private readonly expiresIn: string = "1d"
    ) {
        if (!secret) {
            throw new Error("JWT_SECRET não configurado");
        }
    }

    public sign = (payload: TokenPayload): string => {
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn as NonNullable<jwt.SignOptions["expiresIn"]> });
    };

    public verify = (token: string): TokenPayload | null => {
        try {
            return jwt.verify(token, this.secret) as TokenPayload;
        } catch {
            return null;
        }
    };
}
