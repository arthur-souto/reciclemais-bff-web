import { User } from "../../models/user";

export default interface UserRepositoryPort {
    save(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>
}