import express, { Application, Router } from "express";
import Logger from "../../../../../domain/ports/LoggerPort";
import { createFakeLogger } from "./fakeLogger";
import { errorHandler } from "../../middleware/errorHandler";

export function buildTestApp(routers: Router | Router[], logger: Logger = createFakeLogger()): Application {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const routerList = Array.isArray(routers) ? routers : [routers]
    routerList.forEach((router) => app.use(router));

    app.use(errorHandler(logger))

    return app;
}