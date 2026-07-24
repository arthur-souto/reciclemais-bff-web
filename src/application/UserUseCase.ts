import { toUserResponse, applyUserUpdateRequest } from "../adapters/out/mapper/UserMapper";
import { User } from "../domain/models/user";
import UserRepositoryPort from "../domain/ports/repository/UserRepositoryPort";
import AppError from "../domain/errors/AppError";
import { PasswordHasherPort } from "../domain/ports/PasswordHasherPort";
import { UpdateUserDto } from "../adapters/request/UpdateUserDTO";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default class UserUseCase {

    public constructor(private readonly repository: UserRepositoryPort, private readonly passwordHasher: PasswordHasherPort) {}

    public async createUser(user: User) {
        let hash = await this.passwordHasher.hash(user.getPassword())
        user.setPassword(hash)
        
        return toUserResponse(await this.repository.save(user));
    }

    public async findById(id: string) {
        if (!UUID_REGEX.test(id)) {
            throw new AppError("ID inválido", 400);
        }

        const user = await this.repository.findById(id);
        if (!user) {
            throw new AppError("Usuário não encontrado", 404);
        }
        return toUserResponse(user);
    }

    public async findByEmail(email: string) {
        const user = await this.repository.findByEmail(email);
        if (!user) {
            throw new AppError("Usuário não encontrado", 404);
        }
        return toUserResponse(user);
    }

    public async update(id: string, dto: UpdateUserDto) {
        if (!UUID_REGEX.test(id)) {
            throw new AppError("ID inválido", 400);
        }

        const user = await this.repository.findById(id);
        if (!user) {
            throw new AppError("Usuário não encontrado", 404);
        }

        applyUserUpdateRequest(user, dto);
        return toUserResponse(await this.repository.update(user));
    }

    public async delete(id: string) {
        if (!UUID_REGEX.test(id)) {
            throw new AppError("ID inválido", 400);
        }

        const user = await this.repository.findById(id);
        if (!user) {
            throw new AppError("Usuário não encontrado", 404);
        }

        await this.repository.delete(id);
    }
}