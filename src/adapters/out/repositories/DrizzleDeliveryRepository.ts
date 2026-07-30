import { Delivery, DeliveryStatus } from "../../../domain/models/delivery";
import DeliveryRepositoryPort from "../../../domain/ports/repository/DeliveryRepositoryPort";
import { db, DbClient } from "../../../infrastructure/database/client";
import { deliveryTable, DeliveryRow } from "../../../infrastructure/database/schema/delivery.schema";
import { count, desc, eq } from "drizzle-orm";
import { PaginatedResult, PaginationParams } from "../../../domain/dto/Pagination";
import { MaterialRow, materialTable } from "../../../infrastructure/database/schema/material.schema";
import { toMaterialDomain } from "../mapper/MaterialMapper";

export default class DrizzleDeliveryRepository implements DeliveryRepositoryPort {

    
    async findByIdIncludeDelivery(id: number): Promise<Delivery | null> {
        const [row] = await db.select(
            {
                delivery: deliveryTable,
                material: materialTable
            }
        ).
            from(deliveryTable).
            leftJoin(materialTable, eq(deliveryTable.fk_material, materialTable.id)).
            where(eq(deliveryTable.id, id));

        if (!row) return null;

        if (row.material) {
            return this.toDomain(row.delivery, row.material);
        }

        return this.toDomain(row.delivery);
    }

    async save(delivery: Delivery): Promise<Delivery> {
        const [row] = await db.insert(deliveryTable).values({
            local: delivery.getLocal(),
            material_type: delivery.getMaterial_type(),
            status: delivery.getStatus(),
            quantity: delivery.getQuantity(),
            weight: delivery.getWeight(),
            total_score: delivery.getTotal_score(),
            evidence_url: delivery.getEvidence_url(),
            collected_at: delivery.getCollected_at(),
            latitude: delivery.getLatitude(),
            longitude: delivery.getLongitude(),
            created_at: delivery.getCreated_at(),
            updated_at: delivery.getUpdated_at(),
            fk_user: delivery.getFk_user(),
            fk_material: delivery.getFk_material(),
            fk_approved_by: delivery.getFk_approved_by(),
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
            db.select(
                {
                    delivery: deliveryTable,
                    material: materialTable
                }
            ).from(deliveryTable)
                .leftJoin(materialTable, eq(deliveryTable.fk_material, materialTable.id))
                .limit(limit).offset((page - 1) * limit)
                .orderBy(desc(deliveryTable.created_at)),
                
            db.select({ total: count() }).from(deliveryTable)
        ]);
        const total = totalRow?.total ?? 0;

        return {
            data: rows.map((row) => this.toDomain(row.delivery, row.material ?? undefined)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async update(delivery: Delivery, tx?: unknown): Promise<Delivery> {
        const executor = (tx as DbClient) ?? db;

        const [row] = await executor.update(deliveryTable)
            .set({
                local: delivery.getLocal(),
                material_type: delivery.getMaterial_type(),
                status: delivery.getStatus(),
                quantity: delivery.getQuantity(),
                total_score: delivery.getTotal_score(),
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

    private toDomain(row: DeliveryRow, material?: MaterialRow): Delivery {
        const delivery = new Delivery(
            row.id,
            row.local,
            row.material_type,
            row.status as DeliveryStatus,
            row.quantity,
            row.weight ?? 0,
            row.total_score ?? 0,
            row.evidence_url,
            row.collected_at ?? new Date(0),
            row.latitude ?? 0,
            row.longitude ?? 0,
            row.created_at ?? new Date(0),
            row.updated_at ?? new Date(0),
            row.fk_user,
            row.fk_material,
            row.fk_approved_by
        );

        if (material !== undefined) {
            delivery.setMaterial(
                toMaterialDomain(material)
            )
        }

        return delivery
    }
}
