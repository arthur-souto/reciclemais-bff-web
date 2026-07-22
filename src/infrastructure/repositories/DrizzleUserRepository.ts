import { User } from "../../domain/models/user";
import UserRepositoryPort from "../../domain/ports/repository/UserRepositoryPort";
import { db } from "../database/client";
import {hashSync} from "bcrypt";
import { usersTable, UserRow } from "../database/schema/user.schema";
import { eq } from "drizzle-orm";

export default class DrizzleUserRepository implements UserRepositoryPort {

    private readonly MAX_DIFF_HASH = 10;

    async save(user: User): Promise<User> {

        const [row] = await db.insert(usersTable).values({
            name: user.getName(),
            email: user.getEmail(),
            cpf: user.getCpf(),
            password: hashSync(user.getPassword(), this.MAX_DIFF_HASH)
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

    private toDomain(userRow: UserRow): User {
        return new User(
            userRow.id,
            userRow.name,
            userRow.email,
            userRow.cpf,
            userRow.password
        );
    }
 
}