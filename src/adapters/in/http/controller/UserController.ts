import UserUseCase from "../../../../application/UserUseCase";
import { NextFunction, Request, Response } from "express"
import { CreateUserDto } from "../../../request/CreateUserDTO";
import { UpdateUserDto } from "../../../request/UpdateUserDTO";
import { fromUserCreateRequest } from "../../../out/mapper/UserMapper";
import Logger from "../../../../domain/ports/LoggerPort";


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
            const {id} = req.params as {id: string};
            const dto = req.body as UpdateUserDto;
            const response = await this.userUseCase.update(id, dto);
            res.status(200).json({description: "Usuario atualizado com sucesso", data: response});
        }
        catch (err) {
            next(err);
        }
    }

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params as {id: string};
            await this.userUseCase.delete(id);
            res.status(200).json({description: "Usuario removido com sucesso"});
        }
        catch (err) {
            next(err);
        }
    }
}