import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import { materialRoutes } from "../../route/material.routes";
import MaterialController from "../../controller/MaterialController";
import AppError from "../../../../../domain/errors/AppError";

import { buildTestApp } from "../helpers/testApp";
import { createFakeLogger } from "../helpers/fakeLogger";
import { createFakeTokenService, VALID_TOKEN, DEFAULT_PAYLOAD } from "../helpers/fakeTokenService";
import { EImportance } from "../../../../../domain/models/material";

const authHeader = { Authorization: `Bearer ${VALID_TOKEN}` };

describe("material.routes", () => {
    let materialUseCase: any;
    let app: ReturnType<typeof buildTestApp>;
    let forbiddenApp: ReturnType<typeof buildTestApp>;

    beforeEach(() => {
        materialUseCase = {
            create: vi.fn(),
            findById: vi.fn(),
            findAll: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        };
        const controller = new MaterialController(materialUseCase, createFakeLogger());
        app = buildTestApp(
            materialRoutes(controller, createFakeTokenService({ ...DEFAULT_PAYLOAD, role: "ADMIN" })),
        );
        forbiddenApp = buildTestApp(materialRoutes(controller, createFakeTokenService(DEFAULT_PAYLOAD)));
    });

    describe("POST /materials", () => {
        const validPayload = { name: "Plástico PET", importance: EImportance.LOW, points_value: 10 };

        it("deve retornar 401 sem autenticação", async () => {
            const response = await request(app).post("/materials").send(validPayload);
            expect(response.status).toBe(401);
            expect(materialUseCase.create).not.toHaveBeenCalled();
        });

        it("deve criar o material e retornar 201 quando autenticado e válido", async () => {
            materialUseCase.create.mockResolvedValue({ id: 1, ...validPayload });

            const response = await request(app).post("/materials").set(authHeader).send(validPayload);

            expect(response.status).toBe(201);
            expect(response.body.description).toBe("Material criado com sucesso");
            expect(materialUseCase.create).toHaveBeenCalledWith(
                expect.objectContaining(validPayload),
                "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            );
        });

        it("deve retornar 400 quando 'importance' não for um inteiro", async () => {
            const response = await request(app)
                .post("/materials")
                .set(authHeader)
                .send({ name: "Vidro", importance: "alta", points_value: 5 });

            expect(response.status).toBe(400);
            expect(materialUseCase.create).not.toHaveBeenCalled();
        });

        it("deve retornar 400 quando 'importance' não for uma categoria válida do enum", async () => {
            const response = await request(app)
                .post("/materials")
                .set(authHeader)
                .send({ name: "Vidro", importance: 3, points_value: 5 });

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual(
                expect.arrayContaining([expect.objectContaining({ field: "importance" })]),
            );
            expect(materialUseCase.create).not.toHaveBeenCalled();
        });

        it.each([
            ["extremely_low", EImportance.EXTREMELY_LOW],
            ["very_low", EImportance.VERY_LOW],
            ["low", EImportance.LOW],
            ["medium", EImportance.MEDIUM],
            ["low_importance", EImportance.LOW_IMPORTANCE],
            ["important", EImportance.IMPORTANT],
            ["very_important", EImportance.VERY_IMPORTANT],
        ])("deve aceitar a categoria de importância '%s' (%i)", async (_label, importanceValue) => {
            materialUseCase.create.mockResolvedValue({ id: 1, name: "Papel", importance: importanceValue, points_value: 5 });

            const response = await request(app)
                .post("/materials")
                .set(authHeader)
                .send({ name: "Papel", importance: importanceValue, points_value: 5 });

            expect(response.status).toBe(201);
        });

        it("deve retornar 403 quando o usuário autenticado não for admin", async () => {
            const response = await request(forbiddenApp).post("/materials").set(authHeader).send(validPayload);

            expect(response.status).toBe(403);
            expect(materialUseCase.create).not.toHaveBeenCalled();
        });
    });

    describe("GET /materials", () => {
        it("deve retornar a lista paginada de materiais quando autenticado", async () => {
            materialUseCase.findAll.mockResolvedValue({
                data: [{ id: 1, name: "Plástico" }],
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            });

            const response = await request(app).get("/materials").set(authHeader);

            expect(response.status).toBe(200);
            expect(response.body.payload).toHaveLength(1);
            expect(response.body.meta).toEqual({ total: 1, page: 1, limit: 10, totalPages: 1 });
            expect(materialUseCase.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
        });
    });

    describe("GET /materials/:id", () => {
        it("deve retornar 404 quando o material não existir", async () => {
            materialUseCase.findById.mockRejectedValue(new AppError("Material não encontrado", 404));

            const response = await request(app).get("/materials/999").set(authHeader);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Material não encontrado");
        });

        it("deve retornar 400 quando o use case sinalizar ID inválido", async () => {
            materialUseCase.findById.mockRejectedValue(new AppError("ID inválido", 400));

            const response = await request(app).get("/materials/abc").set(authHeader);

            expect(response.status).toBe(400);
        });
    });

    describe("PATCH /materials/:id", () => {
        it("deve atualizar o material e retornar 200", async () => {
            materialUseCase.update.mockResolvedValue({ id: 1, name: "Atualizado" });

            const response = await request(app)
                .patch("/materials/1")
                .set(authHeader)
                .send({ name: "Atualizado" });

            expect(response.status).toBe(200);
            expect(materialUseCase.update).toHaveBeenCalledWith("1", expect.objectContaining({ name: "Atualizado" }));
        });

        it("deve retornar 403 quando o usuário autenticado não for admin", async () => {
            const response = await request(forbiddenApp)
                .patch("/materials/1")
                .set(authHeader)
                .send({ name: "Atualizado" });

            expect(response.status).toBe(403);
            expect(materialUseCase.update).not.toHaveBeenCalled();
        });
    });

    describe("DELETE /materials/:id", () => {
        it("deve remover o material e retornar 200", async () => {
            materialUseCase.delete.mockResolvedValue(undefined);

            const response = await request(app).delete("/materials/1").set(authHeader);

            expect(response.status).toBe(200);
            expect(response.body.description).toBe("Material removido com sucesso");
        });

        it("deve retornar 401 sem autenticação", async () => {
            const response = await request(app).delete("/materials/1");
            expect(response.status).toBe(401);
            expect(materialUseCase.delete).not.toHaveBeenCalled();
        });

        it("deve retornar 403 quando o usuário autenticado não for admin", async () => {
            const response = await request(forbiddenApp).delete("/materials/1").set(authHeader);

            expect(response.status).toBe(403);
            expect(materialUseCase.delete).not.toHaveBeenCalled();
        });
    });
});
