import { Material } from "../../../domain/models/material";
import MaterialRepositoryPort from "../../../domain/ports/repository/MaterialRepositoryPort";
import { db } from "../../../infrastructure/database/client";
import { materialTable, MaterialRow } from "../../../infrastructure/database/schema/material.schema";
import { eq } from "drizzle-orm";
import AppError from "../../../domain/errors/AppError";
import { isForeignKeyViolation } from "./DrizzleErrors";

export default class DrizzleMaterialRepository implements MaterialRepositoryPort {

    async save(material: Material): Promise<Material> {
        const [row] = await db.insert(materialTable).values({
            name: material.getName(),
            importance: material.getImportance(),
            points_value: material.getPoints_value(),
            fk_user: material.getFk_user(),
        }).returning();

        return this.toDomain(row as MaterialRow);
    }

    async findById(id: number): Promise<Material | null> {
        const [row] = await db.select().from(materialTable).where(eq(materialTable.id, id));

        return row ? this.toDomain(row) : null;
    }

    async findAll(): Promise<Material[]> {
        const rows = await db.select().from(materialTable);

        return rows.map((row) => this.toDomain(row));
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

        return this.toDomain(row as MaterialRow);
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

    private toDomain(row: MaterialRow): Material {
        return new Material(row.id, row.name, row.importance, row.points_value, row.fk_user);
    }
}
