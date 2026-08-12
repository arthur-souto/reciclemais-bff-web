import { User } from "../../../domain/models/user";
import UserRepositoryPort from "../../../domain/ports/repository/UserRepositoryPort";
import { db, DbClient } from "../../../infrastructure/database/client";
import { usersTable, UserRow } from "../../../infrastructure/database/schema/user.schema";
import { and, eq, gte, sql } from "drizzle-orm";
import AppError from "../../../domain/errors/AppError";
import { isForeignKeyViolation } from "./DrizzleErrors";

export default class DrizzleUserRepository implements UserRepositoryPort {
    
    async decrementScoreIfEnough(user: User, score: number, tx?: unknown): Promise<boolean> {
        const executor = (tx as DbClient) ?? db;

        const [row] = await executor.update(usersTable)
        .set({
            total_score: sql`${usersTable.total_score} - ${score}`
        })
        .where(
            and(
                eq(usersTable.id, user.getId()!),
                gte(usersTable.total_score, score)
            )
        )
        .returning();

        return !!row;
    }
    
    async save(user: User): Promise<User> {

        const [row] = await db.insert(usersTable).values({
            name: user.getName(),
            email: user.getEmail(),
            cpf: user.getCpf(),
            password: user.getPassword(),
            profile_image: user.getProfileImage(),
            phone: user.getPhone(),
            cep: user.getCep(),
            address: user.getAddress(),
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

    async incrementScore(user: User, score: number, tx?: unknown): Promise<number> {
        const executor = (tx as DbClient) ?? db;

        const [row] = await executor.update(usersTable)
        .set({
            total_score: user.getTotalScore() + score
        })
        .where(eq(usersTable.id, user.getId()!))
        .returning()

        return row?.total_score!;
    }

    async update(user: User): Promise<User> {
        const [row] = await db.update(usersTable)
            .set({
                name: user.getName(),
                email: user.getEmail(),
                cpf: user.getCpf(),
                profile_image: user.getProfileImage(),
                phone: user.getPhone(),
                cep: user.getCep(),
                address: user.getAddress(),
                updated_at: new Date(),
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
            userRow.role,
            userRow.profile_image,
            userRow.phone,
            userRow.cep,
            userRow.address,
            userRow.total_score,
            userRow.created_at ?? new Date(),
            userRow.updated_at ?? new Date()
        );
    }
 
}