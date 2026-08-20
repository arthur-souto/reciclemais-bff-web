import { describe, expect, it, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import UserController from "../../adapters/in/http/controller/UserController";
import AppError from "../../domain/errors/AppError";
import { createFakeLogger } from "../helpers/fakeLogger";

function buildRes() {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res as Response;
}

describe("UserController", () => {
  let userUseCase: any;
  let controller: UserController;

  beforeEach(() => {
    userUseCase = {
      createUser: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    controller = new UserController(userUseCase, createFakeLogger());
  });

  it("createUser: deve retornar 201 com os dados do usuário criado", async () => {
    userUseCase.createUser.mockResolvedValue({ id: "1", name: "Fulano" });
    const req = {
      body: { name: "Fulano", email: "fulano@example.com", cpf: "12345678900", password: "senha123" },
    } as Request;
    const res = buildRes();
    const next = vi.fn();

    await controller.createUser(req, res, next);

    expect(userUseCase.createUser).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      description: "Usuario criado com sucesso",
      data: { id: "1", name: "Fulano" },
    });
  });

  it("createUser: deve chamar next(err) em caso de falha", async () => {
    const error = new AppError("Email já cadastrado", 409);
    userUseCase.createUser.mockRejectedValue(error);
    const req = { body: {} } as Request;
    const res = buildRes();
    const next = vi.fn();

    await controller.createUser(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("findById: deve retornar 200 com o payload do usuário", async () => {
    userUseCase.findById.mockResolvedValue({ id: "1", name: "Fulano" });
    const req = { params: { id: "1" } } as unknown as Request;
    const res = buildRes();
    const next = vi.fn();

    await controller.findById(req, res, next);

    expect(userUseCase.findById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ payload: { id: "1", name: "Fulano" } });
  });

  it("findById: deve propagar erro de 'usuário não encontrado' via next", async () => {
    const error = new AppError("Usuário não encontrado", 404);
    userUseCase.findById.mockRejectedValue(error);
    const req = { params: { id: "inexistente" } } as unknown as Request;
    const res = buildRes();
    const next = vi.fn();

    await controller.findById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("findByEmail: deve retornar 200 com o payload do usuário", async () => {
    userUseCase.findByEmail.mockResolvedValue({ id: "1", email: "fulano@example.com" });
    const req = { params: { email: "fulano@example.com" } } as unknown as Request;
    const res = buildRes();
    const next = vi.fn();

    await controller.findByEmail(req, res, next);

    expect(userUseCase.findByEmail).toHaveBeenCalledWith("fulano@example.com");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("update: deve retornar 200 com os dados atualizados", async () => {
    userUseCase.update.mockResolvedValue({ id: "1", name: "Atualizado" });
    const req = { user: { sub: "1" }, body: { name: "Atualizado" } } as unknown as Request;
    const res = buildRes();
    const next = vi.fn();

    await controller.update(req, res, next);

    expect(userUseCase.update).toHaveBeenCalledWith("1", { name: "Atualizado" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      description: "Usuario atualizado com sucesso",
      data: { id: "1", name: "Atualizado" },
    });
  });

  it("delete: deve retornar 200 com mensagem de sucesso", async () => {
    userUseCase.delete.mockResolvedValue(undefined);
    const req = { user: { sub: "1" } } as unknown as Request;
    const res = buildRes();
    const next = vi.fn();

    await controller.delete(req, res, next);

    expect(userUseCase.delete).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ description: "Usuario removido com sucesso" });
  });

  it("findAll: deve retornar 200 com a lista paginada de usuários", async () => {
    userUseCase.findAll.mockResolvedValue({
      data: [{ id: "1" }, { id: "2" }],
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
    const req = { query: {} } as unknown as Request;
    const res = buildRes();
    const next = vi.fn();

    await controller.findAll(req, res, next);

    expect(userUseCase.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      payload: [{ id: "1" }, { id: "2" }],
      meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
    });
  });
});
