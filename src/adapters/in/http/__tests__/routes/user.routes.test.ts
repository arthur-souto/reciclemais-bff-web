import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import { userRoutes } from "../../route/user.routes";
import UserController from "../../controller/UserController";
import AppError from "../../../../../domain/errors/AppError";
import { buildTestApp } from "../helpers/testApp";
import { createFakeLogger } from "../helpers/fakeLogger";
import { createFakeTokenService, VALID_TOKEN } from "../helpers/fakeTokenService";

const VALID_ID = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
const authHeader = { Authorization: `Bearer ${VALID_TOKEN}` };

describe("user.routes", () => {
    let userUseCase: any;
    let app: ReturnType<typeof buildTestApp>;

    beforeEach(() => {
        userUseCase = {
            createUser: vi.fn(),
            findById: vi.fn(),
            findByEmail: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        };
        const controller = new UserController(userUseCase, createFakeLogger());
        app = buildTestApp(userRoutes(controller, createFakeTokenService()));
    });

    describe("POST /users", () => {
        it("deve criar um usuário e retornar 201 ", async () => {
            userUseCase.createUser.mockResolvedValue({ id: VALID_ID, name: "Pedro" });

            const response = await request(app).post("/users").send({
                name: "Pedro",
                email: "test@gmail.com",
                cpf: "95975315000",
                password: "password123!",
            });

            expect(response.status).toBe(201);
            expect(response.body.description).toBe("Usuario criado com sucesso");
            expect(userUseCase.createUser).toHaveBeenCalledTimes(1);
        });

        it("deve retornar 400 quando faltarem campos obrigatórios", async () => {
            const response = await request(app).post("/users").send({ email: "email" });

            expect(response.status).toBe(400);
            expect(userUseCase.createUser).not.toHaveBeenCalled();
        });

        it("não deve exigir autenticação para criar usuário", async () => {
            userUseCase.createUser.mockResolvedValue({ id: VALID_ID });

            const response = await request(app).post("/users").send({
                name: "Pedro",
                email: "test@gmail.com",
                cpf: "95975315000",
                password: "password123!",
            });

            expect(response.status).not.toBe(401);
        });
    });

    describe("GET /users/:id", () => {
        it("deve retornar 401 quando não houver token", async () => {
            const response = await request(app).get(`/users/${VALID_ID}`);

            expect(response.status).toBe(401);
            expect(userUseCase.findById).not.toHaveBeenCalled();
        });

        it("deve retornar 200 com o usuário quando autenticado e encontrado", async () => {
            userUseCase.findById.mockResolvedValue({ id: VALID_ID, name: "Pedro" });

            const response = await request(app).get(`/users/${VALID_ID}`).set(authHeader);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ payload: { id: VALID_ID, name: "Pedro" } });
        });

        it("deve retornar 404 quando o usuário não for encontrado", async () => {
            userUseCase.findById.mockRejectedValue(new AppError("Usuário não encontrado", 404));

            const response = await request(app).get(`/users/${VALID_ID}`).set(authHeader);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Usuário não encontrado");
        });
    });

    describe("GET /users/email/:email", () => {
        it("deve retornar 200 com o usuário encontrado pelo email", async () => {
            userUseCase.findByEmail.mockResolvedValue({ id: VALID_ID, email: "test@gmail.com" });

            const response = await request(app).get("/users/email/test@gmail.com").set(authHeader);

            expect(response.status).toBe(200);
            expect(userUseCase.findByEmail).toHaveBeenCalledWith("test@gmail.com");
        });
    });

    describe("PATCH /users/:id", () => {
        it("deve atualizar o usuário e retornar 200", async () => {
            userUseCase.update.mockResolvedValue({ id: VALID_ID, name: "Novo Nome" });

            const response = await request(app)
                .patch(`/users/${VALID_ID}`)
                .set(authHeader)
                .send({ name: "Novo Nome" });

            expect(response.status).toBe(200);
            expect(response.body.description).toBe("Usuario atualizado com sucesso");
        });

        it("deve retornar 401 quando não autenticado", async () => {
            const response = await request(app).patch(`/users/${VALID_ID}`).send({ name: "Novo Nome" });

            expect(response.status).toBe(401);
            expect(userUseCase.update).not.toHaveBeenCalled();
        });

        it("deve retornar 400 quando o email informado for inválido", async () => {
            const response = await request(app)
                .patch(`/users/${VALID_ID}`)
                .set(authHeader)
                .send({ email: "nao-e-email" });

            expect(response.status).toBe(400);
            expect(userUseCase.update).not.toHaveBeenCalled();
        });
    });

    describe("DELETE /users/:id", () => {
        it("deve remover o usuário e retornar 200", async () => {
            userUseCase.delete.mockResolvedValue(undefined);

            const response = await request(app).delete(`/users/${VALID_ID}`).set(authHeader);

            expect(response.status).toBe(200);
            expect(response.body.description).toBe("Usuario removido com sucesso");
        });

        it("deve retornar 401 quando não autenticado", async () => {
            const response = await request(app).delete(`/users/${VALID_ID}`);

            expect(response.status).toBe(401);
            expect(userUseCase.delete).not.toHaveBeenCalled();
        });
    });
});
