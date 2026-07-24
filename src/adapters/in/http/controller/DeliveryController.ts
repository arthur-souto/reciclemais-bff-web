import { NextFunction, Request, Response } from "express";
import DeliveryUseCase from "../../../../application/DeliveryUseCase";
import Logger from "../../../../domain/ports/LoggerPort";
import { CreateDeliveryDto } from "../../../request/CreateDeliveryDTO";
import { UpdateDeliveryDto } from "../../../request/UpdateDeliveryDTO";

export default class DeliveryController {

    public constructor(private deliveryUseCase: DeliveryUseCase, private log: Logger) {}

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = req.body as CreateDeliveryDto;
            this.log.info("Iniciando criação de entrega", { data: dto });

            const response = await this.deliveryUseCase.create(dto, req.user!.sub);
            res.status(201).json({ description: "Entrega criada com sucesso", data: response });
        }
        catch (err) {
            next(err);
        }
    }

    public findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const response = await this.deliveryUseCase.findById(id);
            res.status(200).json({ payload: response });
        }
        catch (err) {
            next(err);
        }
    }

    public findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.deliveryUseCase.findAll();
            res.status(200).json({ payload: response });
        }
        catch (err) {
            next(err);
        }
    }

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const dto = req.body as UpdateDeliveryDto;
            const response = await this.deliveryUseCase.update(id, dto);
            res.status(200).json({ description: "Entrega atualizada com sucesso", data: response });
        }
        catch (err) {
            next(err);
        }
    }

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            await this.deliveryUseCase.delete(id);
            res.status(200).json({ description: "Entrega removida com sucesso" });
        }
        catch (err) {
            next(err);
        }
    }
}
