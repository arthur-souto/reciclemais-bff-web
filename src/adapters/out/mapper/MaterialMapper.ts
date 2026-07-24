import { Material } from "../../../domain/models/material";
import { CreateMaterialDto } from "../../request/CreateMaterialDTO";
import { UpdateMaterialDto } from "../../request/UpdateMaterialDTO";

export function toMaterialResponse(material: Material): {
    id: number | null;
    name: string;
    importance: number;
    points_value: number;
    fk_user: string | null;
} {
    return {
        id: material.getId(),
        name: material.getName(),
        importance: material.getImportance(),
        points_value: material.getPoints_value(),
        fk_user: material.getFk_user(),
    };
}

export function fromMaterialCreateRequest(req: CreateMaterialDto, fk_user: string): Material {
    return new Material(null, req.name, req.importance, req.points_value, fk_user);
}

export function applyMaterialUpdateRequest(material: Material, req: UpdateMaterialDto): Material {
    if (req.name !== undefined) material.setName(req.name);
    if (req.importance !== undefined) material.setImportance(req.importance);
    if (req.points_value !== undefined) material.setPoints_value(req.points_value);
    return material;
}
