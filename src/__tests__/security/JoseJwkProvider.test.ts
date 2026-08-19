import { generateKeyPairSync } from "crypto";
import jwt from "jsonwebtoken";
import { importJWK, jwtVerify } from "jose";
import { describe, expect, it } from "vitest";
import JwtTokenService from "../../adapters/out/security/JwtTokenService";
import JoseJwkProvider from "../../adapters/out/security/JoseJwkProvider";

describe("JoseJwkProvider", () => {
    const { privateKey, publicKey } = generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    const keyId = "test-key-1";

    it("expõe o mesmo kid usado para assinar o token", async () => {
        const tokenService = new JwtTokenService(publicKey, privateKey, "1d", keyId);
        const jwkProvider = new JoseJwkProvider(publicKey, keyId);

        const token = tokenService.sign({
            iss: "recicle-mais",
            sub: "user-1",
            email: "user@example.com",
            aud: "recicle-mais",
        });

        const header = jwt.decode(token, { complete: true })?.header;
        const { keys } = await jwkProvider.getJwkSet();

        expect(header?.kid).toBe(keyId);
        expect(keys).toHaveLength(1);
        expect(keys[0]?.kid).toBe(keyId);
    });

    it("permite validar a assinatura do token usando apenas a chave exposta no JWKS", async () => {
        const tokenService = new JwtTokenService(publicKey, privateKey, "1d", keyId);
        const jwkProvider = new JoseJwkProvider(publicKey, keyId);

        const token = tokenService.sign({
            iss: "recicle-mais",
            sub: "user-1",
            email: "user@example.com",
            aud: "recicle-mais",
        });

        const { keys } = await jwkProvider.getJwkSet();
        const jwk = keys.find((key) => key.kid === keyId);
        const publicKeyFromJwk = await importJWK(jwk as unknown as Record<string, unknown>, "RS256");

        const { payload } = await jwtVerify(token, publicKeyFromJwk);

        expect(payload.sub).toBe("user-1");
        expect(payload.email).toBe("user@example.com");
    });

    it("faz cache do JWK e não reimporta a chave a cada chamada", async () => {
        const jwkProvider = new JoseJwkProvider(publicKey, keyId);

        const first = await jwkProvider.getJwkSet();
        const second = await jwkProvider.getJwkSet();

        expect(first.keys[0]).toBe(second.keys[0]);
    });
});
