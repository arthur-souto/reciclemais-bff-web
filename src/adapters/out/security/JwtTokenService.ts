import jwt from "jsonwebtoken";
import { TokenPayload, TokenServicePort } from "../../../domain/TokenServicePort";

export default class JwtTokenService implements TokenServicePort {

    private readonly ALGORITHM = "RS256";

    public constructor(
        private readonly publicKey: string,
        private readonly privateKey: string,
        private readonly expiresIn: string = "1d"
    ) {
        if (!privateKey) {
            throw new Error("JWT_PRIVATE_KEY não configurado");
        }
        if (!publicKey) {
            throw new Error("JWT_PUBLIC_KEY não configurado");
        }
    }

    public sign = (payload: TokenPayload): string => {
        return jwt.sign(
            payload,
            this.privateKey,
            {
                algorithm: this.ALGORITHM,
                expiresIn: this.expiresIn as NonNullable<jwt.SignOptions["expiresIn"]>
            }

        );
    };

    public verify = (token: string): TokenPayload | null => {
        try {
            return jwt.verify(
                token, this.publicKey,
                {
                    algorithms: [this.ALGORITHM]
                }
            ) as TokenPayload;
        } catch {
            return null;
        }
    };
}
