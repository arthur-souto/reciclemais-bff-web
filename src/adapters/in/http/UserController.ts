import UserUseCase from "../../../application/UserUseCase";
import { Request, Response } from "express"
import { CreateUserDto } from "../../request/CreateUserDTO";
import { fromUserCreateRequest } from "../../out/mapper/UserMapper";
import Logger from "../../../domain/ports/LoggerPort";


export default class UserController {

    public constructor(private userUseCase: UserUseCase, private log: Logger) {}

    public createUser = async (req: Request, res: Response) => {
        try {
            const dto = req.body as CreateUserDto;
            this.log.info("Iniciando criação de usuario", {data: dto});

            const response = await this.userUseCase.createUser(fromUserCreateRequest(dto));
            res.status(201).json({description: "Usuario criado com sucesso", data: response});
        }
        catch (err) {
            this.log.error("Erro ao criar usuario", {error: err})
            res.status(500).json({ error: "Erro ao criar usuario" });
        }
    }

    public findById = async (req: Request, res: Response) => {
        try {
            // implementar depois
        }
        catch (err) {
            res.status(500).json({ error: "Erro ao criar usuario" });
        }
    }

    public findByEmail = async (req: Request, res: Response) => {
        try {
            // implementar
        }
        catch (err) {
            res.status(500).json({ error: "Erro ao criar usuario" });
        }
    }
}