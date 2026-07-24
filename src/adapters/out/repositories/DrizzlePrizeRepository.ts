import { Prize } from "../../../domain/models/prize";
import PrizeRepositoryPort from "../../../domain/ports/repository/PrizeRepositoryPort";
import { db } from "../../../infrastructure/database/client";
import { prizeTable, PrizeRow } from "../../../infrastructure/database/schema/prize.schema";
import { eq } from "drizzle-orm";

export default class DrizzlePrizeRepository implements PrizeRepositoryPort {

    async save(prize: Prize): Promise<Prize> {
        const [row] = await db.insert(prizeTable).values({
            name: prize.getName(),
            required_points: prize.getRequired_points(),
            description: prize.getDescription(),
            fk_user: prize.getFk_user(),
        }).returning();

        return this.toDomain(row as PrizeRow);
    }

    async findById(id: number): Promise<Prize | null> {
        const [row] = await db.select().from(prizeTable).where(eq(prizeTable.id, id));

        return row ? this.toDomain(row) : null;
    }

    async findAll(): Promise<Prize[]> {
        const rows = await db.select().from(prizeTable);

        return rows.map((row) => this.toDomain(row));
    }

    async update(prize: Prize): Promise<Prize> {
        const [row] = await db.update(prizeTable)
            .set({
                name: prize.getName(),
                required_points: prize.getRequired_points(),
                description: prize.getDescription(),
                fk_user: prize.getFk_user(),
            })
            .where(eq(prizeTable.id, prize.getId()!))
            .returning();

        return this.toDomain(row as PrizeRow);
    }

    async delete(id: number): Promise<void> {
        await db.delete(prizeTable).where(eq(prizeTable.id, id));
    }

    private toDomain(row: PrizeRow): Prize {
        return new Prize(row.id, row.name, row.required_points, row.description, row.fk_user);
    }
}
