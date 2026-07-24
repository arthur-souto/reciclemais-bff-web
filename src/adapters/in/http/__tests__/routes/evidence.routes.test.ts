import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import { evidenceRoutes } from "../../route/evidence.routes";
import EvidenceController from "../../controller/EvidenceController";
import { buildTestApp } from "../helpers/testApp";
import { createFakeLogger } from "../helpers/fakeLogger";
import { createFakeTokenService, VALID_TOKEN } from "../helpers/fakeTokenService";

const authHeader = { Authorization: `Bearer ${VALID_TOKEN}` };

// PNG 1x1 pixel válido (necessário pois o controller processa a imagem com `sharp`)
const VALID_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

describe("POST /evidence", () => {
  let evidenceUseCases: any;
  let app: ReturnType<typeof buildTestApp>;

  beforeEach(() => {
    evidenceUseCases = { analyzeEvidence: vi.fn() };
    const controller = new EvidenceController(evidenceUseCases, createFakeLogger());
    app = buildTestApp(evidenceRoutes(controller, createFakeTokenService()));
  });

  it("deve retornar 401 quando não autenticado", async () => {
    const response = await request(app).post("/evidence").attach("evidence", VALID_PNG, "foto.png");

    expect(response.status).toBe(401);
    expect(evidenceUseCases.analyzeEvidence).not.toHaveBeenCalled();
  });

  it("deve retornar 400 quando nenhuma imagem for enviada", async () => {
    const response = await request(app).post("/evidence").set(authHeader);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Nenhuma imagem enviada");
    expect(evidenceUseCases.analyzeEvidence).not.toHaveBeenCalled();
  });

  it("deve retornar 200 com o resultado da análise quando a imagem for enviada", async () => {
    evidenceUseCases.analyzeEvidence.mockResolvedValue("VALIDADO: separação correta de materiais.");

    const response = await request(app)
      .post("/evidence")
      .set(authHeader)
      .attach("evidence", VALID_PNG, "foto.png");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ description: "VALIDADO: separação correta de materiais." });
    expect(evidenceUseCases.analyzeEvidence).toHaveBeenCalledTimes(1);
  });
});
