import { User } from "../../../domain/models/user";
import UserRepositoryPort from "../../../domain/ports/repository/UserRepositoryPort";
import { db } from "../../../infrastructure/database/client";
import { usersTable, UserRow } from "../../../infrastructure/database/schema/user.schema";
import { eq } from "drizzle-orm";
import AppError from "../../../domain/errors/AppError";
import { isForeignKeyViolation } from "./DrizzleErrors";

export default class DrizzleUserRepository implements UserRepositoryPort {

    private readonly MAX_DIFF_HASH = 10;

    async save(user: User): Promise<User> {

        const [row] = await db.insert(usersTable).values({
            name: user.getName(),
            email: user.getEmail(),
            cpf: user.getCpf(),
            password: user.getPassword()
        })
        .returning();

        return this.toDomain(row as UserRow);
    }

    async findById(id: string): Promise<User | null> {

        const [row] = await db.select()
        .from(usersTable).where(eq(usersTable.id, id));
        
        return row ? this.toDomain(row) : null;
    }

    async findByEmail(email: string): Promise<User | null> {

        const [row] = await db.select()
        .from(usersTable).where(eq(usersTable.email, email));

        return row ? this.toDomain(row) : null;
    }

    async update(user: User): Promise<User> {
        const [row] = await db.update(usersTable)
            .set({
                name: user.getName(),
                email: user.getEmail(),
                cpf: user.getCpf(),
            })
            .where(eq(usersTable.id, user.getId()!))
            .returning();

        return this.toDomain(row as UserRow);
    }

    async delete(id: string): Promise<void> {
        try {
            await db.delete(usersTable).where(eq(usersTable.id, id));
        } catch (err) {
            if (isForeignKeyViolation(err)) {
                throw new AppError("Usuário possui registros vinculados e não pode ser removido", 409);
            }
            throw err;
        }
    }

    private toDomain(userRow: UserRow): User {
        return new User(
            userRow.id,
            userRow.name,
            userRow.email,
            userRow.cpf,
            userRow.password,
            userRow.role
        );
    }
 
}