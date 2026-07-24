import AppError from "../domain/errors/AppError";
import { PasswordHasherPort } from "../domain/ports/PasswordHasherPort";
import UserRepositoryPort from "../domain/ports/repository/UserRepositoryPort";
import { TokenServicePort } from "../domain/TokenServicePort";

export default class AuthUseCases {

    public constructor(
       private readonly userRepository: UserRepositoryPort,
       private readonly passwordHasher: PasswordHasherPort,
       private readonly tokenService : TokenServicePort
    ) {}

    public async sign({email, password}: {email: string, password: string}) {
        const user = await this.userRepository.findByEmail(email);

        if(!user) throw new AppError("Credenciais inválidas", 401);

        const result = await this.passwordHasher.compare(password, user.getPassword())

        if(!result) throw new AppError("Credenciais inválidas", 401)

        return this.tokenService.sign({
            sub: user.getId()!,
            iss: "reciclemais-bff",
            aud: "reciclemais-web",
            email: user.getEmail(),
            role: user.getRole()
        })
    }
}