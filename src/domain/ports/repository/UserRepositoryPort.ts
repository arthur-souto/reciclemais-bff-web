import { User } from "../../models/user";

export default interface UserRepositoryPort {
    save(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>
    update(user: User): Promise<User>;
    decrementScoreIfEnough(user: User, score: number, tx?: unknown): Promise<boolean>
    incrementScore(user: User, score: number, tx?: unknown): Promise<number>
    delete(id: string): Promise<void>;
}