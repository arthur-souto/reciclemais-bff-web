import { Application } from "express";
import ApplicationRunnable from "../../../domain/ports/ApplicationRunnablePort";
import express from "express";
import cors from "cors";
import { Server } from 'http'
import Logger from "../../../domain/ports/LoggerPort";
import multer from "multer";
import EvidenceController from "./EvidenceController";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../../../infrastructure/config/Swagger";

export default class ExpressServerAdapter implements ApplicationRunnable {

    private readonly app: Application = express();
    private readonly upload = multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: 20 * 1024 * 1024 }
    })

    private server: Server | null = null;

    // configuração do express
    // o logger é injetado para que possamos logar eventos do servidor
    constructor(private log: Logger, private evidenceController: EvidenceController) {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.configureRoutes();
    }

    private configureRoutes() {
        this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        /**
         * @openapi
         * /evidence:
         *   post:
         *     summary: Registra uma evidência a partir de uma imagem
         *     tags:
         *       - Evidence
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             type: object
         *             required:
         *               - evidence
         *             properties:
         *               evidence:
         *                 type: string
         *                 format: binary
         *                 description: Arquivo de imagem da evidência
         *     responses:
         *       200:
         *         description: Evidência processada com sucesso
         *       400:
         *         description: Nenhuma imagem enviada
         *       500:
         *         description: Erro ao processar a imagem
         */
        this.app.post("/evidence", this.upload.single("evidence"), this.evidenceController.registerEvidence);
    }

    public async run(port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(port, () => {
                this.log.info(`Server running on port ${port}`);
                resolve();
            });

            this.server.on('error', (err) => {
                this.log.error(`Error starting server on port ${port}`, err);
                reject(err);
            });
        });
    }

    public async stop(): Promise<void> {
        if (this.server) {
            this.server.close(() => {
                this.log.info('Server Stopped');
            });
        }
    }
}