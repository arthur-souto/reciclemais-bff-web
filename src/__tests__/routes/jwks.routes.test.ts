import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import { jwksRoutes } from "../../adapters/in/http/route/jwks";
import { JwkProviderPort } from "../../domain/ports/JwkProviderPort";
import { buildTestApp } from "../helpers/testApp";

describe("GET /.well-known/jwks.json", () => {
    let jwkProvider: JwkProviderPort;
    let app: ReturnType<typeof buildTestApp>;

    beforeEach(() => {
        jwkProvider = { getJwkSet: vi.fn() };
        app = buildTestApp(jwksRoutes(jwkProvider));
    });

    it("deve retornar 200 com o JWKS", async () => {
        const jwkSet = {
            keys: [
                {
                    kty: "RSA",
                    n: "abc",
                    e: "AQAB",
                    kid: "social-app-key-1",
                    use: "sig",
                    alg: "RS256",
                },
            ],
        };
        (jwkProvider.getJwkSet as ReturnType<typeof vi.fn>).mockResolvedValue(jwkSet);

        const response = await request(app).get("/.well-known/jwks.json");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(jwkSet);
        expect(jwkProvider.getJwkSet).toHaveBeenCalledOnce();
    });

    it("deve retornar 500 quando o provedor falhar", async () => {
        (jwkProvider.getJwkSet as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("falha ao gerar jwk"));

        const response = await request(app).get("/.well-known/jwks.json");

        expect(response.status).toBe(500);
    });
});
