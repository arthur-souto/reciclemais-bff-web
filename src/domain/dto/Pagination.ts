export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export function mapPaginatedResult<T, R>(result: PaginatedResult<T>, mapper: (item: T) => R): PaginatedResult<R> {
    return { ...result, data: result.data.map(mapper) };
}
