import { NextFunction, Request, Response } from "express";
import AuthUseCases from "../../../../application/AuthUseCases";
import Logger from "../../../../domain/ports/LoggerPort";
import { LoginDto } from "../../../request/LoginDTO";

export default class AuthController {

    public constructor(private authUseCases: AuthUseCases, private log: Logger) {}

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = req.body as LoginDto;
            this.log.info("Iniciando login", { email: dto.email });

            const token = await this.authUseCases.sign(dto);
            res.status(200).json({ description: "Login realizado com sucesso",
                accessToken: token
             });
        }
        catch (err) {
            next(err);
        }
    }
}
