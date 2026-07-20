import Logger from "../../../domain/ports/LoggerPort"
import pino from "pino"

export default class PinoLogger implements Logger {
    private client = pino({level: "info"});

    public info (message: string, obj?: Object): void {
        this.client.info({ message, obj })
    };

    public error (message: string, obj?: Object): void {
        this.client.error({ message, obj })
    };
}