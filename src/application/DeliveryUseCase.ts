import { toDeliveryResponse, fromDeliveryCreateRequest, applyDeliveryUpdateRequest } from "../adapters/out/mapper/DeliveryMapper";
import DeliveryRepositoryPort from "../domain/ports/repository/DeliveryRepositoryPort";
import MaterialRepositoryPort from "../domain/ports/repository/MaterialRepositoryPort";
import AppError from "../domain/errors/AppError";
import { CreateDeliveryDto } from "../adapters/request/CreateDeliveryDTO";
import { UpdateDeliveryDto } from "../adapters/request/UpdateDeliveryDTO";

export default class DeliveryUseCase {

    public constructor(
        private readonly repository: DeliveryRepositoryPort,
        private readonly materialRepository: MaterialRepositoryPort
    ) {}

    public async create(dto: CreateDeliveryDto, fk_user: string) {
        await this.ensureMaterialExists(dto.fk_material);

        return toDeliveryResponse(await this.repository.save(fromDeliveryCreateRequest(dto, fk_user)));
    }

    public async findById(id: string) {
        const delivery = await this.repository.findById(this.parseId(id));
        if (!delivery) {
            throw new AppError("Entrega não encontrada", 404);
        }
        return toDeliveryResponse(delivery);
    }

    public async findAll() {
        const deliveries = await this.repository.findAll();
        return deliveries.map(toDeliveryResponse);
    }

    public async update(id: string, dto: UpdateDeliveryDto) {
        const delivery = await this.repository.findById(this.parseId(id));
        if (!delivery) {
            throw new AppError("Entrega não encontrada", 404);
        }

        if (dto.fk_material !== undefined) {
            await this.ensureMaterialExists(dto.fk_material);
        }

        applyDeliveryUpdateRequest(delivery, dto);
        return toDeliveryResponse(await this.repository.update(delivery));
    }

    public async delete(id: string) {
        const numericId = this.parseId(id);
        const delivery = await this.repository.findById(numericId);
        if (!delivery) {
            throw new AppError("Entrega não encontrada", 404);
        }

        await this.repository.delete(numericId);
    }

    private async ensureMaterialExists(fk_material: number): Promise<void> {
        const material = await this.materialRepository.findById(fk_material);
        if (!material) {
            throw new AppError("Material não encontrado", 404);
        }
    }

    private parseId(id: string): number {
        const numericId = Number(id);
        if (!Number.isInteger(numericId) || numericId <= 0) {
            throw new AppError("ID inválido", 400);
        }
        return numericId;
    }
}
