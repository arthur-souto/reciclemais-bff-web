import { Request } from "express";
import { PaginatedResult, PaginationParams } from "../../../../domain/dto/Pagination";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function parsePagination(req: Request): PaginationParams {
    return {
        page: toPositiveInt(req.query.page, DEFAULT_PAGE),
        limit: Math.min(toPositiveInt(req.query.limit, DEFAULT_LIMIT), MAX_LIMIT),
    };
}

export function paginatedPayload<T>(result: PaginatedResult<T>) {
    return {
        payload: result.data,
        meta: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
        },
    };
}

function toPositiveInt(value: unknown, fallback: number): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
