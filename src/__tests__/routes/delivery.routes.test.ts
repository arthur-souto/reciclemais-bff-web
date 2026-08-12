import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import { deliveryRoutes } from "../../adapters/in/http/route/delivery.routes";
import DeliveryController from "../../adapters/in/http/controller/DeliveryController";
import AppError from "../../domain/errors/AppError";

import { buildTestApp } from "../helpers/testApp";
import { createFakeLogger } from "../helpers/fakeLogger";
import { createFakeTokenService, VALID_TOKEN, DEFAULT_PAYLOAD } from "../helpers/fakeTokenService";
import { DeliveryStatus } from "../../domain/models/delivery";

const authHeader = { Authorization: `Bearer ${VALID_TOKEN}` };

describe("delivery.routes", () => {
    let deliveryUseCase: any;
    let app: ReturnType<typeof buildTestApp>;

    const validPayload = {
        local: "Ecoponto Centro",
        material_type: "Plástico",
        collected_at: Date.now(),
        quantity: 2,
        weight: 5,
        total_score: 10,
        latitude: 1,
        longitude: 1,
        fk_material: 1,
    };

    beforeEach(() => {
        deliveryUseCase = {
            create: vi.fn(),
            findById: vi.fn(),
            findAll: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        };
        const controller = new DeliveryController(deliveryUseCase, createFakeLogger());
        app = buildTestApp(
            deliveryRoutes(controller, createFakeTokenService(DEFAULT_PAYLOAD)),
        );
    });

    describe("POST /deliveries", () => {
        it("deve retornar 401 sem autenticação", async () => {
            const response = await request(app).post("/deliveries").send(validPayload);

            expect(response.status).toBe(401);
            expect(deliveryUseCase.create).not.toHaveBeenCalled();
        });


        it("deve criar a entrega e retornar 201 quando autenticado e válido", async () => {
            deliveryUseCase.create.mockResolvedValue({ id: 1, ...validPayload });

            const response = await request(app).post("/deliveries").set(authHeader).send(validPayload);

            expect(response.status).toBe(201);
            expect(response.body.description).toBe("Entrega criada com sucesso");
            expect(deliveryUseCase.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    local: validPayload.local,
                    material_type: validPayload.material_type,
                    quantity: validPayload.quantity,
                    weight: validPayload.weight,
                    total_score: validPayload.total_score,
                    latitude: validPayload.latitude,
                    longitude: validPayload.longitude,
                    fk_material: validPayload.fk_material,
                }),
                DEFAULT_PAYLOAD.sub,
            );
        });

        it("deve retornar 404 quando o material referenciado não existir", async () => {
            deliveryUseCase.create.mockRejectedValue(new AppError("Material não encontrado", 404));

            const response = await request(app).post("/deliveries").set(authHeader).send(validPayload);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Material não encontrado");
        });

        it("deve aceitar a criação quando 'collected_at' não for enviado (campo opcional)", async () => {
            const { collected_at, ...payload } = validPayload;
            deliveryUseCase.create.mockResolvedValue({ id: 1, ...payload });

            const response = await request(app).post("/deliveries").set(authHeader).send(payload);

            expect(response.status).toBe(201);
            expect(deliveryUseCase.create).toHaveBeenCalled();
        });

        it("deve retornar 400 quando 'latitude' não for enviada", async () => {
            const { latitude, ...payload } = validPayload;

            const response = await request(app).post("/deliveries").set(authHeader).send(payload);

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual(
                expect.arrayContaining([expect.objectContaining({ field: "latitude" })]),
            );
            expect(deliveryUseCase.create).not.toHaveBeenCalled();
        });

        it("deve retornar 400 quando 'longitude' não for enviada", async () => {
            const { longitude, ...payload } = validPayload;

            const response = await request(app).post("/deliveries").set(authHeader).send(payload);

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual(
                expect.arrayContaining([expect.objectContaining({ field: "longitude" })]),
            );
            expect(deliveryUseCase.create).not.toHaveBeenCalled();
        });

        it("deve retornar 400 quando 'local' não for enviado", async () => {
            const { local, ...payload } = validPayload;

            const response = await request(app).post("/deliveries").set(authHeader).send(payload);

            expect(response.status).toBe(400);
            expect(deliveryUseCase.create).not.toHaveBeenCalled();
        });
    });

    describe("GET /deliveries", () => {
        it("deve retornar 401 sem autenticação", async () => {
            const response = await request(app).get("/deliveries");

            expect(response.status).toBe(401);
        });

        it("deve retornar 200 com a lista paginada de entregas quando autenticado", async () => {
            deliveryUseCase.findAll.mockResolvedValue({
                data: [{ id: 1, local: "Ecoponto Centro" }],
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            });

            const response = await request(app).get("/deliveries").set(authHeader);

            expect(response.status).toBe(200);
            expect(response.body.payload).toHaveLength(1);
            expect(response.body.meta).toEqual({ total: 1, page: 1, limit: 10, totalPages: 1 });
            expect(deliveryUseCase.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
        });
    });

    describe("GET /deliveries/:id", () => {
        it("deve retornar 200 com a entrega encontrada", async () => {
            deliveryUseCase.findById.mockResolvedValue({ id: 1, local: "Ecoponto Centro" });

            const response = await request(app).get("/deliveries/1").set(authHeader);

            expect(response.status).toBe(200);
            expect(response.body.payload).toEqual({ id: 1, local: "Ecoponto Centro" });
        });

        it("deve retornar 404 quando a entrega não existir", async () => {
            deliveryUseCase.findById.mockRejectedValue(new AppError("Entrega não encontrada", 404));

            const response = await request(app).get("/deliveries/999").set(authHeader);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Entrega não encontrada");
        });
    });

    describe("PATCH /deliveries/:id", () => {
        it("deve atualizar a entrega e retornar 200", async () => {
            deliveryUseCase.update.mockResolvedValue({ id: 1, weight: 8 });

            const response = await request(app)
                .patch("/deliveries/1")
                .set(authHeader)
                .send({ weight: 8, latitude: 2, longitude: 2 });

            expect(response.status).toBe(200);
            expect(deliveryUseCase.update).toHaveBeenCalledWith(
                "1",
                expect.objectContaining({ weight: 8, latitude: 2, longitude: 2 }),
            );
        });

        it("deve retornar 400 quando 'status' não for uma categoria válida do enum", async () => {
            const response = await request(app)
                .patch("/deliveries/1")
                .set(authHeader)
                .send({ status: "EM_ANDAMENTO" });

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual(
                expect.arrayContaining([expect.objectContaining({ field: "status" })]),
            );
            expect(deliveryUseCase.update).not.toHaveBeenCalled();
        });

        it("deve aceitar a atualização de status para um valor válido do enum", async () => {
            deliveryUseCase.update.mockResolvedValue({ id: 1, status: DeliveryStatus.COMPLETED });

            const response = await request(app)
                .patch("/deliveries/1")
                .set(authHeader)
                .send({ status: DeliveryStatus.COMPLETED });

            expect(response.status).toBe(200);
        });

        it("deve retornar 404 quando a entrega não existir", async () => {
            deliveryUseCase.update.mockRejectedValue(new AppError("Entrega não encontrada", 404));

            const response = await request(app).patch("/deliveries/999").set(authHeader).send({ weight: 8 });

            expect(response.status).toBe(404);
        });
    });

    describe("DELETE /deliveries/:id", () => {
        it("deve remover a entrega e retornar 200", async () => {
            deliveryUseCase.delete.mockResolvedValue(undefined);

            const response = await request(app).delete("/deliveries/1").set(authHeader);

            expect(response.status).toBe(200);
            expect(response.body.description).toBe("Entrega removida com sucesso");
        });

        it("deve retornar 401 sem autenticação", async () => {
            const response = await request(app).delete("/deliveries/1");

            expect(response.status).toBe(401);
            expect(deliveryUseCase.delete).not.toHaveBeenCalled();
        });

        it("deve retornar 404 quando a entrega não existir", async () => {
            deliveryUseCase.delete.mockRejectedValue(new AppError("Entrega não encontrada", 404));

            const response = await request(app).delete("/deliveries/999").set(authHeader);

            expect(response.status).toBe(404);
        });
    });
});