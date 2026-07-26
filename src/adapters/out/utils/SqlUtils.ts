import { count, SQL } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PgTable} from "drizzle-orm/pg-core";
import { PaginatedResult, PaginationParams } from "../../../domain/dto/Pagination";

export async function countRows(
    db: NodePgDatabase,
    table: PgTable,
    condition?: SQL,
): Promise<number> {
    const query = db.select({total: count()}).from(table);
    const [row] = condition ? await query.where(condition) : await query;

    return row?.total ?? 0;
}

export function emptyResult<T>(pagination: PaginationParams): PaginatedResult<T> {
    return { data: [], total: 0, page: pagination.page, limit: pagination.limit, totalPages: 0 };
}