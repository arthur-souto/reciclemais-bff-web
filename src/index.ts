import EvidenceController from "./adapters/in/http/EvidenceController";
import ExpressServerAdapter from "./adapters/in/http/ExpressServerAdpater";
import GroqServiceAdpater from "./adapters/out/ai/GroqServiceAdpater";
import PinoLogger from "./adapters/out/logging/PinoLoggerAdpater";
import EvidenceUseCases from "./application/EvidenceUseCases";
import ApplicationRunnable from "./domain/ports/ApplicationRunnablePort";
import Logger from "./domain/ports/LoggerPort";
import { logBanner } from "./infrastructure/config/Banner";
import "dotenv/config";

const logger: Logger = new PinoLogger();


//groq service adapter
const groqService = new GroqServiceAdpater(
    process.env.GROQ_API_KEY!,
    process.env.GROQ_MODEL || "qwen/qwen3.6-27b",
    logger, process.env.GROQ_VISION_MODEL
|| "qwen/qwen3.6-27b");

//use cases
const evidenceUseCases = new EvidenceUseCases(logger, groqService);


// controllers
const evidenceController = new EvidenceController(evidenceUseCases);


// application
const app: ApplicationRunnable = new ExpressServerAdapter(logger, evidenceController);

app.run(3000).then(() => {
    logBanner(logger, {
        appName: "RecicleMais",
        version: "1.0.0",
        port: 3000,
        environment: process.env.NODE_ENV || "development",
    });
}).catch(() => {
    process.exit(1);
});

const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully`);
    app.stop().then(() => process.exit(0));
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
