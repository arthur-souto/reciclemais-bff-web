import { describe, expect, it, vi } from "vitest";
import { Response, Request } from "express";
import AuthController from "../../adapters/in/http/controller/AuthController";
import { createFakeLogger } from "../helpers/fakeLogger";
import AppError from "../../domain/errors/AppError";


function buildRes() {
    const res: Partial<Response> = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
    };

    return res as Response;
}

describe("AuthController.login", () => {

    it("Deve retornar 200 com acessToken quando credenciais forem válidas", async () => {
        const authUseCases = { sign: vi.fn().mockResolvedValue("jwt-token") } as any;
        const controller = new AuthController(authUseCases, createFakeLogger());

        const req = { body: { email: "test@gmail.com", password: "test123!" } } as Request;
        const res = buildRes();
        const next = vi.fn();

        await controller.login(req, res, next);

        expect(authUseCases.sign).toHaveBeenCalledWith({ email: "test@gmail.com", password: "test123!" });
        expect(res.json).toHaveBeenCalledWith({
            description: "Login realizado com sucesso",
            accessToken: "jwt-token",
        });

        expect(next).not.toHaveBeenCalled()
    });

    it("Deve chamar next(err) quando o use case lançar um erro", async () => {
        const error = new AppError("Credenciais inválidas", 401);
        const authUseCases = { sign: vi.fn().mockRejectedValue(error) } as any;
        const controller = new AuthController(authUseCases, createFakeLogger());

        const req = { body: { email: "test@gmail.com", password: "erro" } } as Request;
        const res = buildRes();
        const next = vi.fn();

        await controller.login(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
    })
})