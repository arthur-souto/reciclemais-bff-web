import { PrizeRedemption } from "../../../domain/models/prizeRedemption";
import PrizeRedemptionRepositoryPort from "../../../domain/ports/repository/PrizeRedemptionRepositoryPort";
import { db, DbClient } from "../../../infrastructure/database/client";
import { prizeRedemptionTable, PrizeRedemptionRow } from "../../../infrastructure/database/schema/prizeRedemption.schema";
import { and, count, desc, eq } from "drizzle-orm";
import { PaginatedResult, PaginationParams } from "../../../domain/dto/Pagination";

export default class DrizzlePrizeRedemptionRepository implements PrizeRedemptionRepositoryPort {
    async existsByUserAndPrize(fk_user: string, fk_prize: number): Promise<boolean> {
        
        const result = await db.select({ id: prizeRedemptionTable.id}).from(prizeRedemptionTable)
        .where(
            and(
                eq(prizeRedemptionTable.fk_user, fk_user),
                eq(prizeRedemptionTable.fk_prize, fk_prize)
            )
        )
        .limit(1);

        return result.length > 0;
    }

    async create(redemption: PrizeRedemption, tx?: unknown): Promise<PrizeRedemption> {
        const executor = (tx as DbClient) ?? db;

        const [row] = await executor.insert(prizeRedemptionTable).values({
            fk_prize: redemption.getFk_prize(),
            fk_user: redemption.getFk_user(),
            redeemed_at: redemption.getRedeemed_at(),
        }).returning();

        return this.toDomain(row as PrizeRedemptionRow);
    }

    async findByUser(fk_user: string, pagination: PaginationParams): Promise<PaginatedResult<PrizeRedemption>> {
        const { page, limit } = pagination;

        const [rows, [totalRow]] = await Promise.all([
            db.select().from(prizeRedemptionTable)
                .where(eq(prizeRedemptionTable.fk_user, fk_user))
                .limit(limit).offset((page - 1) * limit)
                .orderBy(desc(prizeRedemptionTable.redeemed_at)),
            db.select({ total: count() }).from(prizeRedemptionTable)
                .where(eq(prizeRedemptionTable.fk_user, fk_user)),
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

    async findByPrize(fk_prize: number, pagination: PaginationParams): Promise<PaginatedResult<PrizeRedemption>> {
        const { page, limit } = pagination;

        const [rows, [totalRow]] = await Promise.all([
            db.select().from(prizeRedemptionTable)
                .where(eq(prizeRedemptionTable.fk_prize, fk_prize))
                .limit(limit).offset((page - 1) * limit)
                .orderBy(desc(prizeRedemptionTable.redeemed_at)),
            db.select({ total: count() }).from(prizeRedemptionTable)
                .where(eq(prizeRedemptionTable.fk_prize, fk_prize)),
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

    private toDomain(row: PrizeRedemptionRow): PrizeRedemption {
        return new PrizeRedemption(row.id, row.fk_prize, row.fk_user, row.redeemed_at ?? new Date(0));
    }
}
