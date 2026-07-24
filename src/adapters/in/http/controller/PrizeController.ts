import { NextFunction, Request, Response } from "express";
import PrizeUseCase from "../../../../application/PrizeUseCase";
import Logger from "../../../../domain/ports/LoggerPort";
import { CreatePrizeDto } from "../../../request/CreatePrizeDTO";
import { UpdatePrizeDto } from "../../../request/UpdatePrizeDTO";

export default class PrizeController {

    public constructor(private prizeUseCase: PrizeUseCase, private log: Logger) {}

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = req.body as CreatePrizeDto;
            this.log.info("Iniciando criação de prêmio", { data: dto });

            const response = await this.prizeUseCase.create(dto, req.user!.sub);
            res.status(201).json({ description: "Prêmio criado com sucesso", data: response });
        }
        catch (err) {
            next(err);
        }
    }

    public findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const response = await this.prizeUseCase.findById(id);
            res.status(200).json({ payload: response });
        }
        catch (err) {
            next(err);
        }
    }

    public findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.prizeUseCase.findAll();
            res.status(200).json({ payload: response });
        }
        catch (err) {
            next(err);
        }
    }

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const dto = req.body as UpdatePrizeDto;
            const response = await this.prizeUseCase.update(id, dto);
            res.status(200).json({ description: "Prêmio atualizado com sucesso", data: response });
        }
        catch (err) {
            next(err);
        }
    }

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            await this.prizeUseCase.delete(id);
            res.status(200).json({ description: "Prêmio removido com sucesso" });
        }
        catch (err) {
            next(err);
        }
    }
}
