import { Prize, PrizeStatus, PrizeType } from "../../../domain/models/prize";
import PrizeRepositoryPort from "../../../domain/ports/repository/PrizeRepositoryPort";
import { db, DbClient } from "../../../infrastructure/database/client";
import { prizeTable, PrizeRow } from "../../../infrastructure/database/schema/prize.schema";
import { and, count, eq, gte, sql } from "drizzle-orm";
import { PaginatedResult, PaginationParams } from "../../../domain/dto/Pagination";

export default class DrizzlePrizeRepository implements PrizeRepositoryPort {

    private readonly DEFAULT_LIMIT_DECREMENT_QUANTITY: number = 1;

    async decrementQuantity(prizeId: number, tx?: unknown): Promise<boolean> {
        const executor = (tx as DbClient) ?? db;

        const [row] = await executor.update(prizeTable)
        .set({
            quantity: sql`${prizeTable.quantity} - ${this.DEFAULT_LIMIT_DECREMENT_QUANTITY}`
        })
        .where(
            and(
                eq(prizeTable.id, prizeId),
                gte(prizeTable.quantity, this.DEFAULT_LIMIT_DECREMENT_QUANTITY)
            )
        )
        .returning();
        
        return !!row;
    }

    async save(prize: Prize): Promise<Prize> {
        const [row] = await db.insert(prizeTable).values({
            name: prize.getName(),
            required_points: prize.getRequired_points(),
            quantity: prize.getQuantity(),
            image_url: prize.getImage_url(),
            description: prize.getDescription(),
            status: prize.getStatus(),
            type: prize.getType(),
            category: prize.getCategory(),
            expiration_date: prize.getExpiration_date(),
            created_at: prize.getCreated_at(),
            updated_at: prize.getUpdated_at(),
            fk_created_by: prize.getFk_created_by(),
        }).returning();

        return this.toDomain(row as PrizeRow);
    }

    async findById(id: number): Promise<Prize | null> {
        const [row] = await db.select().from(prizeTable).where(eq(prizeTable.id, id));

        return row ? this.toDomain(row) : null;
    }

    async findAll(pagination: PaginationParams): Promise<PaginatedResult<Prize>> {
        const { page, limit } = pagination;

        const [rows, [totalRow]] = await Promise.all([
            db.select().from(prizeTable).limit(limit).offset((page - 1) * limit),
            db.select({ total: count() }).from(prizeTable),
        ]);
        const total = totalRow?.total ?? 0;

        return {
            data: rows.map((row) => this.toDomain(row)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async update(prize: Prize): Promise<Prize> {
        const [row] = await db.update(prizeTable)
            .set({
                name: prize.getName(),
                required_points: prize.getRequired_points(),
                quantity: prize.getQuantity(),
                image_url: prize.getImage_url(),
                description: prize.getDescription(),
                status: prize.getStatus(),
                type: prize.getType(),
                category: prize.getCategory(),
                expiration_date: prize.getExpiration_date(),
                updated_at: new Date(),
                fk_created_by: prize.getFk_created_by(),
            })
            .where(eq(prizeTable.id, prize.getId()!))
            .returning();

        return this.toDomain(row as PrizeRow);
    }

    async delete(id: number): Promise<void> {
        await db.delete(prizeTable).where(eq(prizeTable.id, id));
    }

    private toDomain(row: PrizeRow): Prize {
        return new Prize(
            row.id,
            row.name,
            row.required_points,
            row.quantity,
            row.image_url,
            row.description,
            row.status as PrizeStatus,
            row.type as PrizeType,
            row.category,
            row.expiration_date,
            row.created_at ?? new Date(0),
            row.updated_at ?? new Date(0),
            row.fk_created_by
        );
    }
}
