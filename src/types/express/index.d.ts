import { TokenPayload } from "../../domain/TokenServicePort";

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export {};
