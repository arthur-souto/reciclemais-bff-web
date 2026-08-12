import { describe, expect, it, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import MaterialController from "../../adapters/in/http/controller/MaterialController";
import AppError from "../../domain/errors/AppError";
import { createFakeLogger } from "../helpers/fakeLogger";

const FK_USER = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

function buildRes() {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res as Response;
}

describe("MaterialController", () => {
  let materialUseCase: any;
  let controller: MaterialController;

  beforeEach(() => {
    materialUseCase = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    controller = new MaterialController(materialUseCase, createFakeLogger());
  });

  describe("create", () => {
    it("deve retornar 201 com os dados do material criado", async () => {
      materialUseCase.create.mockResolvedValue({ id: 1, name: "Plástico" });
      const req = {
        body: { name: "Plástico", importance: 3, points_value: 10 },
        user: { sub: FK_USER },
      } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.create(req, res, next);

      expect(materialUseCase.create).toHaveBeenCalledWith(req.body, FK_USER);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        description: "Material criado com sucesso",
        data: { id: 1, name: "Plástico" },
      });
    });

    it("deve chamar next(err) quando o use case lançar um erro", async () => {
      const error = new AppError("Dados inválidos", 400);
      materialUseCase.create.mockRejectedValue(error);
      const req = { body: {}, user: { sub: FK_USER } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.create(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("deve retornar 200 com o payload do material", async () => {
      materialUseCase.findById.mockResolvedValue({ id: 1, name: "Plástico" });
      const req = { params: { id: "1" } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.findById(req, res, next);

      expect(materialUseCase.findById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ payload: { id: 1, name: "Plástico" } });
    });

    it("deve chamar next(err) quando o material não for encontrado", async () => {
      const error = new AppError("Material não encontrado", 404);
      materialUseCase.findById.mockRejectedValue(error);
      const req = { params: { id: "999" } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.findById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("findAll", () => {
    it("deve retornar 200 com a lista paginada de materiais", async () => {
      materialUseCase.findAll.mockResolvedValue({
        data: [{ id: 1 }, { id: 2 }],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      const req = { query: {} } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.findAll(req, res, next);

      expect(materialUseCase.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        payload: [{ id: 1 }, { id: 2 }],
        meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
      });
    });

    it("deve repassar page e limit vindos da query", async () => {
      materialUseCase.findAll.mockResolvedValue({ data: [], total: 0, page: 2, limit: 5, totalPages: 0 });
      const req = { query: { page: "2", limit: "5" } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.findAll(req, res, next);

      expect(materialUseCase.findAll).toHaveBeenCalledWith({ page: 2, limit: 5 });
    });
  });

  describe("update", () => {
    it("deve retornar 200 com os dados atualizados", async () => {
      materialUseCase.update.mockResolvedValue({ id: 1, name: "Atualizado" });
      const req = { params: { id: "1" }, body: { name: "Atualizado" } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.update(req, res, next);

      expect(materialUseCase.update).toHaveBeenCalledWith("1", { name: "Atualizado" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        description: "Material atualizado com sucesso",
        data: { id: 1, name: "Atualizado" },
      });
    });
  });

  describe("delete", () => {
    it("deve retornar 200 com mensagem de sucesso", async () => {
      materialUseCase.delete.mockResolvedValue(undefined);
      const req = { params: { id: "1" } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.delete(req, res, next);

      expect(materialUseCase.delete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ description: "Material removido com sucesso" });
    });

    it("deve chamar next(err) quando o use case lançar um erro", async () => {
      const error = new AppError("Material não encontrado", 404);
      materialUseCase.delete.mockRejectedValue(error);
      const req = { params: { id: "999" } } as unknown as Request;
      const res = buildRes();
      const next = vi.fn();

      await controller.delete(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
