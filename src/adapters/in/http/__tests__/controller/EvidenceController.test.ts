import { describe, expect, it, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import EvidenceController from "../../controller/EvidenceController";
import AppError from "../../../../../domain/errors/AppError";
import { createFakeLogger } from "../helpers/fakeLogger";

// PNG 1x1 pixel válido (o controller processa a imagem com `sharp` via GenerateBufferByImage)
const VALID_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

function buildRes() {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res as Response;
}

describe("EvidenceController", () => {
  let evidenceUseCases: any;
  let controller: EvidenceController;

  beforeEach(() => {
    evidenceUseCases = { initAnalyze: vi.fn() };
    controller = new EvidenceController(evidenceUseCases, createFakeLogger());
  });

  it("deve retornar 200 com o resultado da análise quando uma imagem for enviada", async () => {
    const analysisResult = {
      validado: true,
      motivo: "separação correta de materiais.",
      qualidade: 1,
      pontuacao_final: 10,
    };
    evidenceUseCases.initAnalyze.mockResolvedValue(analysisResult);

    const req = {
      file: { buffer: VALID_PNG, mimetype: "image/png" },
      params: { id: "1" },
    } as unknown as Request;
    const res = buildRes();
    const next = vi.fn();

    await controller.registerEvidence(req, res, next);

    expect(evidenceUseCases.initAnalyze).toHaveBeenCalledTimes(1);
    expect(evidenceUseCases.initAnalyze.mock.calls[0][0].deliveryId).toBe(1);
    expect(evidenceUseCases.initAnalyze.mock.calls[0][0].imageUrl).toMatch(/^data:image\/png;base64,/);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      description: analysisResult,
    });
  });

  it("deve chamar next(err) com AppError 400 quando nenhuma imagem for enviada", async () => {
    const req = { params: { id: "1" } } as unknown as Request;
    const res = buildRes();
    const next = vi.fn();

    await controller.registerEvidence(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0]![0]!;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe("Nenhuma imagem enviada");
    expect(evidenceUseCases.initAnalyze).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("deve chamar next(err) com AppError 400 quando nenhum id de entrega for informado", async () => {
    const req = {
      file: { buffer: VALID_PNG, mimetype: "image/png" },
      params: {},
    } as unknown as Request;
    const res = buildRes();
    const next = vi.fn();

    await controller.registerEvidence(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0]![0]!;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe("Nenhuma imagem enviada");
    expect(evidenceUseCases.initAnalyze).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("deve chamar next(err) quando o use case de análise lançar um erro", async () => {
    const error = new Error("Falha ao comunicar com o serviço de IA");
    evidenceUseCases.initAnalyze.mockRejectedValue(error);

    const req = {
      file: { buffer: VALID_PNG, mimetype: "image/png" },
      params: { id: "1" },
    } as unknown as Request;
    const res = buildRes();
    const next = vi.fn();

    await controller.registerEvidence(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
});
