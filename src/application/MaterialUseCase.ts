import { toMaterialResponse, fromMaterialCreateRequest, applyMaterialUpdateRequest } from "../adapters/out/mapper/MaterialMapper";
import MaterialRepositoryPort from "../domain/ports/repository/MaterialRepositoryPort";
import AppError from "../domain/errors/AppError";
import { CreateMaterialDto } from "../adapters/request/CreateMaterialDTO";
import { UpdateMaterialDto } from "../adapters/request/UpdateMaterialDTO";
import { mapPaginatedResult, PaginationParams } from "../domain/dto/Pagination";

export default class MaterialUseCase {

    public constructor(private readonly repository: MaterialRepositoryPort) {}

    public async create(dto: CreateMaterialDto, fk_user: string) {
        return toMaterialResponse(await this.repository.save(fromMaterialCreateRequest(dto, fk_user)));
    }

    public async findByTarget(target: string | null, pagination: PaginationParams) {
        const result = await this.repository.findByTarget(target, pagination);
        return mapPaginatedResult(result, toMaterialResponse);
    }

    public async findById(id: string) {
        const material = await this.repository.findById(this.parseId(id));
        if (!material) {
            throw new AppError("Material não encontrado", 404);
        }
        return toMaterialResponse(material);
    }

    public async findAll(pagination: PaginationParams) {
        const result = await this.repository.findAll(pagination);
        return mapPaginatedResult(result, toMaterialResponse);
    }

    public async update(id: string, dto: UpdateMaterialDto) {
        const material = await this.repository.findById(this.parseId(id));
        if (!material) {
            throw new AppError("Material não encontrado", 404);
        }

        applyMaterialUpdateRequest(material, dto);
        return toMaterialResponse(await this.repository.update(material));
    }

    public async delete(id: string) {
        const numericId = this.parseId(id);
        const material = await this.repository.findById(numericId);
        if (!material) {
            throw new AppError("Material não encontrado", 404);
        }

        await this.repository.delete(numericId);
    }

    private parseId(id: string): number {
        const numericId = Number(id);
        if (!Number.isInteger(numericId) || numericId <= 0) {
            throw new AppError("ID inválido", 400);
        }
        return numericId;
    }
}
