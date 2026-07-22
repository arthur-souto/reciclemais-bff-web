import "dotenv/config";
import "reflect-metadata";
import EvidenceController from "./adapters/in/http/EvidenceController";
import ExpressServerAdapter from "./adapters/in/http/ExpressServerAdpater";
import GroqServiceAdpater from "./adapters/out/ai/GroqServiceAdpater";
import PinoLogger from "./adapters/out/logging/PinoLoggerAdpater";
import EvidenceUseCases from "./application/EvidenceUseCases";
import ApplicationRunnable from "./domain/ports/ApplicationRunnablePort";
import Logger from "./domain/ports/LoggerPort";
import { logBanner } from "./infrastructure/config/Banner";
import { poll } from "./infrastructure/database/client";
import UserUseCase from "./application/UserUseCase";
import DrizzleUserRepository from "./infrastructure/repositories/DrizzleUserRepository";
import UserRepositoryPort from "./domain/ports/repository/UserRepositoryPort";
import UserController from "./adapters/in/http/UserController";

const logger: Logger = new PinoLogger();


//groq service adapter
const groqService = new GroqServiceAdpater(
    process.env.GROQ_API_KEY!,
    process.env.GROQ_MODEL || "qwen/qwen3.6-27b",
    logger, process.env.GROQ_VISION_MODEL
|| "qwen/qwen3.6-27b");

//repositories
const userRepository: UserRepositoryPort = new DrizzleUserRepository()

//use cases
const evidenceUseCases = new EvidenceUseCases(groqService);
const userUseCases = new UserUseCase(userRepository)

// controllers
const evidenceController = new EvidenceController(evidenceUseCases, logger);
const userController = new UserController(userUseCases, logger);

// application
const app: ApplicationRunnable = new ExpressServerAdapter(logger, evidenceController, userController);

app.run(Number(process.env.PORT)).then(() => {
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
    poll.end().then(() => logger.info("Database connection pool closed"));
    app.stop().then(() => process.exit(0));
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
