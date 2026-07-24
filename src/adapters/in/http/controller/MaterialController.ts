import { NextFunction, Request, Response } from "express";
import MaterialUseCase from "../../../../application/MaterialUseCase";
import Logger from "../../../../domain/ports/LoggerPort";
import { CreateMaterialDto } from "../../../request/CreateMaterialDTO";
import { UpdateMaterialDto } from "../../../request/UpdateMaterialDTO";

export default class MaterialController {

    public constructor(private materialUseCase: MaterialUseCase, private log: Logger) {}

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = req.body as CreateMaterialDto;
            this.log.info("Iniciando criação de material", { data: dto });

            const response = await this.materialUseCase.create(dto, req.user!.sub);
            res.status(201).json({ description: "Material criado com sucesso", data: response });
        }
        catch (err) {
            next(err);
        }
    }

    public findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const response = await this.materialUseCase.findById(id);
            res.status(200).json({ payload: response });
        }
        catch (err) {
            next(err);
        }
    }

    public findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.materialUseCase.findAll();
            res.status(200).json({ payload: response });
        }
        catch (err) {
            next(err);
        }
    }

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const dto = req.body as UpdateMaterialDto;
            const response = await this.materialUseCase.update(id, dto);
            res.status(200).json({ description: "Material atualizado com sucesso", data: response });
        }
        catch (err) {
            next(err);
        }
    }

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            await this.materialUseCase.delete(id);
            res.status(200).json({ description: "Material removido com sucesso" });
        }
        catch (err) {
            next(err);
        }
    }
}
