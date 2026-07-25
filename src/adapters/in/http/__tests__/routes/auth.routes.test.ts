import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { buildTestApp } from "../helpers/testApp";
import AuthController from "../../controller/AuthController";
import { createFakeLogger } from "../helpers/fakeLogger";
import AppError from "../../../../../domain/errors/AppError";
import { authRoutes } from "../../route/auth.routes";


describe("POST /auth/login", () => {
    let authUseCases: any;
    let app: ReturnType<typeof buildTestApp>

    beforeEach(() => {
        authUseCases = { sign: vi.fn() };
        const controller = new AuthController(authUseCases, createFakeLogger());
        app = buildTestApp(authRoutes(controller));
    });

    it("Deve retornar status 200", async () => {
        authUseCases.sign.mockResolvedValue("jwt-token-valido");

        const response = await request(app)
            .post("/auth/login")
            .send({ email: "test@gmail.com", password: "password123!" });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            description: "Login realizado com sucesso",
            accessToken: "jwt-token-valido",
        });

    });

    it("deve retornar 400 se o e-mail for inválido", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({ email: "inválido", password: "test123!" });

        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([expect.objectContaining({ field: "email" })])
        );
        expect(authUseCases.sign).not.toHaveBeenCalled()
    });

    it("deve retornar caso não insira senha", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({ email: "test@gmail.com" });

        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([expect.objectContaining({ field: "password" })])
        );
    })

    it("deve retornar 401 quando as credenciais forem inválidas", async () => {
        authUseCases.sign.mockRejectedValue(new AppError("Credenciais inválidas", 401));

        const response = await request(app)
            .post("/auth/login")
            .send({ email: "test@gmail.com", password: "wrongPassword" });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Credenciais inválidas");

    })
})

