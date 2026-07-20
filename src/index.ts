import ExpressServerAdapter from "./adapters/in/http/ExpressServerAdpater";
import PinoLogger from "./adapters/out/logging/PinoLogger";
import ApplicationRunnable from "./domain/ports/ApplicationRunnable";
import Logger from "./domain/ports/Logger";
import { logBanner } from "./infrastructure/config/Banner";

const logger: Logger = new PinoLogger();
const app: ApplicationRunnable = new ExpressServerAdapter(logger);

app.run(3000).then(() => {
    logBanner(logger, {
    appName: "RecicleMais",
    version: "1.0.0",
    port: 3000,
    environment: process.env.NODE_ENV || "development",
  });
});