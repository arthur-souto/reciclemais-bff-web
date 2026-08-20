import UserUseCase from "../../../../application/UserUseCase";
import { NextFunction, Request, Response } from "express"
import { CreateUserDto } from "../../../request/CreateUserDTO";
import { UpdateUserDto } from "../../../request/UpdateUserDTO";
import { fromUserCreateRequest } from "../../../out/mapper/UserMapper";
import Logger from "../../../../domain/ports/LoggerPort";
import { parsePagination, paginatedPayload } from "../utils/pagination";


export default class UserController {

    public constructor(private userUseCase: UserUseCase, private log: Logger) {}

    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = req.body as CreateUserDto;
            this.log.info("Iniciando criação de usuario", {data: dto});

            const response = await this.userUseCase.createUser(fromUserCreateRequest(dto));
            res.status(201).json({description: "Usuario criado com sucesso", data: response});
        }
        catch (err) {
            next(err);
        }
    }

    public findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.userUseCase.findAll(parsePagination(req));
            res.status(200).json(paginatedPayload(result));
        }
        catch (err) {
            next(err);
        }
    }

    public findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params as {id: string};
            const response = await this.userUseCase.findById(id);
            res.status(200).json({payload: response});
        }
        catch (err) {
            next(err);
        }
    }

    public findByEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {email} = req.params as {email: string};
            const response = await this.userUseCase.findByEmail(email);
            res.status(200).json({payload: response})
        }
        catch (err) {
            next(err);
        }
    }

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = req.body as UpdateUserDto;
            const response = await this.userUseCase.update(req.user!.sub, dto);
            res.status(200).json({description: "Usuario atualizado com sucesso", data: response});
        }
        catch (err) {
            next(err);
        }
    }

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.userUseCase.delete(req.user!.sub);
            res.status(200).json({description: "Usuario removido com sucesso"});
        }
        catch (err) {
            next(err);
        }
    }
}