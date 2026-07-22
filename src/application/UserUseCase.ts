import { toUserResponse } from "../adapters/out/mapper/UserMapper";
import { User } from "../domain/models/user";
import UserRepositoryPort from "../domain/ports/repository/UserRepositoryPort";

export default class UserUseCase {

    public constructor(private readonly repository: UserRepositoryPort) {}

    public async createUser(user: User) {
        return toUserResponse(await this.repository.save(user));
    }

    public async findById(id: string) {
        const user = await this.repository.findById(id);
        return user ? toUserResponse(user) : null;
    }

    public async findByEmail(email: string) {
        const user = await this.repository.findByEmail(email);
        return user ? toUserResponse(user) : null;
    }
}