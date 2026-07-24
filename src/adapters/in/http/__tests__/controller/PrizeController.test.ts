import { describe, expect, it, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import PrizeController from "../../controller/PrizeController";
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

describe("PrizeController", () => {
  let prizeUseCase: any;
  let controller: PrizeController;

  beforeEach(() => {
    prizeUseCase = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    controller = new PrizeController(prizeUseCase, createFakeLogger());
  });

  describe("create", () => {
    it("deve retornar 201 com os dados do prêmio criado", async () => {
      prizeUseCase.create.mockResolvedValue({ id: 1, name: "Vale Compras" });
      const req = {
        body: { name: "Vale Compras", points_cost: 100 },
        user: { sub: FK_USER },
      } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.create(req, res, next);

      expect(prizeUseCase.create).toHaveBeenCalledWith(req.body, FK_USER);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        description: "Prêmio criado com sucesso",
        data: { id: 1, name: "Vale Compras" },
      });
    });

    it("deve chamar next(err) quando o use case lançar um erro", async () => {
      const error = new AppError("Dados inválidos", 400);
      prizeUseCase.create.mockRejectedValue(error);
      const req = { body: {}, user: { sub: FK_USER } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.create(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("deve retornar 200 com o payload do prêmio", async () => {
      prizeUseCase.findById.mockResolvedValue({ id: 1, name: "Vale Compras" });
      const req = { params: { id: "1" } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.findById(req, res, next);

      expect(prizeUseCase.findById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ payload: { id: 1, name: "Vale Compras" } });
    });

    it("deve chamar next(err) quando o prêmio não for encontrado", async () => {
      const error = new AppError("Prêmio não encontrado", 404);
      prizeUseCase.findById.mockRejectedValue(error);
      const req = { params: { id: "999" } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.findById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("findAll", () => {
    it("deve retornar 200 com a lista de prêmios", async () => {
      prizeUseCase.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
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
      prizeUseCase.update.mockResolvedValue({ id: 1, name: "Atualizado" });
      const req = { params: { id: "1" }, body: { name: "Atualizado" } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.update(req, res, next);

      expect(prizeUseCase.update).toHaveBeenCalledWith("1", { name: "Atualizado" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        description: "Prêmio atualizado com sucesso",
        data: { id: 1, name: "Atualizado" },
      });
    });
  });

  describe("delete", () => {
    it("deve retornar 200 com mensagem de sucesso", async () => {
      prizeUseCase.delete.mockResolvedValue(undefined);
      const req = { params: { id: "1" } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.delete(req, res, next);

      expect(prizeUseCase.delete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ description: "Prêmio removido com sucesso" });
    });

    it("deve chamar next(err) quando o use case lançar um erro", async () => {
      const error = new AppError("Prêmio não encontrado", 404);
      prizeUseCase.delete.mockRejectedValue(error);
      const req = { params: { id: "999" } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.delete(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
