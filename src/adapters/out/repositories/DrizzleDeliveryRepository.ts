import { Delivery, DeliveryStatus } from "../../../domain/models/delivery";
import DeliveryRepositoryPort from "../../../domain/ports/repository/DeliveryRepositoryPort";
import { db } from "../../../infrastructure/database/client";
import { deliveryTable, DeliveryRow } from "../../../infrastructure/database/schema/delivery.schema";
import { count, eq } from "drizzle-orm";
import { PaginatedResult, PaginationParams } from "../../../domain/dto/Pagination";

export default class DrizzleDeliveryRepository implements DeliveryRepositoryPort {

    async save(delivery: Delivery): Promise<Delivery> {
        const [row] = await db.insert(deliveryTable).values({
            local: delivery.getLocal(),
            material_type: delivery.getMaterial_type(),
            status: delivery.getStatus(),
            quantity: delivery.getQuantity(),
            evidence_url: delivery.getEvidence_url(),
            fk_user: delivery.getFk_user(),
            fk_material: delivery.getFk_material(),
        }).returning();

        return this.toDomain(row as DeliveryRow);
    }

    async findById(id: number): Promise<Delivery | null> {
        const [row] = await db.select().from(deliveryTable).where(eq(deliveryTable.id, id));

        return row ? this.toDomain(row) : null;
    }

    async findAll(pagination: PaginationParams): Promise<PaginatedResult<Delivery>> {
        const { page, limit } = pagination;

        const [rows, [totalRow]] = await Promise.all([
            db.select().from(deliveryTable).limit(limit).offset((page - 1) * limit),
            db.select({ total: count() }).from(deliveryTable),
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

    async update(delivery: Delivery): Promise<Delivery> {
        const [row] = await db.update(deliveryTable)
            .set({
                local: delivery.getLocal(),
                material_type: delivery.getMaterial_type(),
                status: delivery.getStatus(),
                quantity: delivery.getQuantity(),
                evidence_url: delivery.getEvidence_url(),
                fk_user: delivery.getFk_user(),
                fk_material: delivery.getFk_material(),
            })
            .where(eq(deliveryTable.id, delivery.getId()!))
            .returning();

        return this.toDomain(row as DeliveryRow);
    }

    async delete(id: number): Promise<void> {
        await db.delete(deliveryTable).where(eq(deliveryTable.id, id));
    }

    private toDomain(row: DeliveryRow): Delivery {
        return new Delivery(
            row.id,
            row.local,
            row.material_type,
            row.status as DeliveryStatus,
            row.quantity,
            row.evidence_url,
            row.fk_user,
            row.fk_material
        );
    }
}
