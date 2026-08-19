import { importSPKI, exportJWK } from "jose";
import { Jwk, JwkProviderPort } from "../../../domain/ports/JwkProviderPort";

export default class JoseJwkProvider implements JwkProviderPort {

    private cachedJwk: Jwk | null = null;

    public constructor(
        private readonly publicKey: string,
        private readonly keyId: string,
        private readonly algorithm: string = "RS256"
    ) {}

    public getJwkSet = async (): Promise<{ keys: Jwk[] }> => {
        if (!this.cachedJwk) {
            const key = await importSPKI(this.publicKey, this.algorithm);
            const jwk = await exportJWK(key);

            this.cachedJwk = {
                ...jwk,
                kid: this.keyId,
                use: "sig",
                alg: this.algorithm,
            } as Jwk;
        }

        return { keys: [this.cachedJwk] };
    };
}