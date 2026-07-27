import { Material } from "../../../domain/models/material";
import MaterialRepositoryPort from "../../../domain/ports/repository/MaterialRepositoryPort";
import { db } from "../../../infrastructure/database/client";
import { materialTable, MaterialRow } from "../../../infrastructure/database/schema/material.schema";
import { count, eq, ilike, SQL } from "drizzle-orm";
import AppError from "../../../domain/errors/AppError";
import { isForeignKeyViolation } from "./DrizzleErrors";
import { escapeLike } from "../../../utils/ScapeLike";
import { PaginatedResult, PaginationParams } from "../../../domain/dto/Pagination";
import { countRows, emptyResult } from "../utils/SqlUtils";
import { toMaterialDomain } from "../mapper/MaterialMapper";

export default class DrizzleMaterialRepository implements MaterialRepositoryPort {

    async findByTarget(target: string | null, pagination: PaginationParams): Promise<PaginatedResult<Material>> {
        if (target === null) {
            return this.findAll(pagination);
        }

        if (target.trim() == "") {
            return emptyResult(pagination);
        }

        const condition = ilike(materialTable.name, `%${this.normalizeTarget(target)}%`);
        const { page, limit } = pagination;

        const [rows, total] = await Promise.all([
            db.select().from(materialTable).where(condition).limit(limit).offset((page - 1) * limit),
            countRows(db, materialTable, condition),
        ]);

        return {
            data: rows.map((row) => toMaterialDomain(row)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async save(material: Material): Promise<Material> {
        const [row] = await db.insert(materialTable).values({
            name: material.getName(),
            importance: material.getImportance(),
            points_value: material.getPoints_value(),
            fk_user: material.getFk_user(),
        }).returning();

        return toMaterialDomain(row as MaterialRow);
    }

    async findById(id: number): Promise<Material | null> {
        const [row] = await db.select().from(materialTable).where(eq(materialTable.id, id));

        return row ? toMaterialDomain(row) : null;
    }

    async findAll(pagination: PaginationParams): Promise<PaginatedResult<Material>> {
        const { page, limit } = pagination;

        const [rows, total] = await Promise.all([
            db.select().from(materialTable).limit(limit).offset((page - 1) * limit),
            countRows(db, materialTable),
        ]);

        return {
            data: rows.map((row) => toMaterialDomain(row)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async update(material: Material): Promise<Material> {
        const [row] = await db.update(materialTable)
            .set({
                name: material.getName(),
                importance: material.getImportance(),
                points_value: material.getPoints_value(),
                fk_user: material.getFk_user(),
            })
            .where(eq(materialTable.id, material.getId()!))
            .returning();

        return toMaterialDomain(row as MaterialRow);
    }

    async delete(id: number): Promise<void> {
        try {
            await db.delete(materialTable).where(eq(materialTable.id, id));
        } catch (err) {
            if (isForeignKeyViolation(err)) {
                throw new AppError("Material está vinculado a entregas e não pode ser removido", 409);
            }
            throw err;
        }
    }

    private normalizeTarget(target: string) {
        return escapeLike(target.trim());
    }
}
