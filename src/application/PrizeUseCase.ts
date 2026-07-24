import { toPrizeResponse, fromPrizeCreateRequest, applyPrizeUpdateRequest } from "../adapters/out/mapper/PrizeMapper";
import PrizeRepositoryPort from "../domain/ports/repository/PrizeRepositoryPort";
import AppError from "../domain/errors/AppError";
import { CreatePrizeDto } from "../adapters/request/CreatePrizeDTO";
import { UpdatePrizeDto } from "../adapters/request/UpdatePrizeDTO";

export default class PrizeUseCase {

    public constructor(private readonly repository: PrizeRepositoryPort) {}

    public async create(dto: CreatePrizeDto, fk_user: string) {
        return toPrizeResponse(await this.repository.save(fromPrizeCreateRequest(dto, fk_user)));
    }

    public async findById(id: string) {
        const prize = await this.repository.findById(this.parseId(id));
        if (!prize) {
            throw new AppError("Prêmio não encontrado", 404);
        }
        return toPrizeResponse(prize);
    }

    public async findAll() {
        const prizes = await this.repository.findAll();
        return prizes.map(toPrizeResponse);
    }

    public async update(id: string, dto: UpdatePrizeDto) {
        const prize = await this.repository.findById(this.parseId(id));
        if (!prize) {
            throw new AppError("Prêmio não encontrado", 404);
        }

        applyPrizeUpdateRequest(prize, dto);
        return toPrizeResponse(await this.repository.update(prize));
    }

    public async delete(id: string) {
        const numericId = this.parseId(id);
        const prize = await this.repository.findById(numericId);
        if (!prize) {
            throw new AppError("Prêmio não encontrado", 404);
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
