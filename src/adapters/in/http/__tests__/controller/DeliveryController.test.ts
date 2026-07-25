import { describe, expect, it, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import DeliveryController from "../../controller/DeliveryController";
import AppError from "../../../../../domain/errors/AppError";
import { createFakeLogger } from "../helpers/fakeLogger";

const FK_USER = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

function buildRes() {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res as Response;
}

describe("DeliveryController", () => {
  let deliveryUseCase: any;
  let controller: DeliveryController;

  beforeEach(() => {
    deliveryUseCase = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    controller = new DeliveryController(deliveryUseCase, createFakeLogger());
  });

  describe("create", () => {
    it("deve retornar 201 com os dados da entrega criada", async () => {
      deliveryUseCase.create.mockResolvedValue({ id: 1, fk_material: 2 });
      const req = {
        body: { fk_material: 2, weight: 5 },
        user: { sub: FK_USER },
      } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.create(req, res, next);

      expect(deliveryUseCase.create).toHaveBeenCalledWith(req.body, FK_USER);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        description: "Entrega criada com sucesso",
        data: { id: 1, fk_material: 2 },
      });
    });

    it("deve chamar next(err) quando o material referenciado não existir", async () => {
      const error = new AppError("Material não encontrado", 404);
      deliveryUseCase.create.mockRejectedValue(error);
      const req = { body: { fk_material: 999 }, user: { sub: FK_USER } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.create(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("deve retornar 200 com o payload da entrega", async () => {
      deliveryUseCase.findById.mockResolvedValue({ id: 1 });
      const req = { params: { id: "1" } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.findById(req, res, next);

      expect(deliveryUseCase.findById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ payload: { id: 1 } });
    });

    it("deve chamar next(err) quando a entrega não for encontrada", async () => {
      const error = new AppError("Entrega não encontrada", 404);
      deliveryUseCase.findById.mockRejectedValue(error);
      const req = { params: { id: "999" } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.findById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("findAll", () => {
    it("deve retornar 200 com a lista de entregas", async () => {
      deliveryUseCase.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      const req = {} as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.findAll(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ payload: [{ id: 1 }, { id: 2 }] });
    });
  });

  describe("update", () => {
    it("deve retornar 200 com os dados atualizados", async () => {
      deliveryUseCase.update.mockResolvedValue({ id: 1, weight: 8 });
      const req = { params: { id: "1" }, body: { weight: 8 } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.update(req, res, next);

      expect(deliveryUseCase.update).toHaveBeenCalledWith("1", { weight: 8 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        description: "Entrega atualizada com sucesso",
        data: { id: 1, weight: 8 },
      });
    });
  });

  describe("delete", () => {
    it("deve retornar 200 com mensagem de sucesso", async () => {
      deliveryUseCase.delete.mockResolvedValue(undefined);
      const req = { params: { id: "1" } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.delete(req, res, next);

      expect(deliveryUseCase.delete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ description: "Entrega removida com sucesso" });
    });

    it("deve chamar next(err) quando o use case lançar um erro", async () => {
      const error = new AppError("Entrega não encontrada", 404);
      deliveryUseCase.delete.mockRejectedValue(error);
      const req = { params: { id: "999" } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.delete(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
