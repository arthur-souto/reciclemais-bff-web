import { Application } from "express";
import ApplicationRunnable from "../../../domain/ports/ApplicationRunnable";
import express from "express";
import cors from "cors";
import {Server} from 'http'
import Logger from "../../../domain/ports/Logger";

export default class ExpressServerAdapter implements ApplicationRunnable {

    private readonly app: Application = express();
    private server: Server | null = null;  

    // configuração do express
    // o logger é injetado para que possamos logar eventos do servidor
    constructor(private log: Logger) {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
    }

    public async run(port: number): Promise<void> {
        this.server = this.app.listen(port, (err) => {
            if(err) {
                this.log.error(`Error starting server on port ${port}`, err);
                process.exit(1);
            }
            this.log.info(`Server running on port ${port}`);
        });
    }

    public async stop(): Promise<void> {
       if(this.server) {
            this.server.close(() => {
                this.log.info('Server Stopped');
            });
       }
    }
}